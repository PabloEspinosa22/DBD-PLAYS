let currentMode = ""; 
let currentCharacter = "";
let currentImage = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let score = 0;
let totalLives = 3;
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
const livesLeftDisplay = document.getElementById('lives-left');

// Referencias del Modal Final
const finalModal = document.getElementById('final-game-over-modal');
const finalScore = document.getElementById('final-score');
const finalTitle = document.getElementById('final-title');
const finalMessage = document.getElementById('final-message');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const modalBox = document.getElementById('modal-box');

// 1. Iniciar el modo
async function startGameMode(mode) {
    currentMode = mode;
    score = 0; 
    totalLives = 3; 
    scoreDisplay.innerText = score;
    livesLeftDisplay.innerText = totalLives;
    
    // Configuración visual según el bando elegido o el modo mixto
    if(mode === 'killer') {
        gameTitle.innerText = "ADIVINA EL ASESINO";
        gameTitle.style.color = "#d32f2f";
        gameArea.style.boxShadow = "0 0 20px rgba(200, 0, 0, 0.3)";
    } else if(mode === 'survivor') {
        gameTitle.innerText = "ADIVINA EL SUPERVIVIENTE";
        gameTitle.style.color = "#1976d2";
        gameArea.style.boxShadow = "0 0 20px rgba(0, 100, 200, 0.3)";
    } else {
        // Estilo para el modo mixto ('all')
        gameTitle.innerText = "PRUEBA DE LA NIEBLA";
        gameTitle.style.color = "#a855f7";
        gameArea.style.boxShadow = "0 0 20px rgba(168, 85, 247, 0.3)";
    }

    mainMenu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    await fetchAllCharacters();
    nextRound();
}

async function fetchAllCharacters() {
    try {
        // Selección del endpoint correcto basado en el modo
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

function initGame() {
    guessedLetters = [];
    mistakes = 0;
    mistakesLeft.innerText = maxMistakes;
    scoreDisplay.innerText = score;
    livesLeftDisplay.innerText = totalLives;
    
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

function gameOver(isWin) {
    killerImage.src = currentImage;
    killerImage.classList.remove('hidden');

    if (isWin) {
        const pointsEarned = 1000 + ((maxMistakes - mistakes) * 500);
        score += pointsEarned;
        scoreDisplay.innerText = score;
        
        keyboard.innerHTML = `
            <h2 style='color: #4caf50; text-shadow: 0 0 10px #4caf50;'>
                ¡Prueba superada! (+${pointsEarned} PB)
            </h2>`;
            
        restartBtn.classList.remove('hidden');
        menuBtn.classList.remove('hidden');
    } else {
        totalLives--; 
        livesLeftDisplay.innerText = totalLives;
        
        // Mensaje de derrota dinámico según el modo
        let loseText = "¡Consumido por la niebla!";
        if (currentMode === 'killer') loseText = "¡Sacrificado!";
        if (currentMode === 'survivor') loseText = "¡Perdido en la niebla!";
        
        keyboard.innerHTML = `
            <h2 style='color: #d32f2f; text-shadow: 0 0 10px #d32f2f;'>
                ${loseText} Era: ${currentCharacter}
            </h2>`;
            
        if (totalLives <= 0) {
            setTimeout(showFinalGameOver, 1500);
        } else {
            restartBtn.classList.remove('hidden');
            menuBtn.classList.remove('hidden');
        }
    }
}

function showFinalGameOver() {
    finalScore.innerText = score;
    
    if (currentMode === 'killer') {
        finalTitle.innerText = "¡LA ENTIDAD ESTÁ DECEPCIONADA!";
        finalTitle.style.color = "#d32f2f";
        finalMessage.innerText = "Tus fracasos han demostrado que no eres digno de esparcir el terror.";
        modalBox.style.borderColor = "#b71c1c";
        modalBox.style.boxShadow = "0 0 30px #b71c1c";
    } else if (currentMode === 'survivor') {
        finalTitle.innerText = "¡LA NIEBLA TE HA CONSUMIDO!";
        finalTitle.style.color = "#1976d2";
        finalMessage.innerText = "No pudiste escapar. Tu alma le pertenece al Ente para siempre.";
        modalBox.style.borderColor = "#0d47a1";
        modalBox.style.boxShadow = "0 0 30px #0d47a1";
    } else {
        // Pantalla final para el modo mixto
        finalTitle.innerText = "¡SABOTAJE ABSOLUTO EN LA NIEBLA!";
        finalTitle.style.color = "#a855f7";
        finalMessage.innerText = "Colapsaste ante las pruebas cruzadas del Ente. Nadie escapa de este lugar.";
        modalBox.style.borderColor = "#4a148c";
        modalBox.style.boxShadow = "0 0 30px #4a148c";
    }
    
    finalModal.classList.remove('hidden');
}

// Eventos de botones
restartBtn.addEventListener('click', nextRound);

menuBtn.addEventListener('click', () => {
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    availableCharacters = []; 
});

backToMenuBtn.addEventListener('click', () => {
    finalModal.classList.add('hidden');
    gameArea.classList.add('hidden');
    mainMenu.classList.remove('hidden');
    availableCharacters = []; 
});