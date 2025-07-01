import { gameState, gameStats, currentMode, currentDifficulty, resetGameState } from './gameState.js';
import { getRandomElements } from './dataManager.js';
import { generateGrid, initializeGrid } from './gridManager.js';
import { updateAttemptsCounter, updateScoreDisplay, updateMaxScoreDisplay, showMessage, showStatsModal } from './uiHelpers.js';
import { saveStats } from './storageManager.js';
import { updateUserBestScore } from './movieValidator.js';
import { showStartMenu } from './menuManager.js';
import { setupSearchFunctionality } from './searchManager.js';
import { loadStats } from './storageManager.js';
import { apiService } from './apiService.js'; // Agregar esta línea

export async function startNewGame() {
    console.log('Starting new game...');
    resetGameState();
    
    // Reemplazar updateUI() con las funciones específicas
    updateAttemptsCounter();
    updateScoreDisplay();
    updateMaxScoreDisplay();
    
    // Eliminar esta línea:
    // gameStats.gamesPlayed++;
    
    // Reemplazar isDataLoaded() con gameState.dataLoaded
    if (!gameState.dataLoaded) {
        showMessage('Los datos aún se están cargando. Por favor, espera un momento.', 'warning');
        return;
    }
    
    console.log('About to select categories...');
    await selectGameCategories(); // Agregar await aquí
    
    // Validar que las categorías se seleccionaron correctamente
    if (!gameState.selectedRowCategories || gameState.selectedRowCategories.length === 0) {
        console.error('Failed to select row categories');
        showMessage('Error al seleccionar categorías de fila.', 'error');
        return;
    }
    
    if (!gameState.selectedColCategories || gameState.selectedColCategories.length === 0) {
        console.error('Failed to select column categories');
        showMessage('Error al seleccionar categorías de columna.', 'error');
        return;
    }
    
    console.log('Categories selected successfully:', {
        rows: gameState.selectedRowCategories.length,
        cols: gameState.selectedColCategories.length
    });
    
    // IMPORTANTE: Establecer que el juego está en progreso
    gameState.gameInProgress = true;
    
    generateGrid();
    initializeGrid();
    
    // Limpiar el input de búsqueda y ocultar resultados
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    if(searchInput) searchInput.value = '';
    if(searchResults) {
        searchResults.classList.add('hidden');
        searchResults.classList.remove('show');
    }
}

// Cambiar esta función de:
async function selectGameCategories() {
    const numNormalCols = 2;
    const numGenreCols = 1;

    if (gameState.allPossibleCriteria.length < numNormalCols || 
        gameState.allPossibleGenres.length < numGenreCols) {
        console.error("Insufficient criteria or genres available.");
        showMessage("Error interno: No hay suficientes categorías para iniciar el juego.", "error", 15000);
        return false;
    }

    // Select columns
    const selectedNormalCols = getRandomElements(gameState.allPossibleCriteria, numNormalCols);
    const selectedGenreCols = selectGenreColumns(numGenreCols);
    
    if (!selectedGenreCols || selectedGenreCols.length === 0) {
        return false;
    }

    // Select rows
    const possibleRowCategories = selectRowCategories(selectedGenreCols[0]);
    if (!possibleRowCategories || possibleRowCategories.length < 3) {
        return false;
    }

    gameState.selectedRowCategories = getRandomElements(possibleRowCategories, 3);
    gameState.selectedColCategories = [...selectedNormalCols, ...selectedGenreCols].sort(() => Math.random() - 0.5);

    console.log('Selected Categories:', {
        rows: gameState.selectedRowCategories.map(cat => `${cat.nombre} (${cat.tipo})`),
        cols: gameState.selectedColCategories.map(cat => `${cat.nombre} (${cat.tipo})`)
    });

    // Después de seleccionar categorías, validar conflictos
    // Comentar estas líneas que causan los errores:
    // import { apiService } from './apiService.js';
    
    // Comentar también estas líneas que usan 'conflicts':
    // if (conflicts.length > 0) {
    //     console.warn('Conflictos detectados:', conflicts);
    //     // Reseleccionar categorías o mostrar advertencia
    //     return selectGameCategories(); // Reintentar
    // }
    
    return true;
}

