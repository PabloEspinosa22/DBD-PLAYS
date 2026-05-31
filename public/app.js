// --- VARIABLES GLOBALES ---
let currentMode = ""; 
let currentCharacter = "";
let currentImage = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let currentRunScore = 0; 
let totalLives = 3;
let availableCharacters = []; 

// Persistencia de datos
let totalBloodpoints = parseInt(localStorage.getItem('totalBP')) || 0;
let perks = { djv: false, bbq: false, dh: false };

// Misiones (Rituales)
const rituals = [
    { id: 'perfect', desc: "Adivina un personaje con 0 errores (+5000 PB)", reward: 5000 },
    { id: 'clutch', desc: "Gana una ronda teniendo 5 errores acumulados (+4000 PB)", reward: 4000 },
    { id: 'hatch', desc: "Escapa por la trampilla (+10000 PB)", reward: 10000 }
];
let activeRitual = JSON.parse(localStorage.getItem('ritual')) || rituals[Math.floor(Math.random() * rituals.length)];

// Referencias del DOM
const mainMenu = document.getElementById('main-menu');
const gameArea = document.getElementById('game-area');
const wordDisplay = document.getElementById('word-display');
const hintDisplay = document.getElementById('hint');
const keyboard = document.getElementById('keyboard');
const mistakesLeft = document.getElementById('mistakes-left');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const killerImage = document.getElementById('killer-image');
const scoreDisplay = document.getElementById('score');
const gameTitle = document.getElementById('game-title');
const livesLeftDisplay = document.getElementById('lives-left');
const hatchBtn = document.getElementById('hatch-btn');

// Referencias Menú Principal
const rankDisplay = document.getElementById('rank-display');
const totalBpDisplay = document.getElementById('total-bp');
const ritualDesc = document.getElementById('ritual-desc');
const perkMsg = document.getElementById('perk-msg');

// Modal Final
const finalModal = document.getElementById('final-game-over-modal');
const finalScore = document.getElementById('final-score');

// --- INICIO Y ACTUALIZACIÓN DEL MENÚ ---
function updateMenu() {
    totalBpDisplay.innerText = totalBloodpoints;
    localStorage.setItem('totalBP', totalBloodpoints);
    
    // Calcular Rango
    let rankText = "Ceniza IV"; let rankColor = "#8d6e63";
    if(totalBloodpoints > 100000) { rankText = "Iridiscente I"; rankColor = "#ff0033"; }
    else if(totalBloodpoints > 50000) { rankText = "Oro I"; rankColor = "#ffca28"; }
    else if(totalBloodpoints > 20000) { rankText = "Plata I"; rankColor = "#e0e0e0"; }
    else if(totalBloodpoints > 5000) { rankText = "Bronce I"; rankColor = "#cd7f32"; }
    
    rankDisplay.innerText = `Rango: ${rankText}`;
    rankDisplay.style.color = rankColor;
    
    // Actualizar Ritual
    ritualDesc.innerText = activeRitual.desc;
    localStorage.setItem('ritual', JSON.stringify(activeRitual));
}

// --- SISTEMA DE VENTAJAS (PERKS) ---
window.buyPerk = function(perkId, cost) {
    if (perks[perkId]) {
        perkMsg.innerText = "Ya tienes esta ventaja equipada.";
        return;
    }
    if (totalBloodpoints >= cost) {
        totalBloodpoints -= cost;
        perks[perkId] = true;
        document.getElementById(`btn-${perkId}`).classList.add('active');
        perkMsg.innerText = "¡Ventaja equipada para la siguiente prueba!";
        updateMenu();
    } else {
        perkMsg.innerText = "No tienes suficientes Puntos de Sangre.";
    }
}

// Inicializar menú al cargar
updateMenu();

// --- LÓGICA DEL JUEGO ---
async function startGameMode(mode) {
    currentMode = mode;
    currentRunScore = 0; 
    totalLives = 3; 
    scoreDisplay.innerText = currentRunScore;
    livesLeftDisplay.innerText = totalLives;
    
    mainMenu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    await fetchAllCharacters();
    nextRound();
}

async function fetchAllCharacters() {
    try {
        let endpoint = '/api/all';
        if (currentMode === 'killer') endpoint = '/api/killers';
        if (currentMode === 'survivor') endpoint = '/api/survivors';
        const response = await fetch(endpoint);
        availableCharacters = await response.json();
    } catch (error) {
        hintDisplay.innerText = "Error al conectar con la Entidad.";
    }
}

function nextRound() {
    if (availableCharacters.length === 0) {
        hintDisplay.innerText = "¡Has adivinado a todos! Reiniciando la niebla...";
        fetchAllCharacters().then(() => selectRandomCharacter());
    } else {
        selectRandomCharacter();
    }
}

function selectRandomCharacter() {
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    const characterData = availableCharacters.splice(randomIndex, 1)[0];
    
    currentCharacter = characterData.name;
    currentImage = characterData.image;
    hintDisplay.innerText = `Pista: "${characterData.hint}"`;
    
    initGame();
}

function normalizeStr(str) {
    return str.replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E').replace(/[ÍÌÏÎ]/g, 'I').replace(/[ÓÒÖÔ]/g, 'O').replace(/[ÚÙÜÛ]/g, 'U');
}

