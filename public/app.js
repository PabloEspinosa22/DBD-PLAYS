// Bases de datos separadas
let killersList = [];
let survivorsList = [];

// Estado actual del juego
let currentPlayMode = ''; // 'killer' o 'survivor'
let targetCharacter = null;

async function init() {
    try {
        const kRes = await fetch('/api/killers');
        const sRes = await fetch('/api/survivors');
        
        killersList = await kRes.json();
        survivorsList = await sRes.json();
        
        // Iniciar mostrando el catálogo de asesinos
        showCatalog('killer');
    } catch (e) {
        console.error("Error al cargar la base de datos de la Entidad.");
    }
}

// --- LÓGICA DE LA VISTA CATÁLOGO ---
function showCatalog(role) {
    document.getElementById('dbdle-view').classList.add('hidden');
    document.getElementById('catalog-view').classList.remove('hidden');
    document.getElementById('catalog-search').value = ''; // Limpiar buscador
    
    // Asignar dataset al contenedor para saber qué estamos buscando
    const grid = document.getElementById('catalog-grid');
    grid.dataset.currentRole = role; 
    
    renderCatalogGrid();
}

function renderCatalogGrid(filterText = '') {
    const grid = document.getElementById('catalog-grid');
    const role = grid.dataset.currentRole;
    const dataList = (role === 'killer') ? killersList : survivorsList;
    
    grid.innerHTML = '';
    
    const filteredData = dataList.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));
    
    filteredData.forEach(char => {
        grid.innerHTML += `
            <div class="card">
                <img src="${char.image}" alt="${char.name}">
                <h3>${char.name}</h3>
                <p>${char.speed}</p>
                <p>Año: ${char.year}</p>
            </div>
        `;
    });
}

function filterCatalog() {
    const text = document.getElementById('catalog-search').value;
    renderCatalogGrid(text);
}

// --- LÓGICA DEL MODO DE JUEGO DBDLE ---
function startDbdle(role) {
    document.getElementById('catalog-view').classList.add('hidden');
    document.getElementById('dbdle-view').classList.remove('hidden');
    
    currentPlayMode = role;
    const title = document.getElementById('dbdle-title');
    title.innerText = (role === 'killer') ? "¿ADIVINAS EL ASESINO DE HOY?" : "¿ADIVINAS EL SUPERVIVIENTE DE HOY?";
    
    // Limpiar UI de partidas anteriores
    document.getElementById('guesses-grid').innerHTML = '';
    document.getElementById('dbdle-search').value = '';
    document.getElementById('dbdle-search').disabled = false;
    document.getElementById('autocomplete-list').classList.add('hidden');
    
    // Seleccionar personaje objetivo aleatorio estrictamente de su lista
    const dataList = (role === 'killer') ? killersList : survivorsList;
    const randomIndex = Math.floor(Math.random() * dataList.length);
    targetCharacter = dataList[randomIndex];
}

// Buscador táctico del modo juego (NUNCA MEZCLA)
const searchInput = document.getElementById('dbdle-search');
const autocompleteList = document.getElementById('autocomplete-list');

searchInput.addEventListener('input', function() {
    const val = this.value.trim().toLowerCase();
    autocompleteList.innerHTML = '';
    
    if (!val) { autocompleteList.classList.add('hidden'); return; }

    // Filtrar SOLO en la lista del modo actual
    const dataList = (currentPlayMode === 'killer') ? killersList : survivorsList;
    const filtered = dataList.filter(c => c.name.toLowerCase().includes(val));
    
    if (filtered.length === 0) { autocompleteList.classList.add('hidden'); return; }

    filtered.forEach(item => {
        const div = document.createElement('div');
        div.className = "autocomplete-item";
        div.innerHTML = `<img src="${item.image}" alt=""> <span style="color: white; font-weight: bold;">${item.name}</span>`;
        
        div.addEventListener('click', () => {
            searchInput.value = '';
            autocompleteList.classList.add('hidden');
            processGuess(item);
        });
        autocompleteList.appendChild(div);
    });
    autocompleteList.classList.remove('hidden');
});

// Cerrar autocompletado si haces clic fuera
document.addEventListener('click', e => { 
    if (e.target !== searchInput) autocompleteList.classList.add('hidden'); 
});

// Procesar el intento en la tabla
function processGuess(guessedChar) {
    const grid = document.getElementById('guesses-grid');
    const row = document.createElement('div');
    row.className = 'guess-row';

    // Celda Nombre
    const nameCell = document.createElement('div'); 
    nameCell.className = 'guess-cell name-cell';
    nameCell.innerHTML = `<img src="${guessedChar.image}" alt=""> <span>${guessedChar.name}</span>`;

    // Celda Género
    const genderCell = document.createElement('div'); 
    genderCell.className = 'guess-cell';
    genderCell.innerText = guessedChar.gender || "N/A";
    if (guessedChar.gender === targetCharacter.gender) genderCell.classList.add('match'); else genderCell.classList.add('wrong');

    // Celda Velocidad
    const speedCell = document.createElement('div'); 
    speedCell.className = 'guess-cell';
    speedCell.innerText = guessedChar.speed || "N/A";
    if (guessedChar.speed === targetCharacter.speed) speedCell.classList.add('match'); else speedCell.classList.add('wrong');

    // Celda Año (Con flechas estilo DbDle)
    const yearCell = document.createElement('div'); 
    yearCell.className = 'guess-cell';
    
    const gYear = parseInt(guessedChar.year) || 0; 
    const tYear = parseInt(targetCharacter.year) || 0;
    
    if (gYear === tYear) {
        yearCell.innerText = guessedChar.year; 
        yearCell.classList.add('match');
    } else if (gYear < tYear) {
        yearCell.innerHTML = `${guessedChar.year} <div class="arrow-symbol">↑</div>`; 
        yearCell.classList.add('wrong');
    } else {
        yearCell.innerHTML = `${guessedChar.year} <div class="arrow-symbol">↓</div>`; 
        yearCell.classList.add('wrong');
    }

    row.appendChild(nameCell); 
    row.appendChild(genderCell); 
    row.appendChild(speedCell); 
    row.appendChild(yearCell);
    
    // Insertar arriba
    grid.insertBefore(row, grid.firstChild); 

    // Comprobar victoria
    if (guessedChar.name === targetCharacter.name) {
        document.getElementById('dbdle-search').disabled = true;
        document.getElementById('dbdle-search').placeholder = "¡Adivinado!";
        
        // Mostrar Modal de Victoria
        setTimeout(() => {
            document.getElementById('victory-img').src = targetCharacter.image;
            document.getElementById('victory-name').innerText = targetCharacter.name;
            document.getElementById('victory-modal').classList.remove('hidden');
        }, 500);
    }
}

// Iniciar app
init();