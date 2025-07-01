import { gameState, gameStats, setCurrentMode, setCurrentDifficulty, currentDifficulty } from './gameState.js';
import { startNewGame } from './gameLogic.js'; // Eliminamos endGame ya que no lo usaremos directamente
import { saveGameSettings, saveStats } from './storageManager.js';
import { showMessage, showInfoModal, showStatsModal, updateModeVisuals } from './uiHelpers.js';
import { setupStartMenuButtons } from './menuManager.js';
import { showConfirmModal } from './modalManager.js';
import { updateUserBestScore } from './movieValidator.js';

export function setupEventListeners() {
    setupHeaderFunctionality();
    setupStartMenuButtons();
    setupGameControlsListeners(); // Agregar esta línea
}

function setupHeaderFunctionality() {
    const infoIconLink = document.getElementById('info-icon-link');
    const statsIconLink = document.getElementById('stats-icon-link');
    const directorsModeLink = document.getElementById('directors-mode-link');
    const geographyModeLink = document.getElementById('geography-mode-link');
    const difficultySelect = document.getElementById('difficulty-select');
    const letterboxdIconLink = document.querySelector('.letterboxd-icon')?.parentElement;
    const twitterIconLink = document.querySelector('.fa-twitter')?.parentElement;

    // Add event listeners if elements are found
    if (infoIconLink) {
        infoIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            showInfoModal();
        });
    }
    
    if (statsIconLink) {
        statsIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            showStatsModal();
        });
    }

    if (directorsModeLink) {
        directorsModeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!gameState.dataLoaded) {
                showMessage("Cargando datos iniciales, por favor espera...", "info", 3000);
                return;
            }
            if (gameState.gameInProgress) {
                // Reemplazar el confirm por el modal de confirmación
                showConfirmModal('Una partida está en curso. ¿Deseas empezar una nueva partida en Modo Directores?', () => {
                    setCurrentMode('directors');
                    saveGameSettings();
                    updateModeVisuals();
                    startNewGame();
                });
            } else {
                setCurrentMode('directors');
                saveGameSettings();
                updateModeVisuals();
                startNewGame();
            }
        });
    }

    if (geographyModeLink) {
        geographyModeLink.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!gameState.dataLoaded) {
                showMessage("Cargando datos iniciales, por favor espera...", "info", 3000);
                return;
            }
            if (gameState.gameInProgress) {
                // Reemplazar el confirm por el modal de confirmación
                showConfirmModal('Una partida está en curso. ¿Deseas empezar una nueva partida en Modo Geografía?', () => {
                    setCurrentMode('geography');
                    setCurrentDifficulty('total');
                    if (difficultySelect) difficultySelect.value = 'total';
                    saveGameSettings();
                    updateModeVisuals();
                    startNewGame();
                });
            } else {
                setCurrentMode('geography');
                setCurrentDifficulty('total');
                if (difficultySelect) difficultySelect.value = 'total';
                saveGameSettings();
                updateModeVisuals();
                startNewGame();
            }
        });
    }

    if (difficultySelect) {
        difficultySelect.addEventListener('change', async (e) => {
            if (!gameState.dataLoaded) {
                showMessage("Cargando datos iniciales, por favor espera...", "info", 3000);
                e.target.value = currentDifficulty;
                return;
            }
            if (gameState.gameInProgress) {
                // Reemplazar el confirm por el modal de confirmación
                showConfirmModal('Una partida está en curso. ¿Deseas empezar una nueva partida con la nueva dificultad?', () => {
                    setCurrentDifficulty(e.target.value);
                    saveGameSettings();
                    startNewGame();
                });
                // Si el usuario cancela, restaurar el valor anterior
                document.getElementById('confirm-no').addEventListener('click', () => {
                    e.target.value = currentDifficulty;
                }, { once: true });
            } else {
                setCurrentDifficulty(e.target.value);
                saveGameSettings();
                startNewGame();
            }
        });
    }

    // Social media links
    if (letterboxdIconLink) {
        letterboxdIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://letterboxd.com/', '_blank');
        });
    }

    if (twitterIconLink) {
        twitterIconLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://twitter.com/', '_blank');
        });
    }
}

// Agregar esta nueva función al final del archivo
// Modificar la función setupGameControlsListeners
function setupGameControlsListeners() {
    const giveUpButton = document.getElementById('give-up-button');
    
    if (giveUpButton) {
        giveUpButton.addEventListener('click', () => {
            if (gameState.gameInProgress) {
                showConfirmModal('¿Estás seguro de que quieres rendirte? Se terminará la partida actual.', () => {
                    // En lugar de llamar a endGame directamente, actualizamos el estado del juego
                    // y mostramos el modal de estadísticas
                    gameState.gameInProgress = false;

                    // Incrementar el contador de juegos jugados
                    gameStats.gamesPlayed++;
                    
                    // Actualizar mejor puntuación si hay puntuación
                    if (gameState.currentScore > 0) {
                        updateUserBestScore(gameState.currentScore);
                    }
                    
                    // Guardar estadísticas
                    saveStats();
                    
                    // Mostrar mensaje
                    showMessage('Se acabaron los intentos. ¡Inténtalo de nuevo!', 'error', 5000);
                    
                    // Mostrar modal de estadísticas
                    showStatsModal();
                });
            }
        });
    }
}