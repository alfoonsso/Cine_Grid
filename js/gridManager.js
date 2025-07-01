import { gameState } from './gameState.js';
import { apiService, TMDB_IMAGE_BASE_URL, TMDB_PERSON_IMAGE_BASE_URL } from './apiService.js';
import { openModal } from './modalManager.js';

export function generateGrid() {
    const gridContainer = document.getElementById('grid-container');
    if (!gridContainer) {
        console.error("Grid container element #grid-container not found!");
        return;
    }
    gridContainer.innerHTML = ''; // Clear previous grid content

    // Check if we have categories to build the grid
    if (gameState.selectedRowCategories.length === 0 || gameState.selectedColCategories.length === 0) {
        console.warn("Cannot generate grid: No row or column categories selected.");
        return;
    }

    // Set grid columns based on selected categories (+1 for the row header column)
    gridContainer.style.gridTemplateColumns = `auto repeat(${gameState.selectedColCategories.length}, 1fr)`;

    // Add logo cell
    const logoCell = document.createElement('div');
    logoCell.className = 'grid-cell header-cell logo-cell-container';
    logoCell.innerHTML = '<div class="logo-cell">CINE-GRID</div>';
    gridContainer.appendChild(logoCell);

    // Add column headers (categories)
    gameState.selectedColCategories.forEach((category, index) => {
        const colHeader = document.createElement('div');
        colHeader.className = `grid-cell header-cell category-header ${category.tipo}`;
        colHeader.id = `col${index + 1}`;
        colHeader.textContent = category.nombre;
        colHeader.dataset.categoryId = category.id;
        colHeader.dataset.categoryType = category.tipo;
        colHeader.dataset.categoryDescription = category.descripcion || 'Información no disponible.';

        colHeader.addEventListener('click', () => {
            document.getElementById('category-info-title').textContent = colHeader.textContent;
            document.getElementById('category-info-description').textContent = category.descripcion || 'Información no disponible.';
            openModal('category-info-modal');
        });
        gridContainer.appendChild(colHeader);
    });

    // Add rows for each row category (director/geography)
    gameState.selectedRowCategories.forEach((rowCategory, rowIndex) => {
        const rowHeader = document.createElement('div');
        rowHeader.className = `grid-cell header-cell row-header ${rowCategory.tipo}`;
        rowHeader.id = `row${rowIndex + 1}`;
        rowHeader.textContent = rowCategory.nombre;
        rowHeader.dataset.categoryId = rowCategory.id;
        rowHeader.dataset.categoryType = rowCategory.tipo;
        if(rowCategory.tmdb_id) rowHeader.dataset.categoryTmdbId = rowCategory.tmdb_id;
        if(rowCategory.iso_codes && Array.isArray(rowCategory.iso_codes)) rowHeader.dataset.categoryIsoCodes = JSON.stringify(rowCategory.iso_codes);
        rowHeader.dataset.categoryDescription = rowCategory.descripcion || 'Información no disponible.';

        rowHeader.addEventListener('click', async () => {
            if (rowCategory.tipo === 'director') {
                const directorTmdbId = rowCategory.tmdb_id;
                if (directorTmdbId) {
                    try {
                        const personData = await apiService.getPersonDetails(directorTmdbId);
                        document.getElementById('director-modal-name').textContent = personData.name;
                        const imageUrl = personData.profile_path ? `${TMDB_PERSON_IMAGE_BASE_URL}${personData.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
                        document.getElementById('director-modal-image').src = imageUrl;
                        document.getElementById('director-modal-image').alt = `${personData.name} headshot`;
                        openModal('director-modal');
                    } catch (error) {
                        console.error('Error fetching director details:', error);
                        document.getElementById('director-modal-name').textContent = rowCategory.nombre;
                        document.getElementById('director-modal-image').src = 'https://via.placeholder.com/300x450?text=No+Image';
                        document.getElementById('director-modal-image').alt = 'Director image not available';
                        openModal('director-modal');
                    }
                } else {
                    document.getElementById('director-modal-name').textContent = rowCategory.nombre;
                    document.getElementById('director-modal-image').src = 'https://via.placeholder.com/300x450?text=No+Image';
                    document.getElementById('director-modal-image').alt = 'Director image not available';
                    openModal('director-modal');
                }
            } else if (rowCategory.tipo === 'pais' || rowCategory.tipo === 'region') {
                document.getElementById('geography-info-title').textContent = rowCategory.nombre;
                document.getElementById('geography-info-description').textContent = rowCategory.descripcion || 'Información no disponible.';
                openModal('geography-info-modal');
            }
        });
        gridContainer.appendChild(rowHeader);

        // Add content cells for this row
        gameState.selectedColCategories.forEach((colCategory, colIndex) => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell content-cell';
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;
            gridContainer.appendChild(cell);
        });
    });
}

export function initializeGrid() {
    const contentCells = document.querySelectorAll('.content-cell');
    
    contentCells.forEach(cell => {
        // Remove existing listeners by cloning
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
        
        // Add click event listener to the new cell
        newCell.addEventListener('click', () => handleCellClick(newCell));
    });

    // Restore filled cells after setting up event listeners
    restoreFilledCells();
}

function handleCellClick(cell) {
    // Clear previous selection
    if (gameState.selectedCell) {
        gameState.selectedCell.classList.remove('selected');
    }
    
    // Hide search results
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) searchInput.value = '';
    if (searchResults) {
        searchResults.classList.add('hidden');
        searchResults.classList.remove('show');
    }

    // Select new cell if valid
    if (gameState.gameInProgress && !cell.classList.contains('filled')) {
        cell.classList.add('selected');
        gameState.selectedCell = cell;
        if (searchInput) searchInput.focus();
    } else {
        gameState.selectedCell = null;
    }
}

function restoreFilledCells() {
    // Verificar que gameState.filledCells existe y no está vacío
    if (!gameState.filledCells || Object.keys(gameState.filledCells).length === 0) {
        return; // No hay celdas para restaurar
    }
    
    for (const cellKey in gameState.filledCells) {
        const movieData = gameState.filledCells[cellKey];
        
        // Validar que los datos de la película sean válidos antes de restaurar
        if (!movieData || typeof movieData.id === 'undefined' || !movieData.title) {
            console.warn(`Skipping invalid movie data for cell ${cellKey}:`, movieData);
            // Limpiar la entrada inválida
            delete gameState.filledCells[cellKey];
            continue;
        }
        
        const [row, col] = cellKey.split('-');
        const cell = document.querySelector(`.content-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            fillCell(cell, movieData);
        }
    }
}

export function fillCell(cell, movie) {
    if (!cell || !movie || typeof movie.id === 'undefined' || !movie.title) {
        console.error("Attempted to fill cell with invalid data.", cell, movie);
        return;
    }

    const titleElement = document.createElement('div');
    titleElement.classList.add('movie-title');
    titleElement.textContent = movie.title;

    cell.innerHTML = '';
    cell.appendChild(titleElement);
    cell.classList.add('filled');

    if (movie.poster_path) {
        cell.style.backgroundImage = `url(${TMDB_IMAGE_BASE_URL}${movie.poster_path})`;
        cell.style.backgroundSize = 'cover';
        cell.style.backgroundPosition = 'center';
        cell.style.backgroundColor = '';
    } else {
        cell.style.backgroundImage = 'none';
        cell.style.backgroundColor = '#1e3a5f';
    }

    cell.dataset.movieId = movie.id;
    cell.title = movie.title;
}