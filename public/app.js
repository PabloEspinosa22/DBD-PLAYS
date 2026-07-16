// --- VARIABLES GLOBALES DE DATOS ---
let killersList = [];
let survivorsList = [];
let fullRoster = [];

// --- VARIABLES DE ESTADO DE JUEGO ---
let activeAppMode = ""; 
let activeSubMode = ""; 

let targetCharacter = null;
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let currentRunScore = 0;
let totalLives = 3;

// Persistencia de usuario
let totalBloodpoints = parseInt(localStorage.getItem('totalBP')) || 0;
let perks = { djv: false, bbq: false, dh: false };

const rituals = [
    { id: 'perfect', desc: "Adivina un personaje con 0 errores (+5000 PB)", reward: 5000 },
    { id: 'clutch', desc: "Gana una ronda en estado crítico (5 errores) (+4000 PB)", reward: 4000 },
    { id: 'hatch', desc: "Escapa por la trampilla (+10000 PB)", reward: 10000 }
];
let activeRitual = JSON.parse(localStorage.getItem('ritual')) || rituals[Math.floor(Math.random() * rituals.length)];

// --- SISTEMA DE AUDIO ---
let isMuted = false;
const bgMusic = new Audio('audio/theme.mp3'); bgMusic.loop = true; bgMusic.volume = 0.3;
const heartbeatAudio = new Audio('audio/heartbeat.mp3'); heartbeatAudio.loop = true;
const hitSound = new Audio('audio/hit.mp3');
const hatchSound = new Audio('audio/hatch.mp3');

window.toggleMute = function() {
    isMuted = !isMuted;
    bgMusic.muted = isMuted; heartbeatAudio.muted = isMuted; hitSound.muted = isMuted; hatchSound.muted = isMuted;
    const muteBtn = document.getElementById('mute-btn');
    if(isMuted) { muteBtn.innerText = "🔇 Sonido: OFF"; muteBtn.classList.add('muted'); } 
    else { muteBtn.innerText = "🔊 Sonido: ON"; muteBtn.classList.remove('muted'); if(activeAppMode !== "") bgMusic.play().catch(e=>{}); }
}

// --- INICIALIZADOR ---
async function init() {
    try {
        const kRes = await fetch('/api/killers');
        const sRes = await fetch('/api/survivors');
        
        const rawK = await kRes.json();
        const rawS = await sRes.json();

        killersList = rawK.map(k => ({...k, rol: 'Asesino'}));
        survivorsList = rawS.map(s => ({...s, rol: 'Superviviente'}));
        fullRoster = [...killersList, ...survivorsList];

        updateMenuHub();
    } catch (e) {
        document.getElementById('ritual-desc').innerText = "Error al conectar con los servidores de la Entidad.";
    }
}

function updateMenuHub() {
    document.getElementById('total-bp').innerText = totalBloodpoints;
    localStorage.setItem('totalBP', totalBloodpoints);
    
    let rankText = "Ceniza IV"; let rankColor = "#8d6e63";
    if(totalBloodpoints > 100000) { rankText = "Iridiscente I"; rankColor = "#ff0033"; }
    else if(totalBloodpoints > 50000) { rankText = "Oro I"; rankColor = "#ffca28"; }
    else if(totalBloodpoints > 20000) { rankText = "Plata I"; rankColor = "#e0e0e0"; }
    else if(totalBloodpoints > 5000) { rankText = "Bronce I"; rankColor = "#cd7f32"; }
    
    const rankDisplay = document.getElementById('rank-display');
    rankDisplay.innerText = `Rango: ${rankText}`; rankDisplay.style.color = rankColor;
    document.getElementById('ritual-desc').innerText = activeRitual.desc;
    localStorage.setItem('ritual', JSON.stringify(activeRitual));
}