function selectGenreColumns(numGenreCols) {
    let selectedGenreCols = [];
    
    if (currentMode === 'directors') {
        // Filter directors by current difficulty
        const directorsPoolForDifficulty = gameState.allPossibleDirectors.filter(cat =>
            currentDifficulty === 'total' ? true : (cat.difficulty === currentDifficulty)
        );

        // Find all genres that have AT LEAST 3 directors in this difficulty pool
        const genreCounts = new Map();
        directorsPoolForDifficulty.forEach(directorCat => {
            if (Array.isArray(directorCat.generos)) {
                directorCat.generos.forEach(genreName => {
                    genreCounts.set(genreName, (genreCounts.get(genreName) || 0) + 1);
                });
            }
        });

        const genresWithEnoughDirectors = Array.from(genreCounts.keys()).filter(genreName =>
             genreCounts.get(genreName) >= 3
        );

        console.log(`Genres with >= 3 directors in "${currentDifficulty}" pool:`, genresWithEnoughDirectors);

        // Filter the list of genre category objects to only include those genres with enough directors
        const possibleGenreColsWithEnoughDirectors = gameState.allPossibleGenres.filter(genreCat =>
            genresWithEnoughDirectors.includes(genreCat.nombre)
        );

        // Select 1 random genre from this filtered pool
        if (possibleGenreColsWithEnoughDirectors.length > 0) {
            selectedGenreCols = getRandomElements(possibleGenreColsWithEnoughDirectors, numGenreCols);
            console.log(`Selected genre compatible with >= 3 directors:`, selectedGenreCols.map(g => g.nombre));
        } else {
            // Fallback to selecting ANY genre from ALL
             console.warn(`No genres found with >= 3 directors in "${currentDifficulty}" pool. Falling back to selecting a random genre from ALL genres.`);
             selectedGenreCols = getRandomElements(gameState.allPossibleGenres, numGenreCols);

             if (selectedGenreCols.length < numGenreCols) {
                   console.error("Critical Error: Not enough genres available even in total pool for fallback.");
                    showMessage("Error crítico: No hay suficientes géneros disponibles para seleccionar columnas.", "error", 15000);
                    gameState.gameInProgress = false;
                    showStartMenu();
                    return null;
             }
             showMessage(`No hay géneros con suficientes directores en esta dificultad. El género seleccionado puede no ser trabajado por todos los directores.`, 'warning', 7000);
        }

    } else if (currentMode === 'geography') {
         // In geography mode, any genre can be selected from the total list
         selectedGenreCols = getRandomElements(gameState.allPossibleGenres, numGenreCols);
         console.log("Selecting genre from all possible genres (Geography mode).", selectedGenreCols.map(g => g.nombre));
         
         if (selectedGenreCols.length < numGenreCols) {
              console.error("Critical Error: Not enough genres available even in total pool for Geography mode.");
              showMessage("Error crítico: No hay suficientes géneros disponibles para seleccionar columnas.", "error", 15000);
              gameState.gameInProgress = false;
              showStartMenu();
              return null;
         }
    } else {
         console.error("Invalid game mode during genre selection:", currentMode);
         showMessage("Error: Modo de juego inválido.", "error", 5000);
         gameState.gameInProgress = false;
         showStartMenu();
         return null;
    }
    
    return selectedGenreCols;
}

function selectRowCategories(selectedGenre) {
    let possibleRowCategories = [];
    
    if (currentMode === 'directors') {
        const selectedGenreName = selectedGenre?.nombre;

        if (!selectedGenreName) {
            console.error("Critical Error: No genre category was successfully selected for row filtering.");
            showMessage("Error crítico: Falló la selección de género para filtrar directores.", "error", 15000);
            gameState.gameInProgress = false;
            showStartMenu();
            return null;
        }

        // Filtrar directores por género y dificultad
        let candidateDirectors = gameState.allPossibleDirectors.filter(directorCat => {
            const matchesDifficulty = (currentDifficulty === 'total' ? true : (directorCat.difficulty === currentDifficulty));
            const hasSelectedGenre = Array.isArray(directorCat.generos) && directorCat.generos.includes(selectedGenreName);
            return matchesDifficulty && hasSelectedGenre;
        });

        // Cambiar esta línea que causa el error:
        possibleRowCategories = candidateDirectors;
        // possibleRowCategories = await filterDirectorsByColumnCompatibility(candidateDirectors);

        // Ensure we have at least 3 directors compatible with the selected genre and difficulty
        if (possibleRowCategories.length < 3) {
             console.warn(`Not enough directors (${possibleRowCategories.length}) found for genre "${selectedGenreName}" in "${currentDifficulty}" pool.`);
             // Fallback to selecting directors based on difficulty only
             console.warn("Falling back to selecting directors based on difficulty only.");
             possibleRowCategories = gameState.allPossibleDirectors.filter(cat =>
                currentDifficulty === 'total' ? true : (cat.difficulty === currentDifficulty)
             );
             
             if (possibleRowCategories.length < 3) {
                 console.error("Critical Error: Still not enough directors in difficulty pool for fallback.");
                 showMessage("Error crítico: No hay suficientes directores disponibles para la dificultad seleccionada.", "error", 15000);
                 gameState.gameInProgress = false;
                 showStartMenu();
                 return null;
             }
        }

    } else if (currentMode === 'geography') {
        // In geography mode, select 3 random countries/regions from the total pool
        possibleRowCategories = [...gameState.allPossibleCountries, ...gameState.allPossibleRegions];
         if (possibleRowCategories.length < 3) {
             console.error(`Not enough geography categories (${possibleRowCategories.length}) in total pool.`);
              showMessage("Error crítico: No hay suficientes países o regiones disponibles para jugar.", "error", 15000);
              gameState.gameInProgress = false;
              showStartMenu();
              return null;
         }
    } else {
         console.error("Invalid game mode during row selection:", currentMode);
         showMessage("Error: Modo de juego inválido.", "error", 5000);
         gameState.gameInProgress = false;
         showStartMenu();
         return null;
    }
    
    return possibleRowCategories;
}

