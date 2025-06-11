// Configuración de la API de TMDB
const API_KEY = '98fd1e135ecfac794b25c1fe1d162ac8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const PERSON_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2'; // Usando el formato específico del ejemplo

// Mapeo de directores a sus IDs en TMDB
const directors = {
    'Steven Spielberg': 488, 'Martin Scorsese': 1032,'Louis Feuillade':102844,
    'Christopher Nolan': 525, 'Quentin Tarantino': 138, 'Alfred Hitchcock': 2636, 'Stanley Kubrick': 240,
    'Pedro Almodóvar': 309, 'Alejandro Amenábar': 19840, 'Luis García Berlanga': 37493, 'Álex de la Iglesia': 57865,
    'Rodrigo Sorogoyen': 96690, 'Akira Kurosawa': 5026, 'Ingmar Bergman': 6648, 'Federico Fellini': 4415,
    'François Truffaut': 1650, 'Woody Allen': 1243, 'Tim Burton': 510, 'Wes Anderson': 5655, 'David Lynch': 5602,
    'Guillermo del Toro': 10828, 'Víctor Erice': 37833, 'Takashi Miike': 17282, 'Gakuryu Ishii': 144014,
    'David Cronenberg': 224, 'Denis Villeneuve': 137427, 'Michael Haneke': 6011, 'Richard Linklater': 564,
    'Terry Gilliam': 280, 'John Cassavetes': 11147, 'Chantal Akerman': 130030, 'Kathryn Bigelow': 14392,
    'John Carpenter': 11770, 'Michael Mann': 638, 'Andrey Zvyagintsev': 68519, 'Paul Verhoeven': 10491,
    'Francis Ford Coppola': 1776, 'Alejandro González Iñárritu': 223, 'Gaspar Noé': 14597, 'Abel Ferrara': 39104,
    'Clint Eastwood': 190, 'Paolo Sorrentino': 56194, 'Walter Salles': 8574, 'Ernst Lubitsch': 2428,
    'Chris Marker': 9956, 'F. W. Murnau': 9076, 'Carl Theodor Dreyer': 11572, 'Sidney Lumet': 39996,
    'Robert Eggers': 138781, 'Christian Petzold': 2332, 'Charlie Chaplin': 13848, 'Theo Angelopoulos': 10316,
    'Semih Kaplanoğlu': 130402, 'Cristi Puiu': 107533, 'Miguel Gomes': 150512, 'Bong Joon-ho': 21684,
    'Orson Wells': 40, 'Carlos Saura': 96369, 'Alain Resnais': 11983, 'Hiroshi Shimizu': 233660,
    'Alice Rohrwacher': 931211, 'Brian De Palma': 1150, 'Roy Andersson': 45791, 'Patricio Guzmán': 566294,
    'Raúl Ruiz': 121585, 'Radu Jude': 588822, 'Piotr Szulkin': 83263, 'Jacques Demy': 24882,
    'Thomas Vinterberg': 4453, 'Éric Rohmer': 28615, 'Tsui Hark': 26760, 'Yasujirō Ozu': 95501,
    'Billy Wilder': 3146, 'Sergei Eisenstein': 9603, 'Pablo Larraín': 225009, 'Ben Affleck': 880,
    'Guy Ritchie': 956, 'Rob Reiner': 3026, 'Andrei Tarkovsky': 8452, 'Peter Greenaway': 30309,
    'David Lean': 12238, 'Paweł Pawlikowski': 64194, 'Leos Carax': 27977, 'Maya Deren': 96813,"Damien Chazelle": 136495,
    'Jean-Luc Godard': 3776, 'Masaki Kobayashi': 76978, 'Jonas Mekas': 1092208,
    'Quentin Dupieux': 133398, 'Greta Gerwig': 45400, 'Agnès Varda': 6817, 'Luis Buñuel': 793,"Frank Capra": 2662,
    'Miloš Forman': 3974, 'Nobuhiko Obayashi': 132305, 'Fruit Chan': 56865, 'Carlos Reygadas': 20660,
    'John Woo': 11401, 'Ridley Scott': 578, 'Hayao Miyazaki': 608, 'Trần Anh Hùng': 107730,"David Fincher": 7467,
    'Franco Piavoli': 1184377, 'King Hu': 83698, 'Hiroshi Teshigahara': 96801, 'Aki Kaurismäki': 16767,
    'Kiyoshi Kurosawa': 26882, 'Takeshi Kitano': 3317, 'John Huston': 6593, 'William Wyler': 10001,
    'Aleksandr Sokurov': 107762, 'Edward Yang': 143035, 'Anders Thomas Jensen': 1012, 'Kamila Andini': 1515263,
    'Satyajit Ray': 12160 , 'Zack Snyder': 15217, 'Joachim Trier': 71609, 'Jonathan Glazer': 66728,
    'Paul Thomas Anderson': 4762, 'Terrence Malick': 30715, 'Fernando Fernán Gómez': 965, 'Luchino Visconti': 15127,
    'Manoel de Oliveira': 81749, 'Bi Gan': 1520165, 'Jia Zhangke': 24011, 'Nuri Bilge Ceylan': 56214,
    'Georges Méliès': 11523, 'Rainer Werner Fassbinder': 2725, 'Dario Argento': 4955, 'Jean-Pierre Melville': 3831,
    'Jacques Rivette': 73153, 'João César Monteiro': 257772, 'Constantin Costa-Gavras': 27436, 'Glauber Rocha': 544845,
    'Zhang Yimou': 607, 'Wim Wenders': 2303, 'Karel Zeman': 53859, 'Wojciech Jerzy Has': 27002,
    'Robert Bresson': 10346, 'Fritz Lang': 68, 'Park Chan-wook': 10099, 'Pedro Costa': 256841,
    'Krzysztof Kieślowski': 1126, 'Wong Kar-wai': 12453, 'Lars von Trier': 42, 'Mario Bava': 25826,
    'Michelangelo Antonioni': 15189, 'Darren Aronofsky': 6431, 'Yorgos Lanthimos': 122423, 'M. Night Shyamalan': 11614,
    'Apichatpong Weerasethakul': 69759, 'James Cameron': 2710, 'Nicolas Winding Refn': 21183, 'Joel Coen': 1223,    
    'Abbas Kiarostami': 119294, 'Werner Herzog': 6818, 'Buster Keaton': 8635, 'Hou Hsiao-hsien': 64992,
    'Tsai Ming-liang': 71174, 'Béla Tarr': 85637, 'Kenji Mizoguchi': 97202, 'Alfonso Cuarón': 11218,
    'Neill Blomkamp': 82194, 'Gus Van Sant': 5216, 'Ryūsuke Hamaguchi': 1487492, 'Sofia Coppola': 1769,
    'Alex Garland': 2036, 'Claire Denis': 9888, 'Luca Guadagnino': 78160, 'Sean Baker': 118415,
    'Hirokazu Koreeda': 25645, 'Shunji Iwai': 55785, 'Jim Jarmusch': 4429, 'Andrzej Żuławski': 32082,
    'Šarūnas Bartas': 109598, 'Hong Sang-soo': 150975, 'John Ford': 8500,'Lav Diaz': 1051381,'Sergio Leone':4385,
    'Pier Paolo Pasolini':5970,'Hlynur Pálmason':1292227

};

