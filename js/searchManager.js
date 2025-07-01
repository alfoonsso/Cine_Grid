import { apiService } from './apiService.js';
import { gameState } from './gameState.js';
import { showMessage, debounce } from './uiHelpers.js';
import { tryPlaceMovie } from './movieValidator.js';

export function setupSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchButton || !searchResults) {
        console.error("Search elements not found.");
        return;
    }

    searchResults.classList.add('search-results-dropdown');

    searchInput.addEventListener('input', debounce(async (e) => {
        await handleSearch(e.target.value.trim());
    }, 500));

    searchButton.addEventListener('click', async () => {
        await handleSearch(searchInput.value.trim());
    });

    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.search-result');
        if (resultItem && gameState.selectedCell && gameState.gameInProgress) {
            const movieData = JSON.parse(resultItem.dataset.movie);
            tryPlaceMovie(movieData);
        }
    });

    setupSearchEventListeners();
}

async function handleSearch(query) {
    const searchResults = document.getElementById('search-results');
    
    if (query.length < 3 || !gameState.selectedCell || !gameState.gameInProgress) {
        hideSearchResults();
        return;
    }

    try {
        const results = await apiService.searchMovies(query);
        await displaySearchResults(results);
    } catch (error) {
        console.error('Error searching movies:', error);
        showMessage('Error al buscar películas.', 'error');
        hideSearchResults();
    }
}

async function displaySearchResults(movies) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;

    searchResults.innerHTML = '';

    if (!Array.isArray(movies) || movies.length === 0) {
        searchResults.innerHTML = '<div class="search-result">No se encontraron resultados</div>';
        showSearchResults();
        return;
    }

    const moviesWithDetails = await Promise.all(movies.map(async (movie) => {
        try {
            const details = await apiService.getMovieDetails(movie.id);
            const title = details?.title || movie.title || details?.original_title;
            const year = details?.release_date ? new Date(details.release_date).getFullYear() : 
                        (movie.release_date ? movie.release_date.substring(0, 4) : 'N/A');

            return {
                ...movie,
                title: title,
                year: year,
                runtime: details?.runtime,
                genres: details?.genres,
                production_countries: details?.production_countries,
                original_title: details?.original_title,
                popularity: details?.popularity
            };
        } catch (error) {
            console.error('Error fetching details for movie ID:', movie.id, error);
            const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
            return { ...movie, year: year, runtime: null, genres: [], production_countries: [], popularity: 0 };
        }
    }));

    moviesWithDetails.forEach((movie) => {
        if (movie.title) {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result');
            resultItem.dataset.movie = JSON.stringify(movie);
            resultItem.innerHTML = `<div>${movie.title} (${movie.year})</div>`;
            searchResults.appendChild(resultItem);
        }
    });

    if (searchResults.children.length > 0) {
        showSearchResults();
    } else {
        searchResults.innerHTML = '<div class="search-result">No se encontraron resultados válidos</div>';
        showSearchResults();
    }
}

function showSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.remove('hidden');
        searchResults.classList.add('show');
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.classList.add('hidden');
        searchResults.classList.remove('show');
    }
}

function setupSearchEventListeners() {
    // Hide search results when clicking outside
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const searchResults = document.getElementById('search-results');
        
        if (searchContainer && !searchContainer.contains(e.target) && 
            searchResults && searchResults.classList.contains('show')) {
            searchResults.classList.remove('show');
            setTimeout(() => { searchResults.classList.add('hidden'); }, 200);
        }
    });

    // Hide search results on Escape key
    document.addEventListener('keydown', (e) => {
        const searchResults = document.getElementById('search-results');
        if (e.key === 'Escape' && searchResults && searchResults.classList.contains('show')) {
            searchResults.classList.remove('show');
            setTimeout(() => { searchResults.classList.add('hidden'); }, 200);
        }
    });
}