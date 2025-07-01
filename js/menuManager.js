import { gameState, setCurrentMode, setCurrentDifficulty, resetGameState } from './gameState.js';
import { startNewGame } from './gameLogic.js';
import { saveGameSettings } from './storageManager.js';
import { showMessage, updateModeVisuals } from './uiHelpers.js';

export function showStartMenu() {
    console.log("Showing start menu.");
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('start-menu').classList.remove('hidden');
    // Reset game state when returning to menu
    resetGameState();
}

export function setupStartMenuButtons() {
    const startDirectorsBtn = document.getElementById('start-directors-btn');
    const startGeographyBtn = document.getElementById('start-geography-btn');
    const startMenu = document.getElementById('start-menu');
    const gameContainer = document.getElementById('game-container');

    if (startDirectorsBtn) {
        // Remove existing listeners to prevent duplicates
        const directorsBtnClone = startDirectorsBtn.cloneNode(true);
        startDirectorsBtn.parentNode.replaceChild(directorsBtnClone, startDirectorsBtn);
        const newDirectorsBtn = directorsBtnClone;

        newDirectorsBtn.addEventListener('click', () => {
            if (!gameState.dataLoaded) {
                showMessage("Cargando datos iniciales, por favor espera...", "info", 3000);
                return;
            }
            setCurrentMode('directors');
            setCurrentDifficulty('total');
            if (document.getElementById('difficulty-select')) {
                document.getElementById('difficulty-select').value = 'total';
            }
            saveGameSettings();
            updateModeVisuals();

            // Hide menu, show game, start game
            startMenu.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            startNewGame();
        });
    }

    if (startGeographyBtn) {
        // Remove existing listeners
        const geographyBtnClone = startGeographyBtn.cloneNode(true);
        startGeographyBtn.parentNode.replaceChild(geographyBtnClone, startGeographyBtn);
        const newGeographyBtn = geographyBtnClone;

        newGeographyBtn.addEventListener('click', () => {
            if (!gameState.dataLoaded) {
                showMessage("Cargando datos iniciales, por favor espera...", "info", 3000);
                return;
            }
            setCurrentMode('geography');
            setCurrentDifficulty('total');
            if (document.getElementById('difficulty-select')) {
                document.getElementById('difficulty-select').value = 'total';
            }
            saveGameSettings();
            updateModeVisuals();

            // Hide menu, show game, start game
            startMenu.classList.add('hidden');
            gameContainer.classList.remove('hidden');
            startNewGame();
        });
    }
}

export function disableStartMenuButtons() {
    const startDirectorsBtn = document.getElementById('start-directors-btn');
    const startGeographyBtn = document.getElementById('start-geography-btn');
    
    if (startDirectorsBtn) {
        startDirectorsBtn.disabled = true;
        startDirectorsBtn.style.opacity = 0.5;
        startDirectorsBtn.style.cursor = 'not-allowed';
    }
    
    if (startGeographyBtn) {
        startGeographyBtn.disabled = true;
        startGeographyBtn.style.opacity = 0.5;
        startGeographyBtn.style.cursor = 'not-allowed';
    }
}

// Agregar esta función al final del archivo

export function setupLogoClickHandler() {
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', () => {
            showStartMenu();
        });
    }
}