let currentMode = 'directors'; // 'directors' or 'geography'
let currentDifficulty = 'total'; // 'easy', 'medium', 'hard', 'total'

// Esta variable se actualizará en startNewGame según el modo
let categoriasFilas = Object.keys(directors);

// Funciones para guardar y cargar la configuración del juego
function saveGameSettings() {
    localStorage.setItem('cineGridMode', currentMode);
    localStorage.setItem('cineGridDifficulty', currentDifficulty);
}

function loadGameSettings() {
    const savedMode = localStorage.getItem('cineGridMode');
    const savedDifficulty = localStorage.getItem('cineGridDifficulty');

    if (savedMode) {
        currentMode = savedMode;
    }
    if (savedDifficulty) {
        currentDifficulty = savedDifficulty;
    }

    // Actualizar la interfaz de usuario
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        difficultySelect.value = currentDifficulty;
    }
    updateModeVisuals();
}

// Función para actualizar la visualización del modo activo
function updateModeVisuals() {
    const geographyModeLink = document.getElementById('geography-mode-link');
    const directorsModeLink = document.getElementById('directors-mode-link'); // Assuming this will be added

    if (geographyModeLink) {
        if (currentMode === 'geography') {
            geographyModeLink.classList.add('active-mode');
        } else {
            geographyModeLink.classList.remove('active-mode');
        }
    }
    // If a directors mode link exists, handle its active state
    if (directorsModeLink) {
        if (currentMode === 'directors') {
            directorsModeLink.classList.add('active-mode');
        } else {
            directorsModeLink.classList.remove('active-mode');
        }
    }
}

