// --- VARIABLES GLOBALES ---
let currentMode = ""; 
let currentCharacterData = null; // Guardamos el objeto completo ahora
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let currentRunScore = 0; 
let totalLives = 3;
let availableCharacters = []; 
let fullRoster = []; // Necesario para llenar el dropdown con todos los nombres

let totalBloodpoints = parseInt(localStorage.getItem('totalBP')) || 0;
let perks = { djv: false, bbq: false, dh: false };

const rituals = [
    { id: 'perfect', desc: "Adivina un personaje con 0 errores (+5000 PB)", reward: 5000 },
    { id: 'clutch', desc: "Gana una ronda teniendo 5 errores acumulados (+4000 PB)", reward: 4000 },
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
    else { muteBtn.innerText = "🔊 Sonido: ON"; muteBtn.classList.remove('muted'); if(currentMode !== "") bgMusic.play().catch(e=>{}); }
}

// Referencias del DOM
const mainMenu = document.getElementById('main-menu');
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const livesLeftDisplay = document.getElementById('lives-left');
const gameTitle = document.getElementById('game-title');
const mistakesLeft = document.getElementById('mistakes-left');
const killerImage = document.getElementById('killer-image');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const hatchBtn = document.getElementById('hatch-btn');

// Modo Clásico UI
const wordDisplay = document.getElementById('word-display');
const hintDisplay = document.getElementById('hint');
const keyboard = document.getElementById('keyboard');

// Modo Archivos UI
const archiveUi = document.getElementById('archive-ui');
const statSpeed = document.getElementById('stat-speed');
const statYear = document.getElementById('stat-year');
const statGender = document.getElementById('stat-gender');
const charSelect = document.getElementById('character-select');
const submitGuessBtn = document.getElementById('submit-guess-btn');

function updateMenu() {
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
    if (perks[perkId]) { perkMsg.innerText = "Ya la tienes."; return; }
    if (totalBloodpoints >= cost) {
        totalBloodpoints -= cost; perks[perkId] = true;
        document.getElementById(`btn-${perkId}`).classList.add('active');
        perkMsg.innerText = "¡Equipada!"; updateMenu();
    } else { perkMsg.innerText = "Puntos insuficientes."; }
}

updateMenu();

async function startGameMode(mode) {
    currentMode = mode; currentRunScore = 0; totalLives = 3; 
    scoreDisplay.innerText = currentRunScore; livesLeftDisplay.innerText = totalLives;
    
    if(mode === 'archive') {
        gameTitle.innerText = "ARCHIVOS DEL ENTE";
        gameTitle.style.color = "#f57f17";
    } else {
        gameTitle.innerText = "ADIVINA EL PERSONAJE";
        gameTitle.style.color = "#d32f2f";
    }

    if(!isMuted) bgMusic.play().catch(e=>{});
    mainMenu.classList.add('hidden'); gameArea.classList.remove('hidden');
    
    await fetchAllCharacters();
    nextRound();
}

async function fetchAllCharacters() {
    try {
        let endpoint = '/api/all';
        if (currentMode === 'killer') endpoint = '/api/killers';
        if (currentMode === 'survivor') endpoint = '/api/survivors';
        // El modo archive usa '/api/all' por defecto para ser más difícil
        const response = await fetch(endpoint);
        availableCharacters = await response.json();
        
        // Guardamos una copia para rellenar el dropdown
        if(fullRoster.length === 0) {
            const allRes = await fetch('/api/all');
            fullRoster = await allRes.json();
            // Ordenar alfabéticamente para el dropdown
            fullRoster.sort((a, b) => a.name.localeCompare(b.name));
        }
    } catch (error) { hintDisplay.innerText = "Error de conexión."; }
}

function nextRound() {
    if (availableCharacters.length === 0) {
        hintDisplay.innerText = "¡Has descubierto todos los secretos! Reiniciando...";
        fetchAllCharacters().then(() => selectRandomCharacter());
    } else { selectRandomCharacter(); }
}

function selectRandomCharacter() {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    currentCharacterData = availableCharacters.splice(randomIndex, 1)[0];
    initGame();
}

function normalizeStr(str) { return str.replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I').replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U'); }

