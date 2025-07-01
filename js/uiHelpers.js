import { gameState, gameStats, currentMode, currentDifficulty } from './gameState.js';
import { loadStats } from './storageManager.js';

export function showMessage(message, type = 'info', duration = 3000) {
    const notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        console.warn("Notification container not found.");
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('notification-message', type);
    messageElement.textContent = message;

    notificationContainer.innerHTML = '';
    notificationContainer.appendChild(messageElement);
    notificationContainer.style.display = 'flex';

    setTimeout(() => {
        notificationContainer.classList.add('show');
    }, 10);

    setTimeout(() => {
        notificationContainer.classList.remove('show');
        setTimeout(() => {
            notificationContainer.style.display = 'none';
            notificationContainer.innerHTML = '';
        }, 500);
    }, duration);
}

export function updateAttemptsCounter() {
    const attemptsElement = document.querySelector('#attempts-display span');
    if (attemptsElement) {
        attemptsElement.textContent = gameState.remainingAttempts;
    }
    
    // Cambiar color según los intentos restantes
    const attemptsDisplay = document.getElementById('attempts-display');
    if (attemptsDisplay) {
        attemptsDisplay.className = '';
        if (gameState.remainingAttempts <= 1) {
            attemptsDisplay.classList.add('critical');
        } else if (gameState.remainingAttempts <= 2) {
            attemptsDisplay.classList.add('warning');
        }
    }
}

export function updateScoreDisplay() {
    const scoreElement = document.getElementById('current-score-display');
    if (scoreElement) {
        const scoreSpan = scoreElement.querySelector('span');
        if (scoreSpan) {
            scoreSpan.textContent = gameState.currentScore;
        }
    }
}

export function updateMaxScoreDisplay() {
    const maxScoreElement = document.getElementById('user-max-score-display');
    if (maxScoreElement) {
        const maxScoreSpan = maxScoreElement.querySelector('span');
        if (maxScoreSpan) {
            const key = `${gameState.currentMode}_${gameState.currentDifficulty}`;
            const maxScore = gameStats.userBestScores[key] || 0;
            maxScoreSpan.textContent = maxScore;
        }
    }
}

export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        modal.classList.add('visible');
    } else {
        console.error(`Modal element with ID "${modalId}" not found!`);
        showMessage("Error interno: No se encontró el modal.", "error");
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('visible');
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

export function updateModeVisuals() {
    const geographyModeLink = document.getElementById('geography-mode-link');
    const directorsModeLink = document.getElementById('directors-mode-link');
    // Get parent to control visibility, use optional chaining
    const difficultySelectorParent = document.querySelector('.difficulty-selector')?.parentElement;

    // Toggle 'active-mode' class on mode links
    if (geographyModeLink) {
        if (currentMode === 'geography') {
            geographyModeLink.classList.add('active-mode');
        } else {
            geographyModeLink.classList.remove('active-mode');
        }
    }
    if (directorsModeLink) {
        if (currentMode === 'directors') {
            directorsModeLink.classList.add('active-mode');
        } else {
            directorsModeLink.classList.remove('active-mode');
        }
    }

    // Siempre mostrar el selector de dificultad, independientemente del modo
    if (difficultySelectorParent) { // Safety check
        difficultySelectorParent.style.display = ''; // Siempre visible
    }
}

export function showStatsModal() {
    const statsModal = document.getElementById('stats-modal');
    if (!statsModal) {
         console.error("Stats modal element #stats-modal not found!");
         return;
    }

    // Recalculate stats based on current game state (in case modal is opened mid-game)
    const totalCells = gameState.selectedRowCategories.length * gameState.selectedColCategories.length;
    const filledCells = Object.keys(gameState.filledCells).length;
    const progress = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0; // Handle potential division by zero

    // Ensure global stats are loaded/updated before displaying
    loadStats(); // This re-reads from localStorage

    const tasaExito = gameStats.gamesPlayed > 0 ? Math.round((gameStats.gamesCompleted / gameStats.gamesPlayed) * 100) : 0;

     // Update modal content elements - safety check before accessing textContent/style
     const currentFilledEl = statsModal.querySelector('#stats-current-filled');
     const currentProgressEl = statsModal.querySelector('#stats-current-progress');
     const currentAttemptsEl = statsModal.querySelector('#stats-current-attempts');
     const currentScoreEl = statsModal.querySelector('#stats-current-score'); // Added current score element
     const progressBarEl = statsModal.querySelector('#stats-progress-bar .progress');
     const globalPlayedEl = statsModal.querySelector('#stats-global-played');
     const globalCompletedEl = statsModal.querySelector('#stats-global-completed');
     const globalSuccessEl = statsModal.querySelector('#stats-global-success-rate');
     const userBestScoreEl = statsModal.querySelector('#stats-user-best-score'); // Added user best score element


     if(currentFilledEl) currentFilledEl.textContent = `${filledCells}/${totalCells}`;
     if(currentProgressEl) currentProgressEl.textContent = `${progress}%`;
     if(currentAttemptsEl) currentAttemptsEl.textContent = gameState.remainingAttempts;
     if(currentScoreEl) currentScoreEl.textContent = gameState.currentScore; // Display current game score
     if(progressBarEl) progressBarEl.style.width = `${progress}%`;

     if(globalPlayedEl) globalPlayedEl.textContent = gameStats.gamesPlayed;
     if(globalCompletedEl) globalCompletedEl.textContent = gameStats.gamesCompleted;
     if(globalSuccessEl) globalSuccessEl.textContent = `${tasaExito}%`;

     // Display user's best score for the current mode/difficulty
     if (userBestScoreEl) {
         const key = `${currentMode}_${currentDifficulty}`; // Cambiar guión por guión bajo
         const userBest = gameStats.userBestScores[key] || 0;
         userBestScoreEl.textContent = userBest;
          // Update the label to be specific
          const bestScoreLabel = userBestScoreEl.parentElement?.querySelector('.stat-label');
          if(bestScoreLabel) {
               bestScoreLabel.textContent = `Mejor puntuación (${currentMode === 'directors' ? (currentDifficulty === 'total' ? 'Total' : currentDifficulty) : 'Geografía'})`; // Update label text
          }
     }

    openModal('stats-modal'); // Show the modal
}

export function showInfoModal() {
     openModal('info-modal'); // Use pre-existing modal in HTML
}