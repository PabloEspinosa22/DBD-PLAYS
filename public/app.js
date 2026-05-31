let currentMode = ""; // Puede ser 'killer' o 'survivor'
let currentCharacter = "";
let currentImage = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let score = 0;

// Referencias a los contenedores principales
const mainMenu = document.getElementById('main-menu');
const gameArea = document.getElementById('game-area');

// Referencias del juego
const wordDisplay = document.getElementById('word-display');
const hintDisplay = document.getElementById('hint');
const keyboard = document.getElementById('keyboard');
const mistakesLeft = document.getElementById('mistakes-left');
const restartBtn = document.getElementById('restart-btn');
const menuBtn = document.getElementById('menu-btn');
const killerImage = document.getElementById('killer-image');
const scoreDisplay = document.getElementById('score');
const gameTitle = document.getElementById('game-title');

// Iniciar el modo seleccionado desde el menú
function startGameMode(mode) {
    currentMode = mode;
    score = 0; // Reiniciar puntaje al cambiar de modo
    scoreDisplay.innerText = score;
    
    // Cambiar título y colores según el bando
    if(mode === 'killer') {
        gameTitle.innerText = "ADIVINA EL ASESINO";
        gameTitle.style.color = "#d32f2f";
        gameArea.style.boxShadow = "0 0 20px rgba(200, 0, 0, 0.3)";
    } else {
        gameTitle.innerText = "ADIVINA EL SUPERVIVIENTE";
        gameTitle.style.color = "#1976d2";
        gameArea.style.boxShadow = "0 0 20px rgba(0, 100, 200, 0.3)";
    }

    // Ocultar menú y mostrar juego
    mainMenu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    fetchCharacter();
}

async function fetchCharacter() {
    try {
        // Decide a qué ruta de la API consultar
        const endpoint = currentMode === 'killer' ? '/api/random-killer' : '/api/random-survivor';
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        currentCharacter = data.name;
        currentImage = data.image;
        hintDisplay.innerText = `Pista: "${data.hint}"`;
        
        initGame();
    } catch (error) {
        hintDisplay.innerText = "Error al conectar con la Entidad.";
    }
}

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
            
            // Convertimos la letra a su versión sin acento solo para comparar
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

    // Normalizamos todo el nombre del personaje quitando acentos para revisar si acertó
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
                ¡Sobreviviste! (+${pointsEarned} PB)
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

// Escuchadores de los botones finales
restartBtn.addEventListener('click', fetchCharacter);
menuBtn.addEventListener('click', () => {
    // Regresar al menú principal
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});