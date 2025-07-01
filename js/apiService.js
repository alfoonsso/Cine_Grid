const BACKEND_API_BASE_URL = '/mis-proyectos/cine-grid-v3.1/api'; // Ruta correcta para tu estructura de carpetas
const TMDB_API_KEY = '98fd1e135ecfac794b25c1fe1d162ac8';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const TMDB_PERSON_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300_and_h450_bestv2';

// Cache for movie details
const movieDetailsCache = {};

export class ApiService {
    async fetchCategories(type, difficulty = null) {
        let url = `${BACKEND_API_BASE_URL}/get_categories.php?type=${encodeURIComponent(type)}`;
        if (difficulty) {
            url += `&difficulty=${encodeURIComponent(difficulty)}`;
        }
        console.log(`Fetching categories (type: ${type}, difficulty: ${difficulty}) from:`, url);
        const response = await fetch(url);
        if (!response.ok) {
            const error = await response.text();
            console.error(`Error fetching categories (${type}, ${difficulty}):`, error);
            throw new Error(`Could not fetch ${type} categories: ${response.status} - ${error}`);
        }
        const data = await response.json();
        console.log(`Fetched ${data.length} categories of type ${type}.`);
        return data; // Data should already have 'id', 'nombre', 'tipo', 'descripcion', and relevant type-specific fields
    }

