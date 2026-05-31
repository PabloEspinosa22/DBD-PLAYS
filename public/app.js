let currentMode = ""; 
let currentCharacter = "";
let currentImage = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let score = 0;

// Nuevo: Arreglo para llevar el control de los que no han salido
let availableCharacters = []; 

// Referencias a los contenedores
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

// 1. Iniciar el modo
async function startGameMode(mode) {
    currentMode = mode;
    score = 0; 
    scoreDisplay.innerText = score;
    
    if(mode === 'killer') {
        gameTitle.innerText = "ADIVINA EL ASESINO";
        gameTitle.style.color = "#d32f2f";
        gameArea.style.boxShadow = "0 0 20px rgba(200, 0, 0, 0.3)";
    } else {
        gameTitle.innerText = "ADIVINA EL SUPERVIVIENTE";
        gameTitle.style.color = "#1976d2";
        gameArea.style.boxShadow = "0 0 20px rgba(0, 100, 200, 0.3)";
    }

    mainMenu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    // Descargamos la base de datos completa del bando elegido
    await fetchAllCharacters();
    nextRound();
}

// 2. Descargar toda la lista
async function fetchAllCharacters() {
    try {
        const endpoint = currentMode === 'killer' ? '/api/killers' : '/api/survivors';
        const response = await fetch(endpoint);
        // Guardamos todos los personajes en nuestra variable de control
        availableCharacters = await response.json();
    } catch (error) {
        hintDisplay.innerText = "Error al conectar con la Entidad.";
    }
}

// 3. Preparar la siguiente ronda
function nextRound() {
    // Si la lista se vació (ya jugaste a todos), recargamos la lista desde cero
    if (availableCharacters.length === 0) {
        hintDisplay.innerText = "¡Has adivinado a todos! Reiniciando la niebla...";
        fetchAllCharacters().then(() => selectRandomCharacter());
    } else {
        selectRandomCharacter();
    }
}

// 4. Seleccionar un personaje y ELIMINARLO de la lista
function selectRandomCharacter() {
    // Elegimos un índice al azar de los que quedan
    const randomIndex = Math.floor(Math.random() * availableCharacters.length);
    
    // splice() extrae el elemento del arreglo, asegurando que ya no esté disponible
    const characterData = availableCharacters.splice(randomIndex, 1)[0];
    
    currentCharacter = characterData.name;
    currentImage = characterData.image;
    hintDisplay.innerText = `Pista: "${characterData.hint}"`;
    
    initGame();
}

// Lógica base del juego
function initGame() {
    guessedLetters = [];
    mistakes = 0;
    mistakesLeft.innerText = maxMistakes;
    scoreDisplay.innerText = score;
    
    restartBtn.classList.add('hidden');
    menuBtn.classList.add('hidden');
    killerImage.classList.add('hidden'); 
    
    renderWord();
    renderKeyboard();
}

function renderWord() {
    const displayWord = currentCharacter
        .split('')
        .map(letter => {
            if (letter === " ") return " ";
            const normalizedLetter = letter.replace(/[ÁÀÄÂ]/g, 'A')
                                           .replace(/[ÉÈËÊ]/g, 'E')
                                           .replace(/[ÍÌÏÎ]/g, 'I')
                                           .replace(/[ÓÒÖÔ]/g, 'O')
                                           .replace(/[ÚÙÜÛ]/g, 'U');
            return guessedLetters.includes(normalizedLetter) ? letter : "_";
        })
        .join('');
    
    wordDisplay.innerText = displayWord;

    if (!displayWord.includes("_")) {
        gameOver(true);
    }
}

function handleGuess(letter) {
    if (guessedLetters.includes(letter)) return;
    
    guessedLetters.push(letter);
    document.getElementById(`key-${letter}`).disabled = true;

    const normalizedCharacter = currentCharacter.replace(/[ÁÀÄÂ]/g, 'A')
                                                .replace(/[ÉÈËÊ]/g, 'E')
                                                .replace(/[ÍÌÏÎ]/g, 'I')
                                                .replace(/[ÓÒÖÔ]/g, 'O')
                                                .replace(/[ÚÙÜÛ]/g, 'U');

    if (normalizedCharacter.includes(letter)) {
        renderWord();
    } else {
        mistakes++;
        mistakesLeft.innerText = maxMistakes - mistakes;
        if (mistakes >= maxMistakes) {
            gameOver(false);
        }
    }
}

function renderKeyboard() {
    keyboard.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('');
    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.id = `key-${letter}`;
        btn.innerText = letter;
        btn.addEventListener('click', () => handleGuess(letter));
        keyboard.appendChild(btn);
    });
}

function gameOver(isWin) {
    if (isWin) {
        const pointsEarned = 1000 + ((maxMistakes - mistakes) * 500);
        score += pointsEarned;
        scoreDisplay.innerText = score;
        
        keyboard.innerHTML = `
            <h2 style='color: #4caf50; text-shadow: 0 0 10px #4caf50;'>
                ¡Prueba superada! (+${pointsEarned} PB)
            </h2>`;
    } else {
        score = 0; 
        scoreDisplay.innerText = score;
        const loseText = currentMode === 'killer' ? "¡Sacrificado!" : "¡Perdido en la niebla!";
        
        keyboard.innerHTML = `
            <h2 style='color: #d32f2f; text-shadow: 0 0 10px #d32f2f;'>
                ${loseText} Era: ${currentCharacter}
            </h2>`;
    }
    
    killerImage.src = currentImage;
    killerImage.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    menuBtn.classList.remove('hidden');
}

// Eventos de botones modificados para usar nextRound()
restartBtn.addEventListener('click', nextRound);

menuBtn.addEventListener('click', () => {
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    availableCharacters = []; // Limpiamos la lista al salir al menú principal
});