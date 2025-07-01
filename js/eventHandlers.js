import { gameState, setCurrentMode, setCurrentDifficulty, currentDifficulty } from './gameState.js';
import { startNewGame, endGame } from './gameLogic.js'; // Agregar endGame aquí
import { saveGameSettings } from './storageManager.js';
import { showMessage, showInfoModal, showStatsModal, updateModeVisuals } from './uiHelpers.js';
import { setupStartMenuButtons } from './menuManager.js';

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
                if (!confirm('Una partida está en curso. ¿Deseas empezar una nueva partida en Modo Directores?')) {
                    return;
                }
            }
            setCurrentMode('directors');
            saveGameSettings();
            updateModeVisuals();
            startNewGame();
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
                if (!confirm('Una partida está en curso. ¿Deseas empezar una nueva partida en Modo Geografía?')) {
                    return;
                }
            }
            setCurrentMode('geography');
            setCurrentDifficulty('total');
            if (difficultySelect) difficultySelect.value = 'total';
            saveGameSettings();
            updateModeVisuals();
            startNewGame();
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
                if (!confirm('Una partida está en curso. ¿Deseas empezar una nueva partida con la nueva dificultad?')) {
                    e.target.value = currentDifficulty;
                    return;
                }
            }
            setCurrentDifficulty(e.target.value);
            saveGameSettings();
            startNewGame();
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

// Remove this empty function:
// function setupStartMenuButtons() {
//     // This function will be imported from menuManager.js
//     // We're just calling it here to maintain the setup flow
// }

// Agregar esta nueva función al final del archivo
function setupGameControlsListeners() {
    const giveUpButton = document.getElementById('give-up-button');
    
    if (giveUpButton) {
        giveUpButton.addEventListener('click', () => {
            if (gameState.gameInProgress) {
                if (confirm('¿Estás seguro de que quieres rendirte? Se terminará la partida actual.')) {
                    endGame(false); // Terminar el juego como perdido
                }
            }
        });
    }
}