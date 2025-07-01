import { gameStats, currentMode, currentDifficulty, setCurrentMode, setCurrentDifficulty } from './gameState.js';
import { showMessage } from './uiHelpers.js';

export function loadStats() {
    try {
        const savedStats = localStorage.getItem('cineGridStats');
        if (savedStats) {
            const parsedStats = JSON.parse(savedStats);
            if (typeof parsedStats.gamesPlayed === 'number' && 
                typeof parsedStats.gamesCompleted === 'number' && 
                typeof parsedStats.userBestScores === 'object' && 
                parsedStats.userBestScores !== null) {
                
                gameStats.gamesPlayed = parsedStats.gamesPlayed;
                gameStats.gamesCompleted = parsedStats.gamesCompleted;
                gameStats.userBestScores = parsedStats.userBestScores;
                console.log("Loaded stats:", gameStats);
            } else {
                console.warn("Loaded stats format incorrect, resetting.");
                resetStats();
            }
        } else {
            console.log("No saved stats found, initializing.");
            resetStats();
        }
    } catch (e) {
        console.error("Error parsing saved stats:", e);
        showMessage("Error al cargar estadísticas guardadas.", "warning");
        resetStats();
    }
}

export function saveStats() {
    try {
        localStorage.setItem('cineGridStats', JSON.stringify(gameStats));
        console.log("Stats saved:", gameStats);
    } catch (e) {
        console.error("Error saving stats:", e);
        showMessage("Error al guardar estadísticas.", "warning");
    }
}

export function loadGameSettings() {
    try {
        const savedMode = localStorage.getItem('cineGridMode');
        const savedDifficulty = localStorage.getItem('cineGridDifficulty');

        if (savedMode && (savedMode === 'directors' || savedMode === 'geography')) {
            setCurrentMode(savedMode);
        } else {
            setCurrentMode('directors');
        }

        if (savedDifficulty && ['easy', 'medium', 'hard', 'total'].includes(savedDifficulty)) {
            setCurrentDifficulty(savedDifficulty);
        } else {
            setCurrentDifficulty('total');
        }

        console.log(`Loaded settings: Mode = ${currentMode}, Difficulty = ${currentDifficulty}`);
        updateDifficultySelect();
        
    } catch (e) {
        console.error("Error loading settings:", e);
        showMessage("Error al cargar configuración.", "warning");
        setCurrentMode('directors');
        setCurrentDifficulty('total');
    }
}

export function saveGameSettings() {
    try {
        localStorage.setItem('cineGridMode', currentMode);
        localStorage.setItem('cineGridDifficulty', currentDifficulty);
        console.log(`Settings saved: Mode = ${currentMode}, Difficulty = ${currentDifficulty}`);
    } catch (e) {
        console.error("Error saving settings:", e);
        showMessage("Error al guardar configuración.", "warning");
    }
}

export function resetStats() {
    gameStats.gamesPlayed = 0;
    gameStats.gamesCompleted = 0;
    gameStats.userBestScores = {};
    saveStats();
    showMessage('Estadísticas reiniciadas.', 'info');
    console.log("Stats reset.");
}

function updateDifficultySelect() {
    const difficultySelect = document.getElementById('difficulty-select');
    if (difficultySelect) {
        const optionExists = Array.from(difficultySelect.options).some(opt => opt.value === currentDifficulty);
        if (optionExists) {
            difficultySelect.value = currentDifficulty;
        } else {
            console.warn(`Difficulty "${currentDifficulty}" not available, defaulting to 'total'.`);
            setCurrentDifficulty('total');
            difficultySelect.value = 'total';
        }
    }
}