function initGame() {
    guessedLetters = []; mistakes = 0; mistakesLeft.innerText = maxMistakes;
    scoreDisplay.innerText = currentRunScore; livesLeftDisplay.innerText = totalLives;
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    hatchBtn.classList.add('hidden'); restartBtn.classList.add('hidden'); menuBtn.classList.add('hidden'); killerImage.classList.add('hidden'); 
    heartbeatAudio.pause(); heartbeatAudio.currentTime = 0;
    
    if(currentMode === 'archive') {
        // PREPARAR MODO ARCHIVOS
        wordDisplay.classList.add('hidden'); keyboard.classList.add('hidden'); hintDisplay.classList.add('hidden');
        archiveUi.classList.remove('hidden');
        
        // Si olvidaste poner datos en la BD, mostramos "Desconocido"
        statSpeed.innerText = currentCharacterData.speed || "Desconocido";
        statYear.innerText = currentCharacterData.year || "Desconocido";
        statGender.innerText = currentCharacterData.gender || "Desconocido";
        
        // Llenar dropdown
        charSelect.innerHTML = '<option value="">Selecciona al personaje...</option>';
        fullRoster.forEach(char => {
            let opt = document.createElement('option');
            opt.value = char.name; opt.innerText = char.name;
            charSelect.appendChild(opt);
        });
        
    } else {
        // PREPARAR MODO CLÁSICO AHORCADO
        archiveUi.classList.add('hidden');
        wordDisplay.classList.remove('hidden'); keyboard.classList.remove('hidden'); hintDisplay.classList.remove('hidden');
        hintDisplay.innerText = `Pista: "${currentCharacterData.hint}"`;
        
        if (perks.djv) {
            let cleanName = currentCharacterData.name.split(' ').join('');
            let first = normalizeStr(cleanName[0]); let last = normalizeStr(cleanName[cleanName.length - 1]);
            if(!guessedLetters.includes(first)) guessedLetters.push(first);
            if(!guessedLetters.includes(last)) guessedLetters.push(last);
            perks.djv = false; document.getElementById('btn-djv').classList.remove('active');
        }
        renderWord(); renderKeyboard();
    }
}

// LOGICA MODO ARCHIVOS
submitGuessBtn.onclick = () => {
    const guess = charSelect.value;
    if(!guess) return alert("Selecciona un personaje primero.");
    
    if (guess === currentCharacterData.name) {
        gameOver(true); // Adivinó correctamente
    } else {
        processMistake(); // Se equivocó
    }
};

// LOGICA MODO CLÁSICO
function renderWord() {
    const displayWord = currentCharacterData.name.split('').map(letter => {
        if (letter === " ") return " ";
        return guessedLetters.includes(normalizeStr(letter)) ? letter : "_";
    }).join('');
    wordDisplay.innerText = displayWord;
    if (!displayWord.includes("_")) gameOver(true);
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return;
    guessedLetters.push(letter); document.getElementById(`key-${letter}`).disabled = true;

    if (normalizeStr(currentCharacterData.name).includes(letter)) {
        renderWord();
    } else {
        processMistake();
    }
}

function processMistake() {
    mistakes++;
    if(!isMuted) { hitSound.currentTime = 0; hitSound.play().catch(e=>{}); }
    
    // Validación Fajador
    if (mistakes >= maxMistakes && perks.dh && currentMode !== 'archive') {
        mistakes--; perks.dh = false; document.getElementById('btn-dh').classList.remove('active');
        alert("¡FAJADOR activado!");
        let missing = currentCharacterData.name.split('').filter(l => l !== ' ' && !guessedLetters.includes(normalizeStr(l)));
        if(missing.length > 0) guessedLetters.push(normalizeStr(missing[0]));
        renderWord(); renderKeyboard(); 
    }
    
    mistakesLeft.innerText = maxMistakes - mistakes;
    updateTerrorRadius();
    if (mistakes >= maxMistakes) gameOver(false);
}