// Mapeo de descripciones para categorías de columnas
const categoryDescriptions = {
    "Título empieza con A-H (ignorar 'The')": "Nombra una película cuyo título (ignorando el artículo 'The') empiece con A, B, C, D, E, F, G o H. Si el título empieza con un número, se considera la primera letra alfabética. Ejemplos: 'The Avengers', '13 Assassins' (se considera 'A' de 'Assassins').",
    "Título empieza con I-P (ignorar 'The','A','An')": "Nombra una película cuyo título (ignorando artículos como 'The', 'A', 'An') empiece con I, J, K, L, M, N, O o P. Si el título empieza con un número, se considera la primera letra alfabética. Ejemplos: 'The Imitation Game', 'A Man Called Otto', '21 Jump Street' (se considera 'J' de 'Jump').",
    "Título empieza con Q-Z (ignorar 'A','An')": "Nombra una película cuyo título (ignorando artículos como 'A', 'An') empiece con Q, R, S, T, U, V, W, X, Y o Z. Si el título empieza con un número, se considera la primera letra alfabética. Ejemplos: 'A Touch of Sin'.",
    "Título contiene J,K,W,Z,X,Q": "Nombra una película cuyo título contenga al menos una de estas letras: J, K, W, Z, X, Q. Ejemplos: 'The Dark Knight', 'An American Werewolf in London'.",
    "Título con 2 palabras": "Nombra una película cuyo título tenga exactamente dos palabras. Ejemplos: 'Holy Motors', 'Robin Hood'.",
    "Título con doble letra ('rr', 'll'...)": "Nombra una película cuyo título contenga una letra doble consecutiva (ej. 'rr', 'll', 'ee'). Ejemplos: 'Resurrection', 'The Odyssey'.",
    "Título con 3 o más palabras": "Nombra una película cuyo título tenga tres o más palabras. Ejemplo: 'The Matrix Reloaded'.",
    "Título de una palabra (ignorar artículos)": "Nombra una película cuyo título (ignoring articles like 'The', 'A', 'An') sea de una sola palabra. Ejemplo: 'The Idiots'.",
    "Empieza por vocal (ignorar 'The')": "Nombra una película cuyo título (ignoring articles like 'The') empiece por una vocal (A, E, I, O, U). Ejemplos: 'The Expendables'.",
    "Título de menos de 2h de duración": "Nombra una película que tenga una duración inferior a 2 horas (120 minutos). Ejemplo: 'The Merry Frolics of Satan'.",
    "Título de 2h o más de duración": "Nombra una película que tenga una duración de 2 horas (120 minutos) o más. Ejemplo: 'Mountains May Depart'.",
};

// Mapeo de descripciones para regiones/países (geografía)
const geographyDescriptions = {};

// Función para obtener el nombre del país a partir del código ISO
function getCountryName(isoCode) {
    for (const countryName in paises) {
        if (paises[countryName].includes(isoCode)) {
            return countryName;
        }
    }
    return isoCode; // Fallback if not found
}

// Rellenar geographyDescriptions con los países de cada región
for (const regionName in regiones) {
    const countryCodes = regiones[regionName];
    const countryNames = countryCodes.map(getCountryName);
    geographyDescriptions[regionName] = `Esta región incluye películas de los siguientes países: ${countryNames.join(', ')}.`;
}

// Rellenar geographyDescriptions con los países individuales
for (const countryName in paises) {
    geographyDescriptions[countryName] = `Este criterio incluye películas del país: ${countryName}.`;
}
// Cache para detalles de películas
const movieDetailsCache = {};

// Función utilitaria que devuelve todos los géneros únicos
function obtenerGenerosDisponibles(infoDirectores) {
    const set = new Set();
    for (const datos of Object.values(infoDirectores)) {
        datos.generos.forEach(g => set.add(g));
    }
    return Array.from(set);
}

// Devuelve directores que tienen ese género en su lista
function obtenerDirectoresPorGenero(infoDirectores, genero) {
    return Object.entries(infoDirectores)
        .filter(([_, datos]) => datos.generos.includes(genero))
        .map(([nombre]) => nombre);
}

function seleccionarGeneroYDirectores(infoDirectores) {
    const generos = obtenerGenerosDisponibles(infoDirectores);
    const generoAleatorio = generos[Math.floor(Math.random() * generos.length)];

    let directores = obtenerDirectoresPorGenero(infoDirectores, generoAleatorio);

    // Asegura al menos 3 directores que lo trabajen
    if (directores.length < 3) return seleccionarGeneroYDirectores(infoDirectores);

    // Aleatoriza y reduce a 3
    directores = directores.sort(() => Math.random() - 0.5).slice(0, 3);

    return { genero: generoAleatorio, directores };
}

function esDirectorCompatible(director, categorias) {
    const info = infoDirectores[director];
    if (!info || !info.generos) return false;

    for (let categoria of categorias) {
        const isGenero = Object.values(infoDirectores).some(d => d.generos.includes(categoria));
        if (isGenero && !info.generos.includes(categoria)) {
            return false;
        }
    }
    return true;
}

function seleccionarCategoriasConGeneroControlado() {
    const maxIntentos = 5;
    for (let intento = 0; intento < maxIntentos; intento++) {
        // Selecciona aleatoriamente 0 o 1 géneros
        const incluirGenero = Math.random() < 0.5; // 50% de probabilidad de incluir género
        const generosSeleccionados = incluirGenero
            ? getRandomElements(generosUnicos, 1)
            : [];

        const numColumnasNormales = 3 - generosSeleccionados.length;
        const categoriasSeleccionadas = [
            ...getRandomElements(categoriasColumnas, numColumnasNormales),
            ...generosSeleccionados
        ];

        const directoresFiltrados = directoresNivelTotal.filter(d => esDirectorCompatible(d, categoriasSeleccionadas));

        // Si hay suficientes directores compatibles, lo damos por válido
        if (directoresFiltrados.length >= 10) {
            return categoriasSeleccionadas;
        }
    }

    // Si después de varios intentos no hay suficientes directores compatibles, no usamos género
    return getRandomElements(categoriasColumnas, 3);
}

// Estado del juego
const gameState = {
    selectedCell: null,
    filledCells: {},
    selectedDirectors: [], // Directores seleccionados para el juego
    selectedCategories: [], // Categorías seleccionadas para el juego
    remainingAttempts: 1, // Contador de intentos
    gameInProgress: false // Indica si hay una partida en curso
};

