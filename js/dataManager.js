import { apiService } from './apiService.js';
import { gameState } from './gameState.js';
import { showMessage } from './uiHelpers.js';

export async function fetchInitialGameData() {
    console.log("Starting initial data fetch...");
    try {
        gameState.allPossibleDirectors = await apiService.fetchCategories('director', 'total');
        gameState.allPossibleCountries = await apiService.fetchCategories('pais', 'total');
        gameState.allPossibleRegions = await apiService.fetchCategories('region', 'total');
        gameState.allPossibleCriteria = await apiService.fetchCategories('criterio');
        gameState.allPossibleGenres = await apiService.fetchCategories('genero');

        console.log(`Initial fetch successful: ${gameState.allPossibleDirectors.length} directors, ${gameState.allPossibleCountries.length} countries, ${gameState.allPossibleRegions.length} regions, ${gameState.allPossibleCriteria.length} criteria, ${gameState.allPossibleGenres.length} genres.`);

        if (!validateDataIntegrity()) {
            return false;
        }

        gameState.dataLoaded = true;
        console.log("Initial data fetch completed successfully.");
        return true;

    } catch (error) {
        console.error("Failed during initial data fetch:", error);
        showMessage("Error al cargar datos iniciales del juego.", "error", 15000);
        gameState.dataLoaded = false;
        return false;
    }
}

function validateDataIntegrity() {
    if (gameState.allPossibleDirectors.length < 3 || 
        (gameState.allPossibleCountries.length + gameState.allPossibleRegions.length) < 3 || 
        gameState.allPossibleCriteria.length < 2 || 
        gameState.allPossibleGenres.length < 1) {
        
        const missingData = [];
        if (gameState.allPossibleDirectors.length < 3) missingData.push('directores');
        if ((gameState.allPossibleCountries.length + gameState.allPossibleRegions.length) < 3) missingData.push('ubicaciones geográficas');
        if (gameState.allPossibleCriteria.length < 2) missingData.push('criterios de columna');
        if (gameState.allPossibleGenres.length < 1) missingData.push('géneros');
        
        const errorMessage = "Datos incompletos en la base de datos. Faltan: " + missingData.join(', ') + ". No se pueden iniciar partidas.";
        console.error(errorMessage);
        showMessage(errorMessage, "error", 20000);
        return false;
    }
    return true;
}

export function getRandomElements(array, count) {
    if (!Array.isArray(array) || array.length === 0 || count <= 0) {
        console.warn("getRandomElements called with invalid array or count.", array, count);
        return [];
    }
    
    const actualCount = Math.min(count, array.length);
    if (actualCount === 0) return [];

    const shuffled = [...array].sort(() => 0.5 - Math.random());
    const selected = [];
    const selectedIds = new Set();
    
    for (let i = 0; i < shuffled.length && selected.length < actualCount; i++) {
        const item = shuffled[i];
        if (item && typeof item === 'object' && item !== null && 
            typeof item.id !== 'undefined' && !selectedIds.has(item.id)) {
            selected.push(item);
            selectedIds.add(item.id);
        }
    }

    return selected;
}