window.buyPerk = function(perkId, cost) {
    const perkMsg = document.getElementById('perk-msg');
    if (perks[perkId]) { perkMsg.innerText = "Ya posees esta ventaja."; return; }
    if (totalBloodpoints >= cost) {
        totalBloodpoints -= cost; perks[perkId] = true;
        document.getElementById(`btn-${perkId}`).classList.add('active');
        perkMsg.innerText = "¡Ventaja equipada!"; updateMenuHub();
    } else { perkMsg.innerText = "Puntos de Sangre insuficientes."; }
}

// --- NAVEGACIÓN GENERAL ---
function returnToHub() {
    activeAppMode = "";
    heartbeatAudio.pause(); bgMusic.pause();
    document.getElementById('game-area').classList.add('hidden');
    document.getElementById('final-game-over-modal').classList.add('hidden');
    document.getElementById('victory-modal').classList.add('hidden');
    document.getElementById('roulette-modal').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
    updateMenuHub();
}

function normalizeStr(str) { 
    return str.replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I').replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U'); 
}

// =========================================================================
//                         1. MODO AHORCADO CLÁSICO
// =========================================================================
let availableHangmanRoster = [];

function launchHangman(subMode) {
    activeAppMode = "hangman"; activeSubMode = subMode;
    currentRunScore = 0; totalLives = 3;
    
    availableHangmanRoster = (subMode === 'killer') ? [...killersList] : (subMode === 'survivor') ? [...survivorsList] : [...fullRoster];
    
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    document.getElementById('game-stats-header').classList.remove('hidden');
    
    document.getElementById('classic-hangman-ui').classList.remove('hidden');
    document.getElementById('archive-ui').classList.add('hidden');
    document.getElementById('catalog-view').classList.add('hidden');
    document.getElementById('roulette-view').classList.add('hidden');

    let titleText = (subMode === 'killer') ? "AHORCADO: ASESINOS" : (subMode === 'survivor') ? "AHORCADO: SUPERVIVIENTES" : "AHORCADO: TODO EL REINO";
    document.getElementById('game-area-title').innerText = titleText;
    if(!isMuted) bgMusic.play().catch(e=>{});

    nextHangmanRound();
}

function nextHangmanRound() {
    if (availableHangmanRoster.length === 0) {
        availableHangmanRoster = (activeSubMode === 'killer') ? [...killersList] : (activeSubMode === 'survivor') ? [...survivorsList] : [...fullRoster];
    }
    const idx = Math.floor(Math.random() * availableHangmanRoster.length);
    targetCharacter = availableHangmanRoster.splice(idx, 1)[0];

    guessedLetters = []; mistakes = 0; 
    document.getElementById('mistakes-left').innerText = maxMistakes;
    document.getElementById('score').innerText = currentRunScore;
    document.getElementById('lives-left').innerText = totalLives;
    
    const gameAreaDOM = document.getElementById('game-area');
    gameAreaDOM.classList.remove('terror-radius-1', 'terror-radius-2');
    document.getElementById('hatch-btn').classList.add('hidden');
    document.getElementById('restart-btn').classList.add('hidden');
    document.getElementById('killer-image').classList.add('hidden');
    heartbeatAudio.pause();

    document.getElementById('hint').innerText = `Pista: "${targetCharacter.hint}"`;

    if (perks.djv) {
        let clean = targetCharacter.name.split(' ').join('');
        let f = normalizeStr(clean[0]); let l = normalizeStr(clean[clean.length - 1]);
        if(!guessedLetters.includes(f)) guessedLetters.push(f);
        if(!guessedLetters.includes(l)) guessedLetters.push(l);
        perks.djv = false; document.getElementById('btn-djv').classList.remove('active');
    }

    renderHangmanWord(); renderHangmanKeyboard();
}

function renderHangmanWord() {
    const disp = targetCharacter.name.split('').map(l => {
        if (l === " ") return " ";
        return guessedLetters.includes(normalizeStr(l)) ? l : "_";
    }).join('');
    document.getElementById('word-display').innerText = disp; 
    if (!disp.includes("_")) evalHangmanWinLose(true);
}

