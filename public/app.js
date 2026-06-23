let fullRoster = [];

// Carga inicial
async function init() {
    const kRes = await fetch('/api/killers');
    const sRes = await fetch('/api/survivors');
    const killers = (await kRes.json()).map(k => ({...k, rol: 'Asesino'}));
    const survivors = (await sRes.json()).map(s => ({...s, rol: 'Superviviente'}));
    fullRoster = [...killers, ...survivors];
    render('killer');
}

// Renderiza catálogo
function render(role) {
    document.getElementById('archive-ui').classList.add('hidden');
    document.getElementById('content-display').classList.remove('hidden');
    const container = document.getElementById('content-display');
    const filtered = (currentMode === 'killer') ? killersList.filter(c => c.name.toLowerCase().includes(val)) :
                 (currentMode === 'survivor') ? survivorsList.filter(c => c.name.toLowerCase().includes(val)) :
                 [...killersList, ...survivorsList].filter(c => c.name.toLowerCase().includes(val));
    
    container.innerHTML = filtered.map(char => `
        <div class="card">
            <img src="${char.image}" alt="${char.name}" style="width:100px; border-radius:50%">
            <h3>${char.name}</h3>
            <p>${char.speed}</p>
        </div>
    `).join('');
}

// Inicia modo juego
function startGameMode(mode) {
    if(mode === 'archive') {
        document.getElementById('content-display').classList.add('hidden');
        document.getElementById('archive-ui').classList.remove('hidden');
    }
}

// Lógica de evaluación de tabla (DbDle)
function evaluateDbdleGuess(guessedChar, target) {
    const row = document.createElement('div');
    row.className = 'guess-row';
    
    // Comparaciones lógica
    const isName = guessedChar.name === target.name ? 'match' : 'wrong';
    const isRol = guessedChar.rol === target.rol ? 'match' : 'wrong';
    const isGen = guessedChar.gender === target.gender ? 'match' : 'wrong';
    
    row.innerHTML = `
        <div class="guess-cell name-cell ${isName}">${guessedChar.name}</div>
        <div class="guess-cell ${isRol}">${guessedChar.rol}</div>
        <div class="guess-cell ${isGen}">${guessedChar.gender}</div>
        <div class="guess-cell">${guessedChar.speed}</div>
        <div class="guess-cell">${guessedChar.year}</div>
    `;
    document.getElementById('guesses-grid').prepend(row);
}

init();