function initGame() {
    guessedLetters = [];
    mistakes = 0;
    mistakesLeft.innerText = maxMistakes;
    scoreDisplay.innerText = currentRunScore;
    livesLeftDisplay.innerText = totalLives;
    
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    hatchBtn.classList.add('hidden');
    restartBtn.classList.add('hidden');
    menuBtn.classList.add('hidden');
    killerImage.classList.add('hidden'); 
    
    // Activar Déjà Vu
    if (perks.djv) {
        let cleanName = currentCharacter.split(' ').join('');
        let first = normalizeStr(cleanName[0]);
        let last = normalizeStr(cleanName[cleanName.length - 1]);
        if(!guessedLetters.includes(first)) guessedLetters.push(first);
        if(!guessedLetters.includes(last)) guessedLetters.push(last);
        perks.djv = false; // Se consume
        document.getElementById('btn-djv').classList.remove('active');
    }
    
    renderWord();
    renderKeyboard();
}

function renderWord() {
    const displayWord = currentCharacter.split('').map(letter => {
        if (letter === " ") return " ";
        return guessedLetters.includes(normalizeStr(letter)) ? letter : "_";
    }).join('');
    
    wordDisplay.innerText = displayWord;

    if (!displayWord.includes("_")) gameOver(true);
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    document.getElementById(`key-${letter}`).disabled = true;

    if (normalizeStr(currentCharacter).includes(letter)) {
        renderWord();
    } else {
        mistakes++;
        
        // Ventaja: Fajador (Dead Hard)
        if (mistakes >= maxMistakes && perks.dh) {
            mistakes--; 
            perks.dh = false;
            document.getElementById('btn-dh').classList.remove('active');
            alert("¡FAJADOR! Has evadido el golpe fatal de la Entidad.");
            // Le regalamos una letra al azar correcta
            let missing = currentCharacter.split('').filter(l => l !== ' ' && !guessedLetters.includes(normalizeStr(l)));
            if(missing.length > 0) guessedLetters.push(normalizeStr(missing[0]));
            renderWord();
            renderKeyboard(); // Refrescar teclado
        }
        
        mistakesLeft.innerText = maxMistakes - mistakes;
        updateTerrorRadius();
        
        if (mistakes >= maxMistakes) {
            gameOver(false);
        }
    }
}

function updateTerrorRadius() {
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    if (mistakes === 3 || mistakes === 4) gameArea.classList.add('terror-radius-1');
    if (mistakes === 5) {
        gameArea.classList.add('terror-radius-2');
        // Mecánica de Trampilla
        if (totalLives === 1) hatchBtn.classList.remove('hidden');
    }
}

// Trampilla Click
hatchBtn.onclick = () => {
    hatchBtn.classList.add('hidden');
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    if (Math.random() <= 0.3) {
        // Éxito
        keyboard.innerHTML = `<h2 style='color: #4fc3f7;'>¡ESCAPASTE POR LA TRAMPILLA!</h2>`;
        checkRitual('hatch');
        scoreDisplay.innerText = currentRunScore;
        killerImage.src = currentImage;
        killerImage.classList.remove('hidden');
        restartBtn.classList.remove('hidden');
        menuBtn.classList.remove('hidden');
    } else {
        // Fracaso
        alert("La Entidad cerró la trampilla en tu cara.");
        mistakes = 6;
        gameOver(false);
    }
};

function checkRitual(type) {
    if (activeRitual.id === type) {
        alert(`¡RITUAL COMPLETADO! \n${activeRitual.desc}`);
        totalBloodpoints += activeRitual.reward;
        // Asignar nuevo ritual
        activeRitual = rituals[Math.floor(Math.random() * rituals.length)];
        updateMenu();
    }
}

function renderKeyboard() {
    keyboard.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.id = `key-${letter}`;
        btn.innerText = letter;
        if(guessedLetters.includes(letter)) btn.disabled = true;
        btn.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(btn);
    });
}

function gameOver(isWin) {
    gameArea.classList.remove('terror-radius-1', 'terror-radius-2');
    hatchBtn.classList.add('hidden');
    killerImage.src = currentImage;
    killerImage.classList.remove('hidden');

    if (isWin) {
        let pointsEarned = 1000 + ((maxMistakes - mistakes) * 500);
        
        // Ventaja Barbacoa y Chile
        if (perks.bbq && mistakes < 3) {
            pointsEarned = Math.floor(pointsEarned * 1.5);
            perks.bbq = false;
            document.getElementById('btn-bbq').classList.remove('active');
        }
        
        currentRunScore += pointsEarned;
        totalBloodpoints += pointsEarned; 
        updateMenu();
        
        scoreDisplay.innerText = currentRunScore;
        keyboard.innerHTML = `<h2 style='color: #4caf50;'>¡Prueba superada! (+${pointsEarned} PB)</h2>`;
        
        if (mistakes === 0) checkRitual('perfect');
        if (mistakes === 5) checkRitual('clutch');
            
        restartBtn.classList.remove('hidden');
        menuBtn.classList.remove('hidden');
    } else {
        totalLives--; 
        livesLeftDisplay.innerText = totalLives;
        
        keyboard.innerHTML = `<h2 style='color: #d32f2f;'>¡Sacrificado! Era: ${currentCharacter}</h2>`;
            
        if (totalLives <= 0) {
            setTimeout(showFinalGameOver, 1500);
        } else {
            restartBtn.classList.remove('hidden');
            menuBtn.classList.remove('hidden');
        }
    }
}

function showFinalGameOver() {
    finalScore.innerText = currentRunScore;
    document.getElementById('final-title').style.color = "#d32f2f";
    finalModal.classList.remove('hidden');
}

restartBtn.addEventListener('click', nextRound);

menuBtn.addEventListener('click', () => {
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    availableCharacters = []; 
});

document.getElementById('back-to-menu-btn').addEventListener('click', () => {
    finalModal.classList.add('hidden');
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    availableCharacters = []; 
});