function handleHangmanLetter(letter) {
    if (guessedLetters.includes(letter)) return;
    guessedLetters.push(letter); document.getElementById(`key-${letter}`).disabled = true;
    
    if (normalizeStr(targetCharacter.name).includes(letter)) renderHangmanWord();
    else {
        mistakes++; if(!isMuted) { hitSound.currentTime = 0; hitSound.play().catch(e=>{}); }
        if (mistakes >= maxMistakes && perks.dh) {
            mistakes--; perks.dh = false; document.getElementById('btn-dh').classList.remove('active');
            alert("¡FAJADOR activado! Has evadido el golpe fatal de la Entidad.");
            let missing = targetCharacter.name.split('').filter(char => char !== ' ' && !guessedLetters.includes(normalizeStr(char)));
            if(missing.length > 0) guessedLetters.push(normalizeStr(missing[0]));
            renderHangmanWord(); renderHangmanKeyboard(); 
        }
        document.getElementById('mistakes-left').innerText = maxMistakes - mistakes; updateTerrorAudio();
        if (mistakes >= maxMistakes) evalHangmanWinLose(false);
    }
}

function renderHangmanKeyboard() {
    const kb = document.getElementById('keyboard'); kb.innerHTML = "";
    "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').forEach(l => {
        const b = document.createElement('button'); b.id = `key-${l}`; b.innerText = l;
        if(guessedLetters.includes(l)) b.disabled = true;
        b.onclick = () => handleHangmanLetter(l); kb.appendChild(b);
    });
}

function updateTerrorAudio() {
    const ga = document.getElementById('game-area'); ga.classList.remove('terror-radius-1', 'terror-radius-2');
    if (mistakes <= 2) heartbeatAudio.pause();
    else if (mistakes === 3 || mistakes === 4) {
        ga.classList.add('terror-radius-1');
        if(!isMuted) { heartbeatAudio.playbackRate = 1.0; heartbeatAudio.volume = 0.5; heartbeatAudio.play().catch(e=>{}); }
    } else if (mistakes === 5) {
        ga.classList.add('terror-radius-2');
        if(!isMuted) { heartbeatAudio.playbackRate = 1.5; heartbeatAudio.volume = 1.0; }
        if (totalLives === 1) document.getElementById('hatch-btn').classList.remove('hidden');
    }
}

document.getElementById('hatch-btn').onclick = () => {
    document.getElementById('hatch-btn').classList.add('hidden'); heartbeatAudio.pause();
    document.getElementById('game-area').classList.remove('terror-radius-1', 'terror-radius-2');
    if (Math.random() <= 0.3) {
        if(!isMuted) hatchSound.play().catch(e=>{});
        document.getElementById('word-display').innerHTML = `<h2 style='color:#4fc3f7;'>¡ESCAPASTE POR LA TRAMPILLA!</h2>`;
        checkRitualCompleted('hatch');
        showHangmanReveal();
    } else { alert("La Entidad cerró la trampilla."); mistakes = 6; evalHangmanWinLose(false); }
};

function evalHangmanWinLose(isWin) {
    document.getElementById('game-area').classList.remove('terror-radius-1', 'terror-radius-2');
    document.getElementById('hatch-btn').classList.add('hidden'); document.getElementById('keyboard').innerHTML = "";
    heartbeatAudio.pause(); showHangmanReveal();

    const wDisp = document.getElementById('word-display');
    if (isWin) {
        let p = 1000 + ((maxMistakes - mistakes) * 500);
        if (perks.bbq && mistakes < 3) { p = Math.floor(p * 1.5); perks.bbq = false; document.getElementById('btn-bbq').classList.remove('active'); }
        currentRunScore += p; totalBloodpoints += p; document.getElementById('score').innerText = currentRunScore;
        wDisp.innerHTML = `<h2 style='color:#4caf50;'>¡Sujeto resuelto! (+${p} PB)</h2>`;
        if(mistakes === 0) checkRitualCompleted('perfect'); if(mistakes === 5) checkRitualCompleted('clutch');
    } else {
        totalLives--; document.getElementById('lives-left').innerText = totalLives;
        wDisp.innerHTML = `<h2 style='color:#d32f2f;'>Era: ${targetCharacter.name}</h2>`;
        if (totalLives <= 0) {
            setTimeout(() => {
                document.getElementById('final-score').innerText = currentRunScore;
                document.getElementById('final-game-over-modal').classList.remove('hidden');
                bgMusic.pause();
            }, 1200);
            return;
        }
    }
}

