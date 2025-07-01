// Manejo centralizado del estado del juego
export const gameState = {
    gameInProgress: false,
    selectedCell: null,
    filledCells: {},
    selectedRowCategories: [],
    selectedColCategories: [],
    currentScore: 0,
    remainingAttempts: 3,  // Cambiar de 9 a 3
    currentMode: 'directors',
    currentDifficulty: 'total'
};

export const gameStats = {
    gamesPlayed: 0,
    gamesCompleted: 0,
    userBestScores: {}
};

// Mantener las variables exportadas para compatibilidad
export let currentMode = 'directors';
export let currentDifficulty = 'total';

export function setCurrentMode(mode) {
    currentMode = mode;
    gameState.currentMode = mode;
}

export function setCurrentDifficulty(difficulty) {
    currentDifficulty = difficulty;
    gameState.currentDifficulty = difficulty;
}

export function resetGameState() {
    gameState.gameInProgress = false;
    gameState.selectedCell = null;
    gameState.filledCells = {};
    gameState.selectedRowCategories = [];
    gameState.selectedColCategories = [];
    gameState.currentScore = 0;
    gameState.remainingAttempts = 3;  // Cambiar de 9 a 3
    console.log("Game state reset.");
}