// Función para filtrar directores por compatibilidad con columnas
async function filterDirectorsByColumnCompatibility(directors) {
    const compatibleDirectors = [];
    
    for (const director of directors) {
        const isCompatible = await checkDirectorColumnCompatibility(director);
        if (isCompatible) {
            compatibleDirectors.push(director);
        }
    }
    
    return compatibleDirectors;
}

// Función para verificar si un director es compatible con las categorías de columna
async function checkDirectorColumnCompatibility(director) {
    const columnCategories = gameState.selectedColCategories;
    
    for (const category of columnCategories) {
        const hasMovieForCategory = await checkDirectorHasMovieForCategory(director, category);
        if (!hasMovieForCategory) {
            return false;
        }
    }
    
    return true;
}

// Función para verificar si un director tiene películas que cumplan una categoría específica
async function checkDirectorHasMovieForCategory(director, category) {
    try {
        const movies = await apiService.getDirectorMovies(director.id);
        
        for (const movie of movies) {
            const meetsCategory = await apiService.validarColCriterion(movie, category);
            if (meetsCategory) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error(`Error checking director ${director.nombre} for category ${category.nombre}:`, error);
        return false;
    }
}

// Función mejorada para detectar conflictos de categorías
/*
async function validateCategorySelection(selectedRowCategories, selectedColCategories) {
    const conflicts = [];
    
    for (const director of selectedRowCategories) {
        const directorMovies = await apiService.getDirectorMovies(director.tmdb_id);
        const categoriesFulfilled = [];
        
        // Verificar qué categorías puede cumplir este director
        for (const category of selectedColCategories) {
            const hasMovieForCategory = await checkDirectorHasMovieForCategory(directorMovies, category);
            if (hasMovieForCategory) {
                categoriesFulfilled.push(category.nombre);
            }
        }
        
        // Si el director solo puede cumplir una categoría, verificar si esa película cubre múltiples
        if (categoriesFulfilled.length === 1) {
            const singleCategoryMovies = await getMoviesForCategory(directorMovies, selectedColCategories.find(cat => cat.nombre === categoriesFulfilled[0]));
            
            // Verificar si alguna de estas películas también cumple otras categorías
            for (const movie of singleCategoryMovies) {
                const fullMovieDetails = await apiService.getMovieDetails(movie.id);
                let categoriesThisMovieFulfills = 0;
                
                for (const category of selectedColCategories) {
                    if (apiService.validarColCriterion(fullMovieDetails, category)) {
                        categoriesThisMovieFulfills++;
                    }
                }
                
                if (categoriesThisMovieFulfills > 1) {
                    conflicts.push({
                        director: director.nombre,
                        movie: fullMovieDetails.title,
                        categories: categoriesThisMovieFulfills
                    });
                }
            }
        }
    }
    
    return conflicts;
}
*/

export function endGame(completed = false) {
    gameState.gameInProgress = false;
    
    // Incrementar el contador de juegos jugados aquí
    gameStats.gamesPlayed++;
    
    if (completed) {
        gameStats.gamesCompleted++;
        showMessage(`¡Felicidades! Has completado el juego con una puntuación de ${gameState.currentScore}.`, 'success', 8000);
    } else {
        showMessage('Se acabaron los intentos. ¡Inténtalo de nuevo!', 'error', 5000);
    }
    
    saveStats();
    console.log(completed ? "Game completed!" : "Game ended.");
    
    // Always update best score if there's a score
    if (gameState.currentScore > 0) {
        updateUserBestScore(gameState.currentScore);
    }
    
    // Mostrar el modal de estadísticas al finalizar el juego
    // Pequeño retraso para que el mensaje se muestre primero
    setTimeout(() => {
        showStatsModal();
    }, 1000);
}