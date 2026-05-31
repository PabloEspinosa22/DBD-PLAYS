let currentKiller = "";
let currentImage = "";
let guessedLetters = [];
let mistakes = 0;
const maxMistakes = 6;
let score = 0; // Nueva variable de puntaje

const wordDisplay = document.getElementById('word-display');
const hintDisplay = document.getElementById('hint');
const keyboard = document.getElementById('keyboard');
const mistakesLeft = document.getElementById('mistakes-left');
const restartBtn = document.getElementById('restart-btn');
const killerImage = document.getElementById('killer-image');
const scoreDisplay = document.getElementById('score'); // Elemento del puntaje

async function fetchKiller() {
    try {
        const response = await fetch('/api/random-killer');
        const data = await response.json();
        currentKiller = data.name;
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
    scoreDisplay.innerText = score; // Actualizamos UI de puntaje al iniciar
    
    restartBtn.classList.add('hidden');
    killerImage.classList.add('hidden'); 
    
    renderWord();
    renderKeyboard();
}

function renderWord() {
    const displayWord = currentKiller
        .split('')
        .map(letter => {
            if (letter === " ") return " ";
            return guessedLetters.includes(letter) ? letter : "_";
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

    // Si la letra está en el nombre (Aceptamos la letra normal o con acentos opcionalmente, pero la BD está en mayúsculas sin acentos)
    if (currentKiller.includes(letter)) {
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
        // Lógica de puntaje: 1000 pts por adivinar + 500 extras por cada error no cometido
        const pointsEarned = 1000 + ((maxMistakes - mistakes) * 500);
        score += pointsEarned;
        scoreDisplay.innerText = score;
        
        keyboard.innerHTML = `
            <h2 style='color: #4caf50; text-shadow: 0 0 10px #4caf50;'>
                ¡Escapaste! (+${pointsEarned} PB)
            </h2>`;
    } else {
        // Penalización: Pierdes tus puntos
        score = 0; 
        scoreDisplay.innerText = score;
        
        keyboard.innerHTML = `
            <h2 style='color: #d32f2f; text-shadow: 0 0 10px #d32f2f;'>
                ¡Sacrificado! Era: ${currentKiller}
            </h2>`;
    }
    
    killerImage.src = currentImage;
    killerImage.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
}

restartBtn.addEventListener('click', fetchKiller);
fetchKiller();