function showHangmanReveal() {
    const kImg = document.getElementById('killer-image');
    kImg.src = targetCharacter.image; kImg.classList.remove('hidden');
    document.getElementById('restart-btn').classList.remove('hidden');
}

// =========================================================================
//                         2. MODO DEDUCCIÓN: DBDLE
// =========================================================================
let currentDbdlePool = [];

function launchDbdle(subMode) {
    activeAppMode = "dbdle"; activeSubMode = subMode;
    currentRunScore = 0; totalLives = 3; mistakes = 0;
    
    currentDbdlePool = (subMode === 'killer') ? killersList : survivorsList;
    targetCharacter = currentDbdlePool[Math.floor(Math.random() * currentDbdlePool.length)];
    
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    document.getElementById('game-stats-header').classList.remove('hidden');
    
    document.getElementById('archive-ui').classList.remove('hidden');
    document.getElementById('classic-hangman-ui').classList.add('hidden');
    document.getElementById('catalog-view').classList.add('hidden');
    document.getElementById('roulette-view').classList.add('hidden');

    document.getElementById('game-area-title').innerText = (subMode === 'killer') ? "DBDLE: ADIVINAR ASESINO" : "DBDLE: ADIVINAR SUPERVIVIENTE";
    document.getElementById('score').innerText = currentRunScore;
    document.getElementById('lives-left').innerText = totalLives;
    document.getElementById('mistakes-left').innerText = maxMistakes;

    document.getElementById('guesses-grid').innerHTML = '';
    const inputDOM = document.getElementById('dbdle-search');
    inputDOM.value = ''; inputDOM.disabled = false; inputDOM.placeholder = "Escribe el nombre aquí...";
    document.getElementById('autocomplete-list').classList.add('hidden');

    if(!isMuted) bgMusic.play().catch(e=>{});
}

const dbdleSearchInput = document.getElementById('dbdle-search');
const autocompleteDOM = document.getElementById('autocomplete-list');

dbdleSearchInput.addEventListener('input', function() {
    const val = this.value.trim().toLowerCase();
    autocompleteDOM.innerHTML = '';
    if (!val) { autocompleteDOM.classList.add('hidden'); return; }

    const pool = (activeSubMode === 'killer') ? killersList : survivorsList;
    const filtered = pool.filter(c => c.name.toLowerCase().includes(val));
    if (filtered.length === 0) { autocompleteDOM.classList.add('hidden'); return; }

    filtered.forEach(item => {
        const d = document.createElement('div'); d.className = "autocomplete-item";
        d.innerHTML = `<img src="${item.image}"> <span style="font-weight:bold;">${item.name}</span>`;
        d.onclick = () => { dbdleSearchInput.value = ''; autocompleteDOM.classList.add('hidden'); evaluateDbdleGuess(item); };
        autocompleteDOM.appendChild(d);
    });
    autocompleteDOM.classList.remove('hidden');
});

document.addEventListener('click', e => { if(e.target !== dbdleSearchInput) autocompleteDOM.classList.add('hidden'); });