// Función para seleccionar elementos aleatorios de un array
function getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Estadísticas del juego
const gameStats = {
    gamesPlayed: 0,
    gamesCompleted: 0
};

// Cargar estadísticas guardadas
function loadStats() {
    const savedStats = localStorage.getItem('cineGridStats');
    if (savedStats) {
        const parsedStats = JSON.parse(savedStats);
        gameStats.gamesPlayed = parsedStats.gamesPlayed || 0;
        gameStats.gamesCompleted = parsedStats.gamesCompleted || 0;
    }
}

// Guardar estadísticas
function saveStats() {
    localStorage.setItem('cineGridStats', JSON.stringify(gameStats));
}

// Inicializar el juego
document.addEventListener('DOMContentLoaded', () => {
    // Cargar estadísticas guardadas
    loadStats();

    // Cargar configuración de juego guardada
    loadGameSettings();
    
    // Iniciar nueva partida
    startNewGame();
    
    setupSearchFunctionality();
    setupHeaderFunctionality();
});

// Iniciar nueva partida
function startNewGame() {
    // Limpiar estado anterior
    gameState.selectedCell = null;
    gameState.filledCells = {};
    gameState.remainingAttempts = 3;
    gameState.gameInProgress = true;

    const categoriasFijas = categoriasColumnas;
    const generosDisponibles = obtenerGenerosDisponibles(infoDirectores);

    // Elegimos 1 género al azar
    const generoAleatorio = getRandomElements(generosDisponibles, 1)[0];

    // Elegimos 2 categorías normales
    const categoriasNormales = getRandomElements(categoriasFijas, 2);

    gameState.selectedCategories = seleccionarCategoriasConGeneroControlado();

    // Selección según el modo
    if (currentMode === 'directors') {
        let directorsPool;
        switch (currentDifficulty) {
            case 'easy':
                directorsPool = directoresNivelFacil;
                break;
            case 'medium':
                directorsPool = directoresNivelMedio;
                break;
            case 'hard':
                directorsPool = directoresNivelDificil;
                break;
            case 'total':
            default:
                directorsPool = directoresNivelTotal;
                break;
        }

        const categorias = gameState.selectedCategories;

        // Filtrar por compatibilidad
        let directoresCompatibles = directorsPool.filter(d => esDirectorCompatible(d, categorias));

        if (directoresCompatibles.length < 3) {
            console.warn("Muy pocos directores compatibles. Usando pool completo.");
            directoresCompatibles = directorsPool;
        }

        gameState.selectedDirectors = getRandomElements(directoresCompatibles, 3);
        console.log(`Selected difficulty: ${currentDifficulty}`);
        console.log(`Directors pool size: ${directorsPool.length}`);
    } else if (currentMode === 'geography') {
        const combinedGeographyCategories = [...categoriaPaises, ...categoriaRegiones];
        console.log(`Selected mode: geography`);
        console.log(`Geography categories pool size: ${combinedGeographyCategories.length}`);
        gameState.selectedDirectors = getRandomElements(combinedGeographyCategories, 3);
    }

    console.log('Selected Directors:', gameState.selectedDirectors);
    console.log('Selected Categories:', gameState.selectedCategories);

    // Contador de partidas
    if (!document.querySelector('.modal')) {
        gameStats.gamesPlayed++;
        saveStats();
    }

    generateGrid();
    initializeGrid();
    updateAttemptsCounter();
}

// Actualizar contador de intentos en la interfaz
function updateAttemptsCounter() {
    // Verificar si ya existe el contador
    let attemptsCounter = document.getElementById('attempts-counter');
    
    if (!attemptsCounter) {
        // Crear el contador si no existe
        attemptsCounter = document.createElement('div');
        attemptsCounter.id = 'attempts-counter';
        attemptsCounter.className = 'attempts-counter';
        document.querySelector('.search-container').insertAdjacentElement('beforebegin', attemptsCounter);
    }
    
    // Actualizar el contenido
    attemptsCounter.innerHTML = `Intentos restantes: <span>${gameState.remainingAttempts}</span>`;
}

