import { gameState, gameStats, currentMode, currentDifficulty } from './gameState.js';
import { showMessage, updateAttemptsCounter, updateScoreDisplay } from './uiHelpers.js';
import { endGame } from './gameLogic.js';
import { saveStats } from './storageManager.js';
import { fillCell } from './gridManager.js';
import { apiService } from './apiService.js';
import { updateMaxScoreDisplay } from './uiHelpers.js';

export async function tryPlaceMovie(movie) {
    // Ensure game is in progress and a cell is selected
    if (!gameState.gameInProgress || !gameState.selectedCell) {
        console.warn("tryPlaceMovie called but game not in progress or no cell selected.");
        return;
    }

    // Get row and column indices (already 0-based from gridManager)
    const row = parseInt(gameState.selectedCell.dataset.row);
    const col = parseInt(gameState.selectedCell.dataset.col);

    // Validate that categories are properly selected
    if (!gameState.selectedRowCategories || !gameState.selectedColCategories) {
        console.error("Categories not selected properly");
        showMessage('Error: Las categorías no están seleccionadas correctamente.', 'error');
        cleanupSearchAndSelection();
        return;
    }

    // Validate row and column indices
    if (row < 0 || row >= gameState.selectedRowCategories.length) {
        console.error(`Invalid row index: ${row}. Available rows: ${gameState.selectedRowCategories.length}`);
        showMessage('Error: Índice de fila inválido.', 'error');
        cleanupSearchAndSelection();
        return;
    }

    if (col < 0 || col >= gameState.selectedColCategories.length) {
        console.error(`Invalid column index: ${col}. Available columns: ${gameState.selectedColCategories.length}`);
        showMessage('Error: Índice de columna inválido.', 'error');
        cleanupSearchAndSelection();
        return;
    }

    // Get the category objects for this row and column
    const rowCategory = gameState.selectedRowCategories[row];
    const colCategory = gameState.selectedColCategories[col];

    // Additional validation to ensure categories exist
    if (!rowCategory || !colCategory) {
        console.error("Row or column category is undefined:", { rowCategory, colCategory, row, col });
        showMessage('Error: Categoría no encontrada para esta celda.', 'error');
        cleanupSearchAndSelection();
        return;
    }

    // Fetch full movie details to get runtime, genres, production countries, popularity etc.
    const fullMovieDetails = await apiService.getMovieDetails(movie.id);
    if (!fullMovieDetails) {
        gameState.remainingAttempts--;
        updateAttemptsCounter();
        showMessage('Error al obtener detalles completos de la película.', 'error');
        
        if (gameState.remainingAttempts <= 0) {
            endGame(false);
            return;
        }
        
        cleanupSearchAndSelection();
        return;
    }

    // Check if movie is already placed
    const isMovieAlreadyPlaced = Object.values(gameState.filledCells).some(
        (filledMovie) => filledMovie.id === fullMovieDetails.id
    );

    if (isMovieAlreadyPlaced) {
        gameState.remainingAttempts--;
        updateAttemptsCounter();
        showMessage('Esta película ya ha sido colocada en otra casilla.', 'error');
        
        if (gameState.remainingAttempts <= 0) {
            endGame(false);
            return;
        }
        
        cleanupSearchAndSelection();
        return;
    }

    console.log("Verifying movie:", fullMovieDetails.title, "(ID:", fullMovieDetails.id, ", Popularity:", fullMovieDetails.popularity, ")");
    console.log("Against Row Category:", rowCategory.nombre, `(Tipo: ${rowCategory.tipo}, ID: ${rowCategory.id}, TMDB_ID: ${rowCategory.tmdb_id || 'N/A'})`);
    console.log("Against Col Category:", colCategory.nombre, `(Tipo: ${colCategory.tipo}, ID: ${colCategory.id})`);

    // Validate row criteria
    let meetsRowCriteria = false;
    if (rowCategory.tipo === 'director') {
        if (rowCategory.tmdb_id) {
            meetsRowCriteria = await apiService.checkMovieDirector(fullMovieDetails.id, rowCategory.tmdb_id);
        } else {
            console.warn(`Row category "${rowCategory.nombre}" is a director but missing TMDB ID.`);
            meetsRowCriteria = false;
        }
        console.log("Does it meet row criteria (Director)?", meetsRowCriteria);
    } else if (rowCategory.tipo === 'pais' || rowCategory.tipo === 'region') {
        const allowedIsoCodes = Array.isArray(rowCategory.iso_codes) ? rowCategory.iso_codes : [];
        if (allowedIsoCodes.length > 0) {
            meetsRowCriteria = await apiService.checkMovieOrigin(fullMovieDetails.id, allowedIsoCodes);
        } else {
            console.warn(`Row category "${rowCategory.nombre}" is geographic but missing or invalid ISO codes.`);
            meetsRowCriteria = false;
        }
        console.log("Does it meet row criteria (Geography)?", meetsRowCriteria);
    } else {
        console.error("Unknown row category type during validation:", rowCategory.tipo);
        meetsRowCriteria = false;
    }

    // Validate column criterion
    const meetsColCriteria = apiService.validarColCriterion(fullMovieDetails, colCategory);
    console.log("Does it meet column criteria?", meetsColCriteria);

    // Handle validation result
    if (!(meetsRowCriteria && meetsColCriteria)) {
        gameState.remainingAttempts--;
        updateAttemptsCounter();
        showMessage('Esta película no cumple con los criterios de la celda seleccionada.', 'error');

        if (gameState.remainingAttempts <= 0) {
            endGame(false);
            return;
        }

        cleanupSearchAndSelection();
        return;
    }

    // Movie meets both criteria - place it
    const movieScore = calculateScore(fullMovieDetails.popularity);
    gameState.currentScore += movieScore;
    updateScoreDisplay();

    fillCell(gameState.selectedCell, fullMovieDetails);
    gameState.filledCells[`${row}-${col}`] = fullMovieDetails;

    // Check if game is completed
    checkGameCompletion();

    // Clean up
    cleanupSearchAndSelection();
}

