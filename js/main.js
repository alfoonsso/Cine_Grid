import { fetchInitialGameData } from './dataManager.js';
import { loadStats, loadGameSettings } from './storageManager.js';
import { setupSearchFunctionality } from './searchManager.js';
import { setupEventListeners } from './eventHandlers.js';
import { setupModalListeners } from './modalManager.js';
import { showStartMenu, setupLogoClickHandler } from './menuManager.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Initializing Cine Grid...');
    
    // Setup all event listeners
    setupModalListeners();
    setupEventListeners();
    setupSearchFunctionality();
    setupLogoClickHandler(); // Agregar esta línea
    
    // Load saved data
    loadGameSettings();
    loadStats();
    
    // Show start menu
    showStartMenu();
    
    // Load game data in background
    const dataLoaded = await fetchInitialGameData();
    
    if (!dataLoaded) {
        console.error('Failed to load initial game data');
        // Handle error state
    }
    
    console.log('Cine Grid initialized successfully');
});
