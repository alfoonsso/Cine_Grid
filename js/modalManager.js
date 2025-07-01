import { resetStats } from './storageManager.js';
import { startNewGame } from './gameLogic.js';
import { showStatsModal } from './uiHelpers.js';

export function setupModalListeners() {
    document.querySelectorAll('.modal .close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            if(modal) closeModal(modal.id);
       });
   });

   document.querySelectorAll('.modal').forEach(modal => {
       modal.addEventListener('click', (event) => {
            const modalContent = modal.querySelector('.modal-content');
            if (event.target === modal || (modalContent && !modalContent.contains(event.target))) {
                closeModal(modal.id);
            }
       });
   });
   
   // Add listeners for stats modal buttons
   const restartGameBtn = document.getElementById('restart-game');
   const resetStatsBtn = document.getElementById('reset-stats');
   
   if (restartGameBtn) {
       restartGameBtn.addEventListener('click', () => {
           if (confirm('¿Estás seguro de que quieres reiniciar la partida actual?')) {
               closeModal('stats-modal');
               startNewGame();
           }
       });
   }
   
   if (resetStatsBtn) {
       resetStatsBtn.addEventListener('click', () => {
           if (confirm('¿Estás seguro de que quieres reiniciar todas las estadísticas y puntuaciones? Esta acción no se puede deshacer.')) {
               resetStats();
               // Update modal with new stats
               showStatsModal();
           }
       });
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

export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
        modal.classList.add('visible');
    } else {
        console.error(`Modal element with ID "${modalId}" not found!`);
    }
}