export function calculateScore(popularity) {
    if (typeof popularity !== 'number' || popularity <= 0) {
        return 1; // Minimum score if popularity is invalid or 0
    }
    
    // Simple inverse scaling: higher popularity -> lower score
    const scaleFactor = 5000;
    const score = Math.round(scaleFactor / popularity);
    
    return Math.max(1, score); // Ensure a minimum score of 1
}

export function updateUserBestScore(score) {
    const key = `${currentMode}_${currentDifficulty}`;
    const currentBest = gameStats.userBestScores[key] || 0;
    
    if (score > currentBest) {
        gameStats.userBestScores[key] = score;
        saveStats(); // Guardar en localStorage
        updateMaxScoreDisplay(); // Actualizar la pantalla
        console.log(`Nueva puntuación máxima para ${key}: ${score}`);
        showMessage(`¡Nueva puntuación máxima para ${currentMode === 'directors' ? 'Directores' : 'Geografía'} (${currentDifficulty === 'total' ? 'Total' : currentDifficulty})!: ${score}`, 'success', 5000);
    }
}

function checkGameCompletion() {
    if (gameState.selectedRowCategories.length === 0 || gameState.selectedColCategories.length === 0) {
        console.warn("Cannot check completion: Categories not selected.");
        return;
    }
    
    const totalCells = gameState.selectedRowCategories.length * gameState.selectedColCategories.length;
    const filledCells = Object.keys(gameState.filledCells).length;
    
    console.log(`Checking completion: ${filledCells}/${totalCells} cells filled`);
    
    if (totalCells === 0) {
        console.warn("Total cells is 0, cannot complete game.");
        return;
    }
    
    if (filledCells >= totalCells && gameState.gameInProgress) {
        // Update best score before ending game
        if (gameState.currentScore > 0) {
            updateUserBestScore(gameState.currentScore);
        }
        endGame(true);
    }
}

function cleanupSearchAndSelection() {
    if (gameState.selectedCell) {
        gameState.selectedCell.classList.remove('selected');
    }
    gameState.selectedCell = null;
    document.getElementById('search-input').value = '';
    document.getElementById('search-results').classList.add('hidden');
    document.getElementById('search-results').classList.remove('show');
}