    async searchMovies(query) {
        let movieTitle = query;
        let releaseYear = null;

        // Regex to find " (YYYY)" at the end of the query
        const yearMatch = query.match(/\s\((\d{4})\)$/);

        if (yearMatch && yearMatch[1]) {
            releaseYear = yearMatch[1];
            movieTitle = query.replace(yearMatch[0], '').trim();
        }

        let url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(movieTitle)}&language=en-US`; // Search in English
         if (releaseYear) {
            url += `&primary_release_year=${releaseYear}`;
        }

        console.log('Searching TMDB with URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
             const error = await response.text();
             console.error(`Error searching TMDB for "${query}":`, error);
             throw new Error(`TMDB search failed: ${response.status} - ${error}`);
        }
        const data = await response.json();
        console.log('TMDB Search Results:', data);
        return data.results.slice(0, 20); // Return top 20 results
    }

     async getMovieDetails(movieId) {
        if (movieDetailsCache[movieId]) {
            console.log(`Movie details for ID ${movieId} found in cache.`);
            return movieDetailsCache[movieId];
        }

        const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`; // Use en-US for reliable runtime/original_title/genres
        console.log('Fetching TMDB movie details for ID:', movieId, 'from URL:', url);
        const response = await fetch(url);
        if (!response.ok) {
             const error = await response.text();
             console.error(`Error fetching TMDB movie details for ID ${movieId}:`, error);
             throw new Error(`TMDB movie details failed: ${response.status} - ${error}`);
        }
        const data = await response.json();
        console.log('TMDB Movie Details:', data);
        movieDetailsCache[movieId] = data; // Store in cache
        return data;
    }

    async getPersonDetails(personId) {
         const url = `${TMDB_BASE_URL}/person/${personId}?api_key=${TMDB_API_KEY}`;
         console.log('Fetching TMDB person details for ID:', personId);
         const response = await fetch(url);
         if (!response.ok) {
             const error = await response.text();
             console.error(`Error fetching TMDB person details for ID ${personId}:`, error);
             throw new Error(`TMDB person details failed: ${response.status} - ${error}`);
         }
         return response.json();
    }

    async checkMovieDirector(movieId, directorTmdbId) {
        if (!directorTmdbId) {
            console.warn(`Cannot check director for movie ${movieId}: No TMDB ID provided.`);
            return false;
        }
        try {
            const url = `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`;
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Error fetching credits for movie ${movieId}. Status: ${response.status}`);
                return false;
            }
            const data = await response.json();
            console.log(`Checking director ${directorTmdbId} for movie ${movieId}. Crew:`, data.crew);

            return data.crew.some(person =>
                person.job === 'Director' && person.id === directorTmdbId
            );
        } catch (error) {
            console.error(`Error checking director by TMDB ID ${directorTmdbId} for movie ${movieId}:`, error);
            return false;
        }
    }

     async checkMovieOrigin(movieId, allowedIsoCodes) { // Now accepts the ISO codes array directly
        if (!allowedIsoCodes || !Array.isArray(allowedIsoCodes) || allowedIsoCodes.length === 0) {
            console.warn(`Cannot check origin for movie ${movieId}: No allowed ISO codes provided.`);
            return false;
        }
        try {
            // Use the cached details if available, otherwise fetch
            const movieDetails = movieDetailsCache[movieId] || await this.getMovieDetails(movieId);
            if (!movieDetails || !movieDetails.production_countries) {
                 console.warn(`Movie details or production countries not found for movie ID ${movieId}.`);
                return false;
            }

            console.log(`Checking origin for movie ${movieId}. Allowed codes: ${allowedIsoCodes.join(', ')}. Production countries:`, movieDetails.production_countries);

            // Check if any production country ISO code is in the allowed list
            return movieDetails.production_countries.some(country =>
                 country.iso_3166_1 && allowedIsoCodes.includes(country.iso_3166_1)
             );

        } catch (error) {
            console.error(`Error checking movie origin for movie ${movieId} with codes ${allowedIsoCodes}:`, error);
            return false;
        }
    }

     // Validates if a movie meets a COLUMN category criterion
    validarColCriterion(pelicula, categoriaColObj) { // Accepts the column category object
        const tituloOriginal = pelicula.title || pelicula.original_title;

        if (!tituloOriginal) {
             console.warn("Validating movie with no title:", pelicula);
             return false;
        }

        // Use the 'tipo' field from the fetched category object
        if (categoriaColObj.tipo === 'genero') {
             const movieGenres = pelicula.genres?.map(g => g.name.toLowerCase()) || [];
             // We assume genre names in the DB are ENGLISH to match TMDB
             const requiredGenreEnglish = categoriaColObj.nombre.toLowerCase();
             console.log(`Checking genre: "${requiredGenreEnglish}" vs movie genres:`, movieGenres);
             return movieGenres.includes(requiredGenreEnglish);
        }

        // --- Title/Runtime Criteria Validation (for tipo === 'criterio') ---
        const categoriaNombre = categoriaColObj.nombre; // Get the criterion name string

        let articuloRegex;
        switch (categoriaNombre.trim()) {
            case "Título empieza con A-H (ignorar 'The')":
                articuloRegex = /^(the)\s+/i;
                break;
            case "Título empieza con I-P (ignorar 'The','A','An')":
                articuloRegex = /^(the|a|an)\s+/i;
                break;
            case "Título empieza con Q-Z (ignorar 'A','An')":
                articuloRegex = /^(a|an)\s+/i;
                break;
            case "Título de una palabra (ignorar artículos)":
                 articuloRegex = /^(the|a|an)\s+/i; // Also ignore articles for single word count
                 break;
            default:
                articuloRegex = null; // No specific article removal by default
        }

        const titleForLengthCheck = tituloOriginal.trim().replace(/, The$/, '').replace(/, A$/, '').replace(/, An$/, ''); // Handle common TMDB format "Title, The" for word count
        const titleForLetterCheck = articuloRegex ? tituloOriginal.replace(articuloRegex, "").trim() : tituloOriginal.trim();

        // Modificar esta línea para usar titleForLetterCheck en lugar de titleForLengthCheck para el criterio de una palabra
        const wordsForLength = categoriaNombre.trim() === "Título de una palabra (ignorar artículos)" ? 
            titleForLetterCheck.split(/\s+/).filter(word => word.length > 0) : 
            titleForLengthCheck.split(/\s+/).filter(word => word.length > 0);
         const wordsForLetter = titleForLetterCheck.split(/\s+/).filter(word => word.length > 0);


        let firstCharToEvaluate = '';
         if (wordsForLetter.length > 0) {
             const firstWordAfterArticle = wordsForLetter[0];
             const startsWithDigit = /^\d/.test(firstWordAfterArticle);

             if (startsWithDigit && wordsForLetter.length >= 2) {
                  // If starts with digit, check the first char of the *next* word IF it exists
                 firstCharToEvaluate = wordsForLetter[1].charAt(0).toUpperCase();
             } else if (!startsWithDigit) {
                 // If it doesn't start with a digit, evaluate the first char of the first word
                 firstCharToEvaluate = firstWordAfterArticle.charAt(0).toUpperCase();
             } else {
                  // Starts with digit but no other words or only one word -> can't evaluate first letter alphabetically
                  return false; // Or handle as needed, current criteria imply a letter check
             }
         } else {
             return false; // Title is empty or only articles?
         }


        console.log(`Validating criterion "${categoriaNombre}" for "${tituloOriginal}"`);

        switch (categoriaNombre.trim()) {
            case "Título de una palabra (ignorar artículos)":
                if (wordsForLength.length !== 1) { console.log("Validation Failed: Not a single word after ignoring articles."); return false; }
                break;
            case "Título con 2 palabras":
                if (wordsForLength.length !== 2) { console.log("Validation Failed: Not exactly 2 words."); return false; }
                break;
            case "Título con 3 o más palabras":
                if (wordsForLength.length < 3) { console.log("Validation Failed: Less than 3 words."); return false; }
                break;
            case "Empieza por vocal (ignorar 'The')":
                if (!/^[AEIOUÁÉÍÓÚÜ]/.test(firstCharToEvaluate)) { console.log("Validation Failed: Doesn't start with a vowel."); return false; }
                break;
            case "Título empieza con A-H (ignorar 'The')":
                if (!/^[A-H]/.test(firstCharToEvaluate)) { console.log("Validation Failed: Doesn't start with A-H."); return false; }
                break;
            case "Título empieza con I-P (ignorar 'The','A','An')":
                if (!/^[I-P]/.test(firstCharToEvaluate)) { console.log("Validation Failed: Doesn't start with I-P."); return false; }
                break;
            case "Título empieza con Q-Z (ignorar 'A','An')":
                 if (!/^[Q-Z]/.test(firstCharToEvaluate)) { console.log("Validation Failed: Doesn't start with Q-Z."); return false; }
                 break;
            case "Título contiene J,K,W,Z,X,Q":
                if (!/[jkwzxq]/i.test(tituloOriginal)) { console.log("Validation Failed: Doesn't contain J,K,W,Z,X,Q."); return false; }
                break;
            case "Título con doble letra ('rr', 'll'...)":
                if (!/([a-z])\1/i.test(tituloOriginal)) { console.log("Validation Failed: Doesn't contain double letters."); return false; }
                break;
            case "Título de menos de 2h de duración":
                // Need runtime from full movie details - pelicula object should have it
                if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0 || pelicula.runtime >= 120) { console.log(`Validation Failed: Runtime ${pelicula.runtime} >= 120.`); return false; }
                break;
            case "Título de 2h o más de duración":
                 // Need runtime from full movie details - pelicula object should have it
                if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0 || pelicula.runtime < 120) { console.log(`Validation Failed: Runtime ${pelicula.runtime} < 120.`); return false; }
                break;
        }

        console.log(`Validation Passed for criterion "${categoriaNombre}".`);
        return true; // If all checks for the specific criterion passed
    }

    // Método para obtener películas de un director - MOVER DENTRO DE LA CLASE
    // Note: Removed validarTitulo, now use validarColCriterion
    
    /*
    async getDirectorMovies(directorTmdbId) {
        try {
            const url = `${TMDB_BASE_URL}/person/${directorTmdbId}/movie_credits?api_key=${TMDB_API_KEY}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`Error fetching director movies for ID ${directorTmdbId}`);
                return [];
            }
            
            const data = await response.json();
            // Filtrar solo las películas donde la persona fue director
            return data.crew?.filter(credit => credit.job === 'Director') || [];
        } catch (error) {
            console.error(`Error getting movies for director ${directorTmdbId}:`, error);
            return [];
        }
    }
    */
}

// Exportar solo la instancia
export const apiService = new ApiService();