// Intentar colocar una película en la celda seleccionada
async function tryPlaceMovie(movie) {
    if (!gameState.selectedCell || !gameState.gameInProgress) return;

    let fullMovieDetails = movie;
    // Check cache first
    if (movieDetailsCache[movie.id]) {
        fullMovieDetails = movieDetailsCache[movie.id];
    } else {
        // Fetch full movie details to get runtime
        const movieDetailsUrl = `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=en-US`;
        try {
            const response = await fetch(movieDetailsUrl);
            if (response.ok) {
                fullMovieDetails = await response.json();
                movieDetailsCache[movie.id] = fullMovieDetails; // Store in cache
            } else {
                console.warn(`Could not fetch full details for movie ID ${movie.id}. Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching full movie details:', error);
        }
    }

    // Verificar si la película ya ha sido colocada en otra celda
    const isMovieAlreadyPlaced = Object.values(gameState.filledCells).some(
        (filledMovie) => filledMovie.id === fullMovieDetails.id
    );

    if (isMovieAlreadyPlaced) {
        showMessage('Esta película ya ha sido colocada en otra casilla.', 'error');
        gameState.selectedCell.classList.remove('selected');
        gameState.selectedCell = null;
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').classList.add('hidden');
        return;
    }
    
    const row = gameState.selectedCell.dataset.row;
    const col = gameState.selectedCell.dataset.col;
    
    // Obtener el director de la fila
    const rowHeader = document.getElementById(`row${row}`);
    const rowCategoryName = rowHeader.textContent; // This can be director name or country/region
    
    // Obtener el criterio de la columna
    const colHeader = document.getElementById(`col${col}`);
    const categoryName = colHeader.textContent;
    
    console.log("Verificando película:", fullMovieDetails.title);
    console.log("Fila Categoría:", rowCategoryName);
    console.log("Columna Categoría:", categoryName);
    
    // Verificar si la película cumple con el criterio de la columna
    const directorExists = infoDirectores.hasOwnProperty(rowCategoryName);
    const meetsCategoryCriteria = directorExists
    ? validarTitulo(fullMovieDetails, categoryName, rowCategoryName)
    : validarTitulo(fullMovieDetails, categoryName);
    
    let meetsRowCriteria = false;
    if (currentMode === 'directors') {
        const directorId = directors[rowCategoryName];
        if (directorId && directorId !== 56025) {
            meetsRowCriteria = await checkMovieDirector(fullMovieDetails.id, directorId);
        } else {
            meetsRowCriteria = await checkMovieDirectorByName(fullMovieDetails.id, rowCategoryName);
        }
        console.log("¿Es del director?", meetsRowCriteria);
    } else if (currentMode === 'geography') {
        meetsRowCriteria = await checkMovieOrigin(fullMovieDetails.id, rowCategoryName);
        console.log("¿Es del origen geográfico?", meetsRowCriteria);
    }
    
    // Decrementar contador de intentos SOLO si la película no cumple con los criterios
    if (!(meetsCategoryCriteria && meetsRowCriteria)) {
        gameState.remainingAttempts--;
        updateAttemptsCounter();
        
        // Verificar si se han agotado los intentos
        if (gameState.remainingAttempts <= 0) {
            showMessage('¡Se han agotado los intentos! La partida ha terminado.', 'error');
            gameState.gameInProgress = false;
            return;
        }
        
        // La película no cumple con los criterios
        showMessage('Esta película no cumple con los criterios de la celda seleccionada.', 'error');
        return;
    }
    
    // La película cumple con ambos criterios
    fillCell(gameState.selectedCell, fullMovieDetails); // Use fullMovieDetails
    gameState.filledCells[`${row}-${col}`] = fullMovieDetails; // Use fullMovieDetails
    
    // Verificar si se ha completado el juego
    checkGameCompletion();
    
    // Limpiar la búsqueda
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').classList.add('hidden');
    gameState.selectedCell.classList.remove('selected');
    gameState.selectedCell = null;
}

// Verificar si se ha completado el juego
function checkGameCompletion() {
    const totalCells = gameState.selectedDirectors.length * gameState.selectedCategories.length;
    const filledCells = Object.keys(gameState.filledCells).length;
    
    console.log(`Verificando completitud: ${filledCells}/${totalCells} celdas llenas`);
    
    if (filledCells >= totalCells) {
        // El juego se ha completado
        gameState.gameInProgress = false;
        gameStats.gamesCompleted++;
        saveStats();
        
        // Eliminar el alert y mostrar directamente el modal de estadísticas
        setTimeout(() => {
            showStatsModal();
        }, 500);
    }
}

// Generar la cuadrícula dinámicamente
function generateGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';

    // Añadir celda de logo
    const logoCell = document.createElement('div');
    logoCell.className = 'grid-cell header-cell logo-cell-container'; // Clase para el contenedor del logo
    logoCell.innerHTML = '<div class="logo-cell">CINE-GRID</div>';
    gridContainer.appendChild(logoCell);

    // Añadir encabezados de columnas (categorías)
    gameState.selectedCategories.forEach((category, index) => {
        const colHeader = document.createElement('div');
        colHeader.className = 'grid-cell header-cell category-header'; // Clase para identificarlo
        colHeader.id = `col${index + 1}`;
        colHeader.textContent = category;
        colHeader.addEventListener('click', () => {
            document.getElementById('category-info-title').textContent = category;
            document.getElementById('category-info-description').textContent = categoryDescriptions[category] || 'Información no disponible.';
            openModal('category-info-modal');
        });
        gridContainer.appendChild(colHeader);
    });

    // Añadir filas para cada director/país/región
    gameState.selectedDirectors.forEach((rowCategoryName, rowIndex) => {
        const rowHeader = document.createElement('div');
        rowHeader.className = 'grid-cell header-cell director-header'; // Reusing class for now, might need a new one
        rowHeader.id = `row${rowIndex + 1}`;
        rowHeader.textContent = rowCategoryName;
        rowHeader.addEventListener('click', async () => {
            if (currentMode === 'directors') {
                const directorId = directors[rowCategoryName];
                if (directorId) {
                    try {
                        const response = await fetch(`${BASE_URL}/person/${directorId}?api_key=${API_KEY}`);
                        if (!response.ok) {
                            const errorText = await response.text();
                            console.error(`Error en la API de TMDB: ${response.status} ${response.statusText}`, errorText);
                            showMessage(`Error en la API de TMDB: ${response.status} ${response.statusText}`, 'error');
                            throw new Error(`Falló la solicitud a la API de TMDB: ${response.status}`);
                        }
                        const personData = await response.json();
                        if (personData.profile_path) {
                            document.getElementById('director-modal-name').textContent = personData.name;
                            document.getElementById('director-modal-image').src = `${PERSON_IMAGE_BASE_URL}${personData.profile_path}`;
                            openModal('director-modal');
                        } else {
                            console.warn(`No se encontró imagen para el director ID ${directorId} (Nombre: ${personData.name}). Datos recibidos:`, personData);
                            // Set a placeholder image if profile_path is not found
                            document.getElementById('director-modal-image').src = 'https://via.placeholder.com/300x450?text=No+Image'; // Generic placeholder
                            showMessage('No se encontró imagen para este director. Mostrando imagen por defecto.', 'info');
                            openModal('director-modal'); // Still open the modal with placeholder
                        }
                    } catch (error) {
                        console.error('Error fetching director details:', error);
                        showMessage('Error al cargar datos del director. Revisa la consola para más detalles.', 'error');
                    }
                } else {
                    showMessage('ID de director no encontrado.', 'error');
                }
            } else if (currentMode === 'geography') {
                document.getElementById('geography-info-title').textContent = rowCategoryName;
                document.getElementById('geography-info-description').textContent = geographyDescriptions[rowCategoryName] || 'Información no disponible.';
                openModal('geography-info-modal');
            }
        });
        gridContainer.appendChild(rowHeader);

        // Celdas de contenido para cada categoría
        gameState.selectedCategories.forEach((_, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell content-cell';
            cell.dataset.row = rowIndex + 1;
            cell.dataset.col = colIndex + 1;
            gridContainer.appendChild(cell);
        });
    });
}

// Inicializar la cuadrícula
function initializeGrid() {
    const contentCells = document.querySelectorAll('.content-cell');
    
    contentCells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Deseleccionar la celda anterior si existe
            if (gameState.selectedCell) {
                gameState.selectedCell.classList.remove('selected');
            }
            
            // Ocultar resultados de búsqueda
            document.getElementById('search-results').classList.add('hidden');
            
            // Seleccionar la nueva celda si no está llena
            if (!cell.classList.contains('filled')) {
                cell.classList.add('selected');
                gameState.selectedCell = cell;
                document.getElementById('search-input').focus();
            }
        });
    });
}

// Configurar la funcionalidad de búsqueda
function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    
    // Manejar la entrada de búsqueda
    searchInput.addEventListener('input', debounce(async (e) => {
        const query = e.target.value.trim();
        
        try {
            const results = await searchMovies(query);
            displaySearchResults(results);
        } catch (error) {
            console.error('Error al buscar películas:', error);
        }
    }, 500));
    
    // Manejar el clic en el botón de búsqueda
    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        
        if (query.length < 3) return;
        
        try {
            const results = await searchMovies(query);
            displaySearchResults(results);
        } catch (error) {
            console.error('Error al buscar películas:', error);
        }
    });
    
    // Manejar la selección de resultados de búsqueda
    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result');
        
        if (resultItem && gameState.selectedCell) {
            const movieData = JSON.parse(resultItem.dataset.movie);
            tryPlaceMovie(movieData);
        }
    });
}

// Función para buscar películas - Modificada para buscar en inglés
async function searchMovies(query) {
    let movieTitle = query;
    let releaseYear = null;

    // Regex to find " (YYYY)" at the end of the query
    const yearMatch = query.match(/\s\((\d{4})\)$/);

    if (yearMatch && yearMatch[1]) {
        releaseYear = yearMatch[1];
        movieTitle = query.replace(yearMatch[0], '').trim();
    }

    let url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}&language=en-US`;

    if (releaseYear) {
        url += `&primary_release_year=${releaseYear}`;
    }
    
    console.log('Searching with URL:', url); // Added for debugging
    const response = await fetch(url);
    const data = await response.json();
    console.log('Search API response:', data); // Added for debugging

    return data.results.slice(0, 20); // Aumentar a 20 resultados
}

// Mostrar resultados de búsqueda
function displaySearchResults(movies) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (movies.length === 0) {
        searchResults.innerHTML = '<div class="search-result">No se encontraron resultados</div>';
        searchResults.classList.add('hidden');
        return;
    }
    
    movies.forEach(async (movie) => {
        // Obtener detalles completos de la película para acceder a la fecha original
        const detailsUrl = `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}`;
        try {
            const response = await fetch(detailsUrl);
            const details = await response.json();
            
            // Usar la fecha de producción original si está disponible
            const originalYear = details.release_date ? new Date(details.release_date).getFullYear() : 
                                (movie.release_date ? movie.release_date.substring(0, 4) : 'N/A');
            
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result');
            resultItem.dataset.movie = JSON.stringify(movie);
            
            resultItem.innerHTML = `
                <div>${movie.title} (${originalYear})</div>
            `;
            
            searchResults.appendChild(resultItem);
        } catch (error) {
            console.error('Error al obtener detalles de la película:', error);
            // Fallback a la visualización básica
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result');
            resultItem.dataset.movie = JSON.stringify(movie);
            
            resultItem.innerHTML = `
                <div>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</div>
            `;
            
            searchResults.appendChild(resultItem);
        }
    });
    
    searchResults.classList.remove('hidden');
}

// Verificar si una película es de un director específico por ID
async function checkMovieDirector(movieId, directorId) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        return data.crew.some(person => 
            person.job === 'Director' && person.id === directorId
        );
    } catch (error) {
        console.error('Error al verificar el director por ID:', error);
        return false;
    }
}

// Verificar si una película es de un director específico por nombre
async function checkMovieDirectorByName(movieId, directorName) {
    try {
        const url = `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Normalizar el nombre del director para comparación
        const normalizedDirectorName = directorName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        // Imprimir información de depuración
        console.log("Buscando director:", normalizedDirectorName);
        console.log("Directores de la película:", data.crew.filter(p => p.job === 'Director').map(p => p.name));
        
        // Dividir el nombre del director en partes
        const directorParts = normalizedDirectorName.split(' ');
        
        return data.crew.some(person => {
            if (person.job === 'Director') {
                const normalizedPersonName = person.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const personParts = normalizedPersonName.split(' ');
                
                // Verificar si hay coincidencia exacta
                if (normalizedPersonName === normalizedDirectorName) {
                    return true;
                }
                
                // Verificar si el apellido coincide (asumiendo que el apellido es la última parte)
                const directorLastName = directorParts[directorParts.length - 1];
                const personLastName = personParts[personParts.length - 1];
                
                if (directorLastName === personLastName) {
                    return true;
                }
                
                // Verificar si hay coincidencia parcial significativa
                // Por ejemplo, "Paolo Sorrentino" debería coincidir con "Paolo Sorrentino"
                const matchScore = personParts.filter(part => 
                    directorParts.some(dirPart => 
                        part.length > 2 && dirPart.length > 2 && 
                        (part.includes(dirPart) || dirPart.includes(part))
                    )
                ).length;
                
                // Si más de la mitad de las partes coinciden, consideramos que es el mismo director
                return matchScore >= Math.min(directorParts.length, personParts.length) / 2;
            }
            return false;
        });
    } catch (error) {
        console.error('Error al verificar el director por nombre:', error);
        return false;
    }
}

// Nueva función para verificar el origen geográfico de una película
async function checkMovieOrigin(movieId, originName) {
    try {
        const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        // Check if it's a country
        if (paises[originName]) {
            const countryCodes = paises[originName];
            return data.production_countries.some(country => countryCodes.includes(country.iso_3166_1));
        } 
        // Check if it's a region
        else if (regiones[originName]) {
            const regionCountryCodes = regiones[originName];
            return data.production_countries.some(country => regionCountryCodes.includes(country.iso_3166_1));
        }
        return false;
    } catch (error) {
        console.error('Error al verificar el origen geográfico:', error);
        return false;
    }
}

// Llenar una celda con una película
function fillCell(cell, movie) {
    // Crear elemento para el título de la película
    const titleElement = document.createElement('div');
    titleElement.classList.add('movie-title');
    titleElement.textContent = movie.title;
    
    // Limpiar la celda y agregar el título
    cell.innerHTML = '';
    cell.appendChild(titleElement);
    
    // Agregar la clase filled y establecer la imagen de fondo
    cell.classList.add('filled');
    
    if (movie.poster_path) {
        cell.style.backgroundImage = `url(${IMAGE_BASE_URL}${movie.poster_path})`;
    }
}

// Función para retrasar la ejecución (debounce)
function debounce(func, delay) {
    let timeout;
    
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Configurar la funcionalidad del header
function setupHeaderFunctionality() {
    // Obtener referencias a los iconos del header
    const infoIconLink = document.getElementById('info-icon-link');
    const statsIconLink = document.getElementById('stats-icon-link');
    const directorsModeLink = document.getElementById('directors-mode-link'); // New: Directors Mode Link
    const geographyModeLink = document.getElementById('geography-mode-link');
    const difficultySelect = document.getElementById('difficulty-select');
    const letterboxdIcon = document.querySelector('.letterboxd-icon'); // Still using class for this one
    const twitterIcon = document.querySelector('.fa-twitter'); // Still using class for this one
    
    // Configurar evento para el icono de información
    if (infoIconLink) {
        infoIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal();
        });
    }
    
    // Configurar evento para el icono de estadísticas
    if (statsIconLink) {
        statsIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            showStatsModal();
        });
    }

    // Configurar evento para el icono de modo geografía
    if (geographyModeLink) {
        geographyModeLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentMode = 'geography';
            // Reset difficulty to total when switching to geography mode
            currentDifficulty = 'total'; 
            if (difficultySelect) {
                difficultySelect.value = 'total';
            }
            saveGameSettings(); // Save settings after change
            updateModeVisuals(); // Update visuals
            startNewGame();
        });
    }

    // Configurar evento para el icono de modo directores
    if (directorsModeLink) {
        directorsModeLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentMode = 'directors';
            // Keep current difficulty when switching to directors mode
            saveGameSettings(); // Save settings after change
            updateModeVisuals(); // Update visuals
            startNewGame();
        });
    }

    // Configurar evento para el selector de dificultad
    if (difficultySelect) {
        difficultySelect.addEventListener('change', (e) => {
            currentDifficulty = e.target.value;
            currentMode = 'directors'; // Ensure director mode when difficulty is selected
            saveGameSettings(); // Save settings after change
            updateModeVisuals(); // Update visuals
            startNewGame();
        });
    }
    
    // Configurar eventos para redes sociales
    if (letterboxdIcon) {
        letterboxdIcon.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://www.letterboxd.com/alfoonsso', '_blank');
        });
    }
    
    if (twitterIcon) {
        twitterIcon.parentElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://www.x.com/alfoonsso', '_blank');
        });
    }
}

// Mostrar modal de información
function showInfoModal() {
    // Crear el modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Acerca de CINE-GRID</h2>
            <p>CINE-GRID es un juego de conocimiento cinematográfico donde debes encontrar películas que cumplan con dos criterios: el director y una característica específica.</p>
            <h3>Cómo jugar:</h3>
            <ol>
                <li>Selecciona una celda de la cuadrícula.</li>
                <li>Busca una película que sea del director indicado en la fila y que cumpla con el criterio de la columna.</li>
                <li>Para búsquedas más precisas, puedes añadir el año entre paréntesis al título de la película (ej. "The Realm (2018)").</li>
                <li>¡Completa toda la cuadrícula para ganar!</li>
            </ol>
            <p>Desarrollado con ❤️ para amantes del cine.</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar el botón de cierre
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Cerrar el modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Mostrar modal de estadísticas
function showStatsModal() {
    // Calcular estadísticas
    const totalCells = gameState.selectedDirectors.length * gameState.selectedCategories.length;
    const filledCells = Object.keys(gameState.filledCells).length;
    const progress = Math.round((filledCells / totalCells) * 100);
    
    // Crear el modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Asegurarse de que las estadísticas estén actualizadas
    const tasaExito = gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesCompleted / gameStats.gamesPlayed) * 100) : 0;
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Estadísticas</h2>
            <div class="stats-container">
                <div class="stat-item">
                    <div class="stat-value">${filledCells}/${totalCells}</div>
                    <div class="stat-label">Celdas completadas</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${progress}%</div>
                    <div class="stat-label">Progreso</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${gameState.remainingAttempts}</div>
                    <div class="stat-label">Intentos restantes</div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
            <div class="global-stats">
                <h3>Estadísticas globales</h3>
                <div class="stats-container">
                    <div class="stat-item">
                        <div class="stat-value">${gameStats.gamesPlayed}</div>
                        <div class="stat-label">Partidas jugadas</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${gameStats.gamesCompleted}</div>
                        <div class="stat-label">Partidas completadas</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${tasaExito}%</div>
                        <div class="stat-label">Tasa de éxito</div>
                    </div>
                </div>
            </div>
            <div class="button-container">
                <button id="restart-game" class="restart-button">Reiniciar partida</button>
                <button id="reset-stats" class="reset-button">Reiniciar estadísticas</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar el botón de cierre
    const closeButton = modal.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Configurar el botón de reinicio de partida
    const restartButton = modal.querySelector('#restart-game');
    restartButton.addEventListener('click', () => {
        document.body.removeChild(modal);
        startNewGame();
    });
    
    // Configurar el botón de reinicio de estadísticas
    const resetStatsButton = modal.querySelector('#reset-stats');
    resetStatsButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas? Esta acción no se puede deshacer.')) {
            resetStats();
            document.body.removeChild(modal);
            showStatsModal(); // Volver a mostrar el modal con las estadísticas reiniciadas
        }
    });
    
    // Cerrar el modal al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Función para reiniciar las estadísticas
function resetStats() {
    gameStats.gamesPlayed = 0;
    gameStats.gamesCompleted = 0;
    saveStats();
}

// Helper functions for modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Función para mostrar mensajes al usuario
function showMessage(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) return;

    // Clear previous messages
    notificationContainer.innerHTML = '';

    const messageElement = document.createElement('div');
    messageElement.classList.add('notification-message', type);
    messageElement.textContent = message;

    notificationContainer.appendChild(messageElement);

    // Show the notification
    notificationContainer.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        notificationContainer.classList.remove('show');
        // Optional: clear message after transition
        setTimeout(() => {
            notificationContainer.innerHTML = '';
        }, 500); // Match CSS transition duration
    }, 3000);
}

// Asegúrate que generateGrid y otras funciones que usan openModal/closeModal vengan DESPUÉS de estas definiciones.