function updateTerrorRadius() {
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    if (mistakes <= 2) { heartbeatAudio.pause(); } 
    else if (mistakes === 3 || mistakes === 4) {
        gameArea.classList.add('terror-radius-1');
        if(!isMuted) { heartbeatAudio.playbackRate = 1.0; heartbeatAudio.volume = 0.5; heartbeatAudio.play().catch(e=>{}); }
    } 
    else if (mistakes === 5) {
        gameArea.classList.add('terror-radius-2');
        if(!isMuted) { heartbeatAudio.playbackRate = 1.5; heartbeatAudio.volume = 1.0; }
        if (totalLives === 1) hatchBtn.classList.remove('hidden');
    }
}

hatchBtn.onclick = () => {
    hatchBtn.classList.add('hidden'); gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    heartbeatAudio.pause();
    if (Math.random() <= 0.3) {
        if(!isMuted) hatchSound.play().catch(e=>{});
        archiveUi.classList.add('hidden'); wordDisplay.classList.remove('hidden');
        wordDisplay.innerHTML = `<h2 style='color: #4fc3f7;'>¡ESCAPASTE!</h2>`;
        checkRitual('hatch'); scoreDisplay.innerText = currentRunScore;
        killerImage.src = currentCharacterData.image; killerImage.classList.remove('hidden');
        restartBtn.classList.remove('hidden'); menuBtn.classList.remove('hidden'); keyboard.innerHTML="";
    } else { alert("Trampilla cerrada."); mistakes = 6; gameOver(false); }
};

function checkRitual(type) {
    if (activeRitual.id === type) {
        alert(`¡RITUAL COMPLETADO! \n${activeRitual.desc}`); totalBloodpoints += activeRitual.reward;
        activeRitual = rituals[Math.floor(Math.random() * rituals.length)]; updateMenu();
    }
}

function renderKeyboard() {
    keyboard.innerHTML = ""; const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
    letters.forEach(letter => {
        const btn = document.createElement('button'); btn.id = `key-${letter}`; btn.innerText = letter;
        if(guessedLetters.includes(letter)) btn.disabled = true;
        btn.addEventListener('click', () => handleGuess(letter)); keyboard.appendChild(btn);
    });
}

function gameOver(isWin) {
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    hatchBtn.classList.add('hidden'); archiveUi.classList.add('hidden'); wordDisplay.classList.remove('hidden');
    keyboard.innerHTML = ""; heartbeatAudio.pause();
    killerImage.src = currentCharacterData.image; killerImage.classList.remove('hidden');

    if (isWin) {
        let pointsEarned = 1000 + ((maxMistakes - mistakes) * 500);
        if(currentMode === 'archive') pointsEarned *= 2; // Doble puntos por ser más difícil
        if (perks.bbq && mistakes < 3) { pointsEarned = Math.floor(pointsEarned * 1.5); perks.bbq = false; document.getElementById('btn-bbq').classList.remove('active'); }
        
        currentRunScore += pointsEarned; totalBloodpoints += pointsEarned; updateMenu();
        scoreDisplay.innerText = currentRunScore;
        wordDisplay.innerHTML = `<h2 style='color: #4caf50;'>¡Correcto! (+${pointsEarned} PB)</h2>`;
        if (mistakes === 0) checkRitual('perfect'); if (mistakes === 5) checkRitual('clutch');
    } else {
        totalLives--; livesLeftDisplay.innerText = totalLives;
        wordDisplay.innerHTML = `<h2 style='color: #d32f2f;'>Era: ${currentCharacterData.name}</h2>`;
        if (totalLives <= 0) { setTimeout(showFinalGameOver, 1500); return; }
    }
    restartBtn.classList.remove('hidden'); menuBtn.classList.remove('hidden');
}

function showFinalGameOver() {
    document.getElementById('final-score').innerText = currentRunScore;
    document.getElementById('final-title').style.color = "#d32f2f";
    document.getElementById('final-game-over-modal').classList.remove('hidden');
    bgMusic.pause();
}

restartBtn.addEventListener('click', nextRound);
menuBtn.addEventListener('click', () => { gameArea.classList.add('hidden'); mainMenu.classList.remove('hidden'); availableCharacters = []; bgMusic.pause(); });
document.getElementById('back-to-menu-btn').addEventListener('click', () => { document.getElementById('final-game-over-modal').classList.add('hidden'); gameArea.classList.add('hidden'); mainMenu.classList.remove('hidden'); availableCharacters = []; });