function evaluateDbdleGuess(guessed) {
    const grid = document.getElementById('guesses-grid');
    const row = document.createElement('div'); row.className = 'guess-row';

    const cName = `<div class="guess-cell name-cell"><img src="${guessed.image}"><span>${guessed.name}</span></div>`;
    const isRol = (guessed.rol === targetCharacter.rol) ? 'match' : 'wrong';
    const cRol = `<div class="guess-cell ${isRol}">${guessed.rol}</div>`;
    const isGen = (guessed.gender === targetCharacter.gender) ? 'match' : 'wrong';
    const cGen = `<div class="guess-cell ${isGen}">${guessed.gender || 'N/A'}</div>`;
    const isSpeed = (guessed.speed === targetCharacter.speed) ? 'match' : 'wrong';
    const cSpeed = `<div class="guess-cell ${isSpeed}">${guessed.speed || 'N/A'}</div>`;
    const gY = parseInt(guessed.year) || 0; const tY = parseInt(targetCharacter.year) || 0;
    let yHtml = ""; let isY = "wrong";
    if(gY === tY) { isY = "match"; yHtml = guessed.year; } 
    else if(gY < tY) { yHtml = `${guessed.year} <div class="arrow-symbol">↑</div>`; } 
    else { yHtml = `${guessed.year} <div class="arrow-symbol">↓</div>`; }
    const cYear = `<div class="guess-cell ${isY}">${yHtml}</div>`;

    row.innerHTML = cName + cRol + cGen + cSpeed + cYear;
    grid.insertBefore(row, grid.firstChild);
    if(!isMuted) { hitSound.currentTime = 0; hitSound.play().catch(e=>{}); }

    if (guessed.name === targetCharacter.name) {
        dbdleSearchInput.disabled = true; dbdleSearchInput.placeholder = "¡Adivinado!";
        let pts = 2000 + ((maxMistakes - mistakes) * 500);
        currentRunScore += pts; totalBloodpoints += pts; document.getElementById('score').innerText = currentRunScore;
        
        setTimeout(() => {
            document.getElementById('victory-img').src = targetCharacter.image;
            document.getElementById('victory-name').innerText = targetCharacter.name;
            document.getElementById('victory-bp-text').innerText = `+${pts} Puntos de Sangre`;
            document.getElementById('victory-modal').classList.remove('hidden');
        }, 600);
    } else {
        mistakes++; document.getElementById('mistakes-left').innerText = maxMistakes - mistakes;
        if(mistakes >= maxMistakes) {
            dbdleSearchInput.disabled = true; dbdleSearchInput.placeholder = `Fallaste. Era: ${targetCharacter.name}`;
            totalLives--; document.getElementById('lives-left').innerText = totalLives;
            if(totalLives <= 0) {
                setTimeout(() => {
                    document.getElementById('final-score').innerText = currentRunScore;
                    document.getElementById('final-game-over-modal').classList.remove('hidden');
                }, 1000);
            }
        }
    }
}

window.restartDbdleSameMode = function() {
    document.getElementById('victory-modal').classList.add('hidden');
    launchDbdle(activeSubMode);
}

// =========================================================================
//                         3. VISTA DE CATÁLOGO
// =========================================================================
function launchCatalog(initialRole) {
    activeAppMode = "catalog"; activeSubMode = initialRole;
    
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    document.getElementById('game-stats-header').classList.add('hidden'); 
    document.getElementById('classic-hangman-ui').classList.add('hidden');
    document.getElementById('archive-ui').classList.add('hidden');
    document.getElementById('roulette-view').classList.add('hidden');
    document.getElementById('catalog-view').classList.remove('hidden');

    if(!isMuted) bgMusic.play().catch(e=>{});

    renderCatalogGrid(initialRole);
}

window.renderCatalogGrid = function(role, filterQuery = "") {
    activeSubMode = role;
    const grid = document.getElementById('catalog-grid'); grid.innerHTML = "";
    const list = (role === 'killer') ? killersList : survivorsList;
    
    const filtered = list.filter(c => c.name.toLowerCase().includes(filterQuery.toLowerCase()));
    
    filtered.forEach(char => {
        grid.innerHTML += `
            <div class="card">
                <img src="${char.image}" alt="${char.name}">
                <h3>${char.name}</h3>
                <p style="color:#ffca28; font-weight:bold; margin-bottom:4px;">${char.rol}</p>
                <p>Velocidad: ${char.speed}</p>
                <p>Año: ${char.year}</p>
                <p style="font-size:0.75rem; color:#888; margin-top:6px;">"${char.gender}"</p>
            </div>
        `;
    });
}

window.filterCatalogLive = function() {
    const q = document.getElementById('catalog-search-input').value;
    renderCatalogGrid(activeSubMode, q);
}

// =========================================================================
//                         4. RULETA DE ASESINOS
// =========================================================================
let activeRoulettePool = null;

function launchRoulette() {
    activeAppMode = "roulette";
    
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('game-area').classList.remove('hidden');
    
    document.getElementById('game-stats-header').classList.add('hidden');
    document.getElementById('classic-hangman-ui').classList.add('hidden');
    document.getElementById('archive-ui').classList.add('hidden');
    document.getElementById('catalog-view').classList.add('hidden');
    
    document.getElementById('roulette-view').classList.remove('hidden');

    if(!isMuted) bgMusic.play().catch(e=>{});

    if (activeRoulettePool === null) {
        activeRoulettePool = killersList.map(k => k.name);
    }
    renderRouletteGrid();
}

function renderRouletteGrid() {
    const grid = document.getElementById('roulette-grid');
    grid.innerHTML = "";
    
    killersList.forEach(k => {
        const isActive = activeRoulettePool.includes(k.name);
        const disabledClass = isActive ? "" : "disabled";
        
        grid.innerHTML += `
            <div class="roulette-card ${disabledClass}" onclick="toggleRouletteKiller('${k.name}')">
                <img src="${k.image}" alt="${k.name}">
                <h4>${k.name}</h4>
            </div>
        `;
    });
    document.getElementById('roulette-counter').innerText = `${activeRoulettePool.length} / ${killersList.length} Activos`;
}

window.toggleRouletteKiller = function(name) {
    if (activeRoulettePool.includes(name)) {
        activeRoulettePool = activeRoulettePool.filter(n => n !== name); 
    } else {
        activeRoulettePool.push(name); 
    }
    renderRouletteGrid();
}

window.setAllRoulette = function(state) {
    if (state) { activeRoulettePool = killersList.map(k => k.name); } 
    else { activeRoulettePool = []; }
    renderRouletteGrid();
}

window.spinRoulette = function() {
    if (activeRoulettePool.length === 0) {
        alert("¡No hay asesinos habilitados en la ruleta! Habilita al menos uno haciendo clic en su retrato.");
        return;
    }
    
    if (!isMuted) { hitSound.currentTime = 0; hitSound.play().catch(e=>{}); }
    
    const randomIndex = Math.floor(Math.random() * activeRoulettePool.length);
    const chosenName = activeRoulettePool[randomIndex];
    const chosenKiller = killersList.find(k => k.name === chosenName);
    
    activeRoulettePool = activeRoulettePool.filter(n => n !== chosenName);
    renderRouletteGrid(); 
    
    document.getElementById('roulette-modal-img').src = chosenKiller.image;
    document.getElementById('roulette-modal-name').innerText = chosenKiller.name;
    document.getElementById('roulette-modal').classList.remove('hidden');
}

function checkRitualCompleted(type) {
    if (activeRitual.id === type) {
        alert(`¡RITUAL COMPLETADO! \n${activeRitual.desc}`); 
        totalBloodpoints += activeRitual.reward;
        activeRitual = rituals[Math.floor(Math.random() * rituals.length)]; 
        updateMenuHub();
    }
}

// Arrancar
init();