const categoriasColumnas = [
    "Título de una palabra (ignorar artículos)",
    "Título con 3 o más palabras",
    "Empieza por vocal (ignorar 'The')",
    "Título empieza con A-H (ignorar 'The')",
    "Título empieza con I-P (ignorar 'The','A','An')",
    "Título empieza con Q-Z (ignorar 'A','An')",
    "Título contiene J,K,W,Z,X,Q",
    "Título con 2 palabras",
    "Título con doble letra ('rr', 'll'...)",
    "Título de menos de 2h de duración",
    "Título de 2h o más de duración"
];

function validarTitulo(pelicula, categoria, nombreDirector) {
    const tituloOriginal = pelicula.title || pelicula.original_title;

    const lowerCaseCategory = categoria.toLowerCase();
    const movieGenres = pelicula.genres?.map(g => g.name.toLowerCase()) || [];

    // ¿Es categoría de género?
    const esGenero = Object.values(infoDirectores).some(d =>
        d.generos.map(g => g.toLowerCase()).includes(lowerCaseCategory)
    );

    if (esGenero) {
        if (nombreDirector && infoDirectores[nombreDirector]) {
            // Modo directores: validación por géneros del director
            return infoDirectores[nombreDirector].generos.some(
                g => g.toLowerCase() === lowerCaseCategory
            );
        } else {
            // Modo geografía: validación por géneros de la película
            const traduccion = generoTraduccion[lowerCaseCategory];
            if (!traduccion) return false;
            return movieGenres.includes(traduccion);
        }
    }

    let articuloRegex;
    switch (categoria.trim()) {
        case "Título empieza con A-H (ignorar 'The')":
            articuloRegex = /^(the)\s+/i;
            break;
        case "Título empieza con I-P (ignorar 'The','A','An')":
            articuloRegex = /^(the|a|an)\s+/i;
            break;
        case "Título empieza con Q-Z (ignorar 'A','An')":
            articuloRegex = /^(a|an)\s+/i;
            break;
        default:
            articuloRegex = /^(the|a|an)\s+/i;
    }

    const tituloSinArticulos = tituloOriginal.replace(articuloRegex, "");
    const words = tituloSinArticulos.split(/\s+/).filter(word => word.length > 0);
    let firstCharToEvaluate = '';

    const startsWithDigit = /^\d/.test(tituloSinArticulos);
    if (startsWithDigit && words.length >= 2) {
        firstCharToEvaluate = words[1].charAt(0).toUpperCase();
    } else if (words.length > 0) {
        firstCharToEvaluate = words[0].charAt(0).toUpperCase();
    } else {
        return false;
    }

    switch (categoria.trim()) {
        case "Título de una palabra (ignorar artículos)":
            if (tituloSinArticulos.split(/\s+/).length !== 1) return false;
            break;
        case "Título con 3 o más palabras":
            if (tituloOriginal.split(/\s+/).length < 3) return false;
            break;
        case "Empieza por vocal (ignorar 'The')":
            if (!/^[AEIOUÁÉÍÓÚÜ]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con A-H (ignorar 'The')":
            if (!/^[A-H]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con I-P (ignorar 'The','A','An')":
            if (!/^[I-P]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con Q-Z (ignorar 'A','An')":
            if (!/^[Q-Z]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título contiene J,K,W,Z,X,Q":
            if (!/[jkwzxq]/i.test(tituloOriginal)) return false;
            break;
        case "Título con 2 palabras":
            if (tituloOriginal.split(/\s+/).length !== 2) return false;
            break;
        case "Título con doble letra ('rr', 'll'...)":
            if (!/([a-z])\1/i.test(tituloOriginal)) return false;
            break;
        case "Título de menos de 2h de duración":
            if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0 || pelicula.runtime >= 120) return false;
            break;
        case "Título de 2h o más de duración":
            if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0 || pelicula.runtime < 120) return false;
            break;
    }

    return true;
}

const CURRENT_YEAR = new Date().getFullYear();

const infoDirectores = {
"Steven Spielberg": {activo: [1971, CURRENT_YEAR], generos: ["Guerra","Aventura", "Drama", "Histórico", "Sci-fi","Acción"]},
"Martin Scorsese": {activo: [1967, CURRENT_YEAR], generos: ["Drama","Documental","Crimen","Thriller"]},
"Louis Feuillade": {activo: [1906, 1924], generos: ["Drama","Aventura","Crimen","Thriller"]},
"Christopher Nolan": {activo: [1998, CURRENT_YEAR], generos: ["Sci-fi", "Drama", "Acción", "Thriller","Crimen"]},
"Quentin Tarantino": {activo: [1992, CURRENT_YEAR], generos: ["Crimen", "Drama", "Thriller","Acción"]},
"Alfred Hitchcock": {activo: [1925, 1980], generos: ["Romance","Thriller", "Terror","Crimen","Misterio"]},
"Stanley Kubrick": {activo: [1953, 1999], generos: ["Sci-fi","Drama", "Guerra", "Thriller"]},
"Pedro Almodóvar": {activo: [1980, CURRENT_YEAR], generos: ["Drama", "Comedia", "Romance","Thriller"]},
"Alejandro Amenábar": {activo: [1996, CURRENT_YEAR], generos: ["Histórico","Drama", "Terror", "Thriller"]},
"Luis García Berlanga": {activo: [1951, 2002], generos: ["Comedia", "Drama"]},
"Álex de la Iglesia": {activo: [1993, CURRENT_YEAR], generos: ["Comedia", "Terror", "Thriller"]},
"Rodrigo Sorogoyen": {activo: [2008, 2022], generos: ["Thriller","Drama"]},   
"Akira Kurosawa": {activo: [1943, 1993], generos: ["Drama","Acción","Aventura","Thriller","Crimen"]},
"Ingmar Bergman": {activo: [1946, 2007], generos: ["Fantasía","Drama","Romance"]},
"Federico Fellini": {activo: [1950, 2003], generos: ["Fantasía","Drama","Comedia"]},
"François Truffaut": {activo: [1955, 2004], generos: ["Drama","Comedia","Romance","Crimen"]},
"Woody Allen": {activo: [1966, 2023], generos: ["Crimen","Drama","Romance","Comedia"]},
"Tim Burton": {activo: [1971, 2024], generos: ["Aventura","Comedia","Fantasía","Drama"]},
"Wes Anderson": {activo: [1993, CURRENT_YEAR], generos: ["Animación","Aventura","Comedia","Drama"]},
"David Lynch": {activo: [1967, 2018], generos: ["Drama","Thriller","Terror","Misterio"]},
"Guillermo del Toro": {activo: [1986, 2022], generos: ["Sci-fi","Fantasía","Drama","Terror","Thriller","Acción"]},
"Víctor Erice": {activo: [1961, 2023], generos: ["Drama","Documental","Misterio","Histórico"]},
"Takashi Miike": {activo: [1991, CURRENT_YEAR], generos: ["Comedia","Drama","Terror","Crimen","Acción","Thriller","Fantasía"]},
"Gakuryu Ishii": {activo: [1976, 2024], generos: ["Misterio","Sci-fi","Acción","Drama","Thriller"]},
"David Cronenberg": {activo: [1966, CURRENT_YEAR], generos: ["Drama","Thriller","Crimen","Terror","Sci-fi","Misterio","Documental"]},
"Denis Villeneuve": {activo: [1990, CURRENT_YEAR], generos: ["Thriller","Drama","Sci-fi"]},
"Michael Haneke": {activo: [1974, 2017], generos: ["Drama","Thriller","Terror","Misterio"]},
"Richard Linklater": {activo: [1985, CURRENT_YEAR], generos: ["Drama","Romance","Comedia","Musical","Animación"]},
"Terry Gilliam": {activo: [1975, 2018], generos: ["Sci-fi","Comedia","Aventura","Fantasía"]},
"John Cassavetes": {activo: [1960, 1986], generos: ["Drama","Crimen"]},
"Chantal Akerman": {activo: [1967, 2023], generos: ["Drama","Documental","Romance"]},
"Kathryn Bigelow": {activo: [1978, 2018], generos: ["Crimen","Drama","Thriller"]},
"John Carpenter": {activo: [1969, 2010], generos: ["Terror","Sci-fi","Acción","Comedia","Thriller"]},
"Michael Mann": {activo: [1971, 2023], generos: ["Drama","Crimen","Thriller","Acción"]},
"Andrey Zvyagintsev": {activo: [2003, 2017], generos: ["Drama","Crimen","Thriller"]},
"Paul Verhoeven": {activo: [1959, 2021], generos: ["Thriller","Sci-fi","Drama"]},       
"Francis Ford Coppola": {activo: [1956, 2024], generos: ["Drama","Crimen","Romance"]},
"Alejandro González Iñárritu": {activo: [1995, CURRENT_YEAR], generos: ["Drama","Comedia","Thriller"]},
"Gaspar Noé": {activo: [1985, 2023], generos: ["Drama","Terror"]},
"Abel Ferrara": {activo: [1971, 2024], generos: ["Terror","Drama","Thriller","Crimen"]},
"Clint Eastwood": {activo: [1971, 2024], generos: ["Guerra","Drama","Western","Crimen","Acción","Thriller"]},
"Paolo Sorrentino": {activo: [1994, 2024], generos: ["Drama","Romance"]},
"Walter Salles": {activo: [1987, 2024], generos: ["Drama"]},
"Ernst Lubitsch": {activo: [1915, 1948], generos: ["Comedia","Romance","Drama"]},
"Chris Marker": {activo: [1947, 2012], generos: ["Documental"]},
"F. W. Murnau": {activo: [1919, 1998], generos: ["Drama","Terror","Fantasía","Romance"]},
"Carl Theodor Dreyer": {activo: [1919, 1964], generos: ["Terror","Drama","Fantasía"]},
"Sidney Lumet": {activo: [1955, 2007], generos: ["Thriller","Drama","Crimen","Misterio"]},
"Robert Eggers": {activo: [2007, CURRENT_YEAR], generos: ["Terror","Fantasía"]},
"Christian Petzold": {activo: [1987, CURRENT_YEAR], generos: ["Drama","Romance"]},
"Charlie Chaplin": {activo: [1914, 2010], generos: ["Comedia","Romance"]},
"Theo Angelopoulos": {activo: [1968, 2012], generos: ["Drama","Histórico"]},
"Semih Kaplanoğlu": {activo: [2001, 2021], generos: ["Drama","Sci-fi"]},
"Cristi Puiu": {activo: [1995, 2023], generos: ["Drama"]},
"Miguel Gomes": {activo: [1999, 2024], generos: ["Drama","Comedia"]},
"Bong Joon-ho": {activo: [1992, CURRENT_YEAR], generos: ["Terror","Drama","Sci-fi","Comedia","Crimen"]},
"Orson Welles": {activo: [1933, 2020], generos: ["Misterio","Drama","Comedia","Crimen","Thriller"]},
"Carlos Saura": {activo: [1956, 2023], generos: ["Drama"]},
"Alain Resnais": {activo: [1947, 2014], generos: ["Documental","Drama","Romance","Comedia"]},
"Hiroshi Shimizu": {activo: [1924, 1959], generos: ["Drama"]},
"Alice Rohrwacher": {activo: [2005, 2024], generos: ["Drama","Documental","Fantasía"]},
"Brian De Palma": {activo: [1960, 2019], generos: ["Crimen","Comedia","Thriller","Drama","Misterio","Terror"]},
"Roy Andersson": {activo: [1967, 2019], generos: ["Drama","Comedia","Fantasía"]},
"Patricio Guzmán": {activo: [1965, 2022], generos: ["Documental","Drama"]},
"Raúl Ruiz": {activo: [1963, 2023], generos: ["Comedia","Drama","Documental","Fantasía","Misterio","Crimen"]},
"Radu Jude": {activo: [2006, CURRENT_YEAR], generos: ["Comedia","Drama"]},
"Piotr Szulkin": {activo: [1967, 2004], generos: ["Drama","Sci-fi","Terror"]},
"Jacques Demy": {activo: [1941, 1988], generos: ["Drama","Romance"]},
"Thomas Vinterberg": {activo: [1993, 2020], generos: ["Drama","Comedia"]},
"Éric Rohmer": {activo: [1950, 2011], generos: ["Drama","Romance","Comedia"]},
"Tsui Hark": {activo: [1979, CURRENT_YEAR], generos: ["Acción","Comedia","Drama","Fantasía","Romance","Aventura"]},
"Yasujirō Ozu": {activo: [1927, 1962], generos: ["Drama","Comedia"]},
"Billy Wilder": {activo: [1934, 1981], generos: ["Comedia","Romance","Drama","Crimen"]},
"Sergei Eisenstein": {activo: [1923, 2010], generos: ["Drama","Histórico","Guerra"]},
"Pablo Larraín": {activo: [2006, 2024], generos: ["Drama","Histórico"]},   
"Ben Affleck": {activo: [1993, 2023], generos: ["Crimen","Drama","Thriller"]},
"Guy Ritchie": {activo: [1995, CURRENT_YEAR], generos: ["Comedia","Crimen","Thriller","Acción","Aventura"]},
"Rob Reiner": {activo: [1984, CURRENT_YEAR], generos: ["Drama","Comedia","Romance"]},  
"Andrei Tarkovsky": {activo: [1956, 1990], generos: ["Drama","Sci-fi"]},
"Peter Greenaway": {activo: [1962, 2021], generos: ["Drama","Histórico","Comedia","Romance"]},
"David Lean": {activo: [1942, 1984], generos: ["Drama","Romance"]},
"Paweł Pawlikowski": {activo: [1990, CURRENT_YEAR], generos: ["Drama","Romance"]},
"Leos Carax": {activo: [1980, 2024], generos: ["Drama","Romance","Fantasía"]},
"Maya Deren": {activo: [1943, 2006], generos: ["Fantasía","Documental"]},
"Damien Chazelle": {activo: [2010, 2023], generos: ["Drama","Musical","Romance","Comedia"]},
"Jean-Luc Godard": {activo: [1955, 2014], generos: ["Drama","Romance","Comedia","Documental"]},
"Masaki Kobayashi": {activo: [1952, 1985], generos: ["Drama","Guerra","Histórico"]},
"Jonas Mekas": {activo: [1961, 2020], generos: ["Documental"]},
"Quentin Dupieux": {activo: [1999, CURRENT_YEAR], generos: ["Comedia","Fantasía"]},
"Greta Gerwig": {activo: [2008, CURRENT_YEAR], generos: ["Drama","Romance","Aventura","Comedia"]},
"Agnès Varda": {activo: [1956, 2022], generos: ["Drama","Documental","Romance"]},
"Luis Buñuel": {activo: [1929, 2000], generos: ["Drama","Crimen","Comedia"]},
"Frank Capra": {activo: [1921, 2000], generos: ["Comedia","Drama","Romance"]},        
"Miloš Forman": {activo: [1960, 2009], generos: ["Musical","Drama","Comedia"]},
"Nobuhiko Obayashi": {activo: [1944, 2020], generos: ["Comedia","Fantasía","Terror","Drama","Sci-fi","Romance"]},       
"Fruit Chan": {activo: [1985, 2022], generos: ["Terror","Crimen","Drama","Comedia"]},
"Carlos Reygadas": {activo: [1998, 2019], generos: ["Drama"]},
"John Woo": {activo: [1968, 2024], generos: ["Acción","Crimen","Thriller","Drama","Comedia"]},
"Ridley Scott": {activo: [1965, CURRENT_YEAR], generos: ["Sci-fi","Drama","Thriller","Acción","Aventura","Histórico"]},
"Hayao Miyazaki": {activo: [1972, 2024], generos: ["Aventura","Animación","Fantasía"]},
"Trần Anh Hùng": {activo: [1989, 2023], generos: ["Drama","Romance"]},
"David Fincher": {activo: [1985, CURRENT_YEAR], generos: ["Crimen","Misterio","Thriller","Drama"]},
"Franco Piavoli": {activo: [1954, 2016], generos: ["Documental","Drama"]},
"King Hu": {activo: [1964, 1993], generos: ["Acción","Aventura","Fantasía","Drama","Romance"]},
"Hiroshi Teshigahara": {activo: [1953, 1992], generos: ["Drama","Documental"]},       
"Aki Kaurismäki": {activo: [1981, 2023], generos: ["Comedia","Drama","Romance","Musical"]},
"Kiyoshi Kurosawa": {activo: [1973, 2024], generos: ["Drama","Thriller","Terror","Crimen","Comedia","Sci-fi"]},
"Takeshi Kitano": {activo: [1989, 2024], generos: ["Drama","Acción","Crimen","Thriller","Comedia"]},
"John Huston": {activo: [1941, 1987], generos: ["Aventura","Drama","Romance","Thriller","Guerra"]},      
"William Wyler": {activo: [1925, 2011], generos: ["Drama","Romance","Western"]},
"Aleksandr Sokurov": {activo: [1974, 2022], generos: ["Drama","Documental","Fantasía"]},
"Edward Yang": {activo: [1981, 2007], generos: ["Drama","Crimen","Romance"]},
"Anders Thomas Jensen": {activo: [1996, CURRENT_YEAR], generos: ["Drama","Comedia","Crimen"]},
"Kamila Andini": {activo: [2011, 2022], generos: ["Drama"]},
"Satyajit Ray": {activo: [1955, 1991], generos: ["Drama"]},
"Zack Snyder": {activo: [1990, 2024], generos: ["Acción","Aventura","Fantasía","Sci-fi"]},
"Joachim Trier": {activo: [2000, CURRENT_YEAR], generos: ["Drama","Misterio","Comedia"]},
"Jonathan Glazer": {activo: [1998, 2023], generos: ["Drama"]},  
"Paul Thomas Anderson": {activo: [1988, CURRENT_YEAR], generos: ["Drama","Comedia","Romance"]},
"Terrence Malick": {activo: [1969, 2022], generos: ["Drama","Romance","Histórico"]},
"Fernando Fernán Gómez": {activo: [1954, 2001], generos: ["Drama","Comedia"]},
"Luchino Visconti": {activo: [1944, 1976], generos: ["Drama","Romance"]},
"Manoel de Oliveira": {activo: [1931, 2015], generos: ["Drama","Histórico"]},
"Bi Gan": {activo: [2010, CURRENT_YEAR], generos: ["Drama","Fantasía","Misterio"]},
"Jia Zhangke": {activo: [1994, 2024], generos: ["Drama","Romance","Documental"]},
"Nuri Bilge Ceylan": {activo: [1995, 2023], generos: ["Drama","Crimen"]},
"Georges Méliès": {activo: [1901, 2021], generos: ["Terror","Comedia","Fantasía"]},
"Rainer Werner Fassbinder": {activo: [1966, 1982], generos: ["Drama","Crimen"]},
"Dario Argento": {activo: [1970, 2023], generos: ["Terror","Misterio","Thriller"]},
"Jean-Pierre Melville": {activo: [1946, 2004], generos: ["Crimen","Thriller","Drama"]},
"Jacques Rivette": {activo: [1949, 2009], generos: ["Comedia","Drama","Misterio","Romance"]},
"João César Monteiro": {activo: [1970, 2003], generos: ["Comedia","Drama"]},
"Constantin Costa-Gavras": {activo: [1958, CURRENT_YEAR], generos: ["Thriller","Drama"]},
"Glauber Rocha": {activo: [1959, 1980], generos: ["Drama","Western"]},
"Zhang Yimou": {activo: [1988, 2024], generos: ["Drama","Acción","Aventura","Histórico","Romance"]},
"Wim Wenders": {activo: [1967, CURRENT_YEAR], generos: ["Drama","Fantasía","Documental","Crimen"]},
"Karel Zeman": {activo: [1945, 2015], generos: ["Animación","Fantasía","Aventura","Comedia","Sci-fi"]},
"Wojciech Jerzy Has": {activo: [1947, 1988], generos: ["Drama","Fantasía"]},
"Robert Bresson": {activo: [1934, 1983], generos: ["Drama","Romance"]},
"Fritz Lang": {activo: [1919, 1984], generos: ["Drama","Thriller","Romance","Crimen","Misterio","Fantasía","Sci-fi"]},
"Park Chan-wook": {activo: [1992, 2022], generos: ["Drama","Thriller","Acción","Terror"]},
"Pedro Costa": {activo: [1984, 2023], generos: ["Drama","Misterio","Documental"]},
"Krzysztof Kieślowski": {activo: [1966, 2006], generos: ["Drama","Romance","Crimen"]},
"Wong Kar-wai": {activo: [1988, CURRENT_YEAR], generos: ["Drama","Romance","Crimen","Sci-fi"]},
"Lars von Trier": {activo: [1967, 2018], generos: ["Drama","Crimen","Terror"]},
"Mario Bava": {activo: [1946, 1995], generos: ["Thriller","Terror","Aventura"]},
"Michelangelo Antonioni": {activo: [1947, 2017], generos: ["Drama","Romance","Misterio"]},
"Darren Aronofsky": {activo: [1991, CURRENT_YEAR], generos: ["Drama","Thriller"]},
"Yorgos Lanthimos": {activo: [1995, CURRENT_YEAR], generos: ["Comedia","Drama","Misterio"]},
"M. Night Shyamalan": {activo: [1993, CURRENT_YEAR], generos: ["Misterio","Thriller","Drama","Sci-fi","Terror"]},
"Apichatpong Weerasethakul": {activo: [1993, 2024], generos: ["Drama","Fantasía","Documental","Misterio","Romance"]},  
"James Cameron": {activo: [1978, CURRENT_YEAR], generos: ["Acción","Thriller","Sci-fi","Aventura","Fantasía"]},
"Nicolas Winding Refn": {activo: [1996, 2024], generos: ["Acción","Crimen","Drama","Thriller"]},
"Joel Coen": {activo: [1980, 2021], generos: ["Comedia","Crimen","Drama","Thriller","Western"]},
"Abbas Kiarostami": {activo: [1970, 2022], generos: ["Drama"]},
"Werner Herzog": {activo: [1962, 2024], generos: ["Documental","Drama","Aventura","Guerra"]},
"Buster Keaton": {activo: [1917, 2017], generos: ["Romance","Comedia","Acción","Western"]},
"Hou Hsiao-hsien": {activo: [1980, 2015], generos: ["Drama","Romance"]},
"Tsai Ming-liang": {activo: [1989, 2024], generos: ["Drama","Documental","Romance"]},
"Béla Tarr": {activo: [1978, 2019], generos: ["Drama","Documental","Crimen"]},
"Kenji Mizoguchi": {activo: [1923, 1956], generos: ["Drama","Romance","Histórico"]},
"Alfonso Cuarón": {activo: [1983, 2018], generos: ["Drama","Romance","Sci-fi"]},
"Neill Blomkamp": {activo: [2003, 2023], generos: ["Sci-fi","Acción","Horror"]},
"Gus Van Sant": {activo: [1971, 2018], generos: ["Drama","Crimen","Misterio"]},
"Ryūsuke Hamaguchi": {activo: [2001, 2023], generos: ["Drama","Romance"]},
"Sofia Coppola": {activo: [1996, 2023], generos: ["Drama","Romance","Comedia"]},
"Alex Garland": {activo: [2015, CURRENT_YEAR], generos: ["Drama","Sci-fi","Terror","Guerra","Acción"]},
"Claire Denis": {activo: [1969, 2022], generos: ["Drama","Romance"]},
"Luca Guadagnino": {activo: [1997, CURRENT_YEAR], generos: ["Drama","Romance","Terror"]},
"Sean Baker": {activo: [2000, 2024], generos: ["Drama","Comedia","Romance"]},
"Hirokazu Koreeda": {activo: [1991, CURRENT_YEAR], generos: ["Drama","Fantasía","Crimen","Thriller"]},  
"Shunji Iwai": {activo: [1991, 2023], generos: ["Drama","Romance","Crimen"]},  
"Jim Jarmusch": {activo: [1981, CURRENT_YEAR], generos: ["Comedia","Drama","Romance","Western"]},
"Andrzej Żuławski": {activo: [1958, 2015], generos: ["Drama","Terror"]},   
"Šarūnas Bartas": {activo: [1986, CURRENT_YEAR], generos: ["Drama"]},
"Hong Sang-soo": {activo: [1996, CURRENT_YEAR], generos: ["Drama","Comedia","Romance"]},
"John Ford": {activo: [1917, 1976], generos: ["Western","Drama","Romance","Comedia"]},
"Lav Diaz": {activo: [1998, CURRENT_YEAR], generos: ["Drama","Histórico"]},
"Sergio Leone": {activo: [1959, 1991], generos: ["Western","Drama","Aventura","Histórico"]},
"Pier Paolo Pasolini": {activo: [1961, 2008], generos: ["Drama","Comedia","Fantasía"]},
"Hlynur Pálmason": {activo: [2008,CURRENT_YEAR], generos: ["Drama"]},
};

const generosUnicos = Array.from(
  new Set(
    Object.values(infoDirectores)
      .flatMap(director => director.generos)
  )
).sort();

const categoriasConGeneros = [...categoriasColumnas, ...generosUnicos];

const directoresExcluidosPorCategoria = {
  // Por cantidad de palabras en el título
  "Título de una palabra (ignorar artículos)": ["Sergio Leone"],
  "Título con 2 palabras": ["Sergio Leone"],
  "Título con 3 o más palabras": ["Andrey Zvyagintsev","Alex Garland"],    

  // Por letra inicial del título
  "Empieza por vocal (ignorar 'The')": ["Guillermo del Toro","Terrence Malick","Bi Gan","Alfonso Cuarón"],
  "Título empieza con A-H (ignorar 'The')": ["Joachim Trier","Bi Gan",],
  "Título empieza con I-P (ignorar 'The','A','An')": [],
  "Título empieza con Q-Z (ignorar 'A','An')": ["Sergio Leone"],

  // Por duración de la película
  "Título de menos de 2h de duración": [],

  "Título de 2h o más de duración": ["Wes Anderson","Ernst Lubitsch","F. W. Murnau","Christian Petzold",
    "Piotr Szulkin","Thomas Vinterberg","Paweł Pawlikowski","Quentin Dupieux","Luis Buñuel",
    "Kamila Andini","Jonathan Glazer","Georges Méliès","Karel Zeman","Robert Bresson","Mario Bava",
    "Nicolas Winding Refn","Buster Keaton","Alex Garland",
  ],

  // Características del título
  "Título contiene J,K,W,Z,X,Q": [],
  "Título con doble letra ('rr', 'll'...)": [],

  // Por año de estreno
  "Película entre 1920 y 1940": [],
  "Película entre 1980 y 2000": [],
  "Película posterior a 2010": [],
};

const directoresExcluidosParejasCategoria = {
    "Empieza por vocal (ignorar 'The') + Título empieza con Q-Z (ignorar 'A','An')": ["Guillermo del Toro","Greta Gerwig",],
    "Empieza por vocal (ignorar 'The') + Título empieza con A-H (ignorar 'The')":["Bi Gan"],
    "Empieza por vocal (ignorar 'The') + Título con doble letra ('rr', 'll'...)": ["Hlynur Pálmason"],
    "Título con 2 palabras + Título con 3 o más palabras" : ["Andrey Zvyagintsev"],
    "Título con 2 palabras + Título contiene J,K,W,Z,X,Q": ["Andrey Zvyagintsev"],
    "Título con 3 o más palabras + Título empieza con Q-Z (ignorar 'A','An')":["Andrey Zvyagintsev","Alex Garland"],
    "Título con 3 o más palabras + Título empieza con I-P (ignorar 'A','An')":["Alex Garland",],
    "Título con 3 o más palabras + Título contiene J,K,W,Z,X,Q":["Andrey Zvyagintsev"],
    "Título con 3 o más palabras + Título con doble letra ('rr', 'll'...)":["Andrey Zvyagintsev","Alex Garland"],
    "Título con 3 o más palabras + Título de 2h o más de duración":["Alex Garland"],
    "Título con 2 palabras + Título con doble letra ('rr', 'll'...)": ["Robert Eggers",],
    "Título con 2 palabras + Título empieza con Q-Z (ignorar 'A','An')": ["Sergio Leone"],
    "Empieza por vocal (ignorar 'The') + Título de 2h o más de duración":["Jonathan Glazer","Quentin Dupieux","Hlynur Pálmason"],
    "Título de una palabra (ignorar 'The') + Título con 2 palabras": ["Sergio Leone"],
    "Título de una palabra (ignorar 'The') + Título empieza con A-H (ignorar 'The')":["Greta Gerwig",],
    "Título de una palabra (ignorar 'The') + Título empieza con Q-Z (ignorar 'The')": ["Sergio Leone"],
    "Título empieza con A-H (ignorar 'The') + Título contiene J,K,W,Z,X,Q": ["Joachim Trier"],
    "Título empieza con A-H (ignorar 'The') + Título con doble letra ('rr', 'll'...)":["Joachim Trier"],
    "Título empieza con I-P (ignorar 'The','A','An') + Título de 2h o más de duración":["Jonathan Glazer","Alex Garland",],
    "Título empieza con Q-Z (ignorar 'A','An') + Título de 2h o más de duración":["Robert Bresson","Alex Garland"],
    "Título con doble letra ('rr', 'll'...) + Título de 2h o más de duración":["Alex Garland","Hlynur Pálmason"]
}

const directoresNivelFacil = [ // 44 directores
    "Alfred Hitchcock","Akira Kurosawa", "Ingmar Bergman","Billy Wilder", "Jean-Luc Godard","Stanley Kubrick","Park Chan-wook",
    "Francis Ford Coppola", "Martin Scorsese", "Clint Eastwood", "Brian De Palma","Michael Mann","David Lynch","James Cameron",
    "Tim Burton","Ridley Scott", "Hayao Miyazaki","Terrence Malick", "Pedro Almodóvar","Christopher Nolan", "Alex Garland","David Fincher",
    "Paolo Sorrentino","Bong Joon-ho","Quentin Tarantino","Guillermo del Toro","Alfonso Cuarón","Steven Spielberg","Federico Fellini",
    "Sofia Coppola","Luca Guadagnino","Paul Thomas Anderson","Wong Kar-wai","Lars von Trier","Wes Anderson","Denis Villeneuve","Damien Chazelle",
    "Darren Aronofsky", "Yorgos Lanthimos","M. Night Shyamalan","Joel Coen","Andrei Tarkovsky","Alejandro Amenábar","John Ford","Krzysztof Kieślowski",
    "Ben Affleck","Guy Ritchie","Greta Gerwig","Woody Allen","Zack Snyder","Joachim Trier","Jonathan Glazer","Luis García Berlanga",
    "John Carpenter","F. W. Murnau","Gaspar Noé",
];

const directoresNivelMedio = [ // 52 directores
    "Charlie Chaplin","Yasujirō Ozu","Ernst Lubitsch","Agnès Varda", "Luis Buñuel","Orson Wells","Robert Bresson","Éric Rohmer",
    "Fritz Lang", "François Truffaut", "Michelangelo Antonioni", "Buster Keaton","Carlos Saura","Leos Carax","Aki Kaurismäki",
    "Sidney Lumet","EdGuerrad Yang","Wim Wenders","Béla Tarr","Jim Jarmusch","Kathryn Bigelow","Abel Ferrara","Rob Reiner","Bi Gan",
    "Alice Rohrwacher","Neill Blomkamp","Gus Van Sant", "Ryūsuke Hamaguchi","Michael Haneke","Alejandro González Iñárritu",
    "Sean Baker", "Hirokazu Kore-eda","Kiyoshi Kurosawa","Nicolas Winding Refn","John Huston","Pablo Larraín",
    "Hong Sang-soo","John Cassavetes","Werner Herzog","Jacques Demy", "Thomas Vinterberg","Abbas Kiarostami","Frank Capra",
    "Paul Verhoeven","David Lean","Rodrigo Sorogoyen","Álex de la Iglesia","Manoel de Oliveira","Miloš Forman","Jean-Pierre Melville",
    "Georges Méliès","Terry Gilliam","Carl Theodor Dreyer","Rainer Werner Fassbinder","Constantin Costa-Gavras","Dario Argento","Pier Paolo Pasolini",
    "Glauber Rocha","Karel Zeman","Miguel Gomes","Sergio Leone",
];

const directoresNivelDificil = [ // 56 directores
    "Hiroshi Shimizu","Mario Bava","Kenji Mizoguchi","Chantal Akerman","Alain Resnais","Chris Marker",
    "Theo Angelopoulos","Gakuryu Ishii","Zhang Yimou","Hou Hsiao-hsien", "Tsai Ming-liang","Pedro Costa",
    "Claire Denis","Andrzej Żuławski", "Šarūnas Bartas","Semih Kaplanoğlu", "Cristi Puiu","Takashi Miike","Shunji Iwai",
    "Walter Salles","Andrei Zvyagintsev","Lav Diaz","Jia Zhangke", "Nuri Bilge Ceylan","Apichatpong Weerasethakul",
    "Roy Andersson","Patricio Guzmán","Raúl Ruiz", "Radu Jude", "Piotr Szulkin","Sergei Eisenstein","Peter Greenaway",
    "Paweł Pawlikowski","Maya Deren","Masaki Kobayashi","Jonas Mekas","Quentin Dupieux","King Hu", 
    "Nobuhiko Obayashi","Fruit Chan","Carlos Reygadas","John Woo","Trần Anh Hùng","Franco Piavoli","Louis Feuillade",
    "Hiroshi Teshigahara","Takeshi Kitano","William Wyler","Aleksandr Sokurov","Kamila Andini","Satyajit Ray","Anders Thomas Jensen",
    "Fernando Fernán Gómez","Luchino Visconti","João César Monteiro","Tsui Hark","Wojciech Jerzy Has","Jacques Rivette","Hlynur Pálmason"
];

const directoresNivelTotal = [
    ...directoresNivelFacil,
    ...directoresNivelMedio,
    ...directoresNivelDificil
];

const modoAltoLapiz = [
    "Alfred Hitchcock","Akira Kurosawa", "Ingmar Bergman", "Jia Zhangke","Stanley Kubrick","Takashi Miike","Billy Wilder",
    "Jean-Luc Godard","Francis Ford Coppola", "Martin Scorsese", "Clint Eastwood", "Brian De Palma","David Lynch",,"Michael Mann",
    "Ridley Scott", "Hayao Miyazaki", "Aki Kaurismäki","Terrence Malick", "Pedro Almodóvar","Steven Spielberg","Lars von Trier",
    "Sofia Coppola","Luca Guadagnino","Paul Thomas Anderson","Wong Kar-wai","Wes Anderson","Denis Villeneuve","Joel Coen",
    "Yorgos Lanthimos","M. Night Shyamalan","Éric Rohmer","Guy Ritchie","Woody Allen","Zack Snyder","Joachim Trier","Jonathan Glazer",
    "Charlie Chaplin","Yasujirō Ozu","Ernst Lubitsch","Agnès Varda","Luis Buñuel","Orson Wells","Robert Bresson",
];

const modoGeografia = [
    "Japón", "China", "Brasil", "Argentina", "Chile", "México", "Canadá", "Mediterráneo","Asia Oriental","Sudeste Asiático","Asia Meridional","Asia Occidental",
    "Francia", "Italia", "España", "Dinamarca", "Suecia", "Noruega", "Islandia", "Norteamérica","América del Sur", "Escandinavia",
    "Alemania", "Holanda", "Polonia", "Rusia", "Turquía", "Grecia", 
    "Rumania", "Hong Kong", "Corea del Sur", "Taiwán", "Tailandia", "Vietnam", 
    "India", "Filipinas", "Indonesia", "Irán","Centroeuropa","Europa del este",
];

const categoriaRegiones = [
    "Centroeuropa","Europa del este","Mediterráneo","Asia Oriental","Sudeste Asiático","Asia Meridional","Asia Occidental","Norteamérica","América del Sur", "Escandinavia"
];

const categoriaPaises = [
    "Japón", "China", "Brasil", "Argentina", "Chile", "México", "Canadá", 
    "Francia", "Italia", "España", "Dinamarca", "Suecia", "Noruega", "Islandia", 
    "Alemania", "Bélgica", "Holanda", "Polonia", "Rusia", "Turquía", "Grecia", 
    "Rumanía", "Hong Kong", "Corea del Sur", "Taiwán", "Tailandia", "Vietnam", 
    "India", "Filipinas", "Indonesia", "Irán","Finlandia","Portugal",
];

const regiones = {
    "Centroeuropa": [
        "DE", "HU", "SK", "BE", "CZ", "GB", "NL", "LU", "AT", "PL", "FR", "CS" // CS : Checoslovaquia
    ],
    "Europa del este": [
        "RU", "SU", "RO", "UA", "BA", "BY", "LV", "LT", "EE", "MD", "GE", "HR", "SI", "RS", "ME", "MK", "XK" // SU : URSS
    ],
    "Escandinavia": [
        "SE", "NO", "FI", "IS", "DK"
    ],
    "Mediterráneo": [
        "ES", "PT", "IT", "TR", "CY", "MT", "GR"
    ],
    "Asia Oriental": [
        "CN", "JP", "KR", "MN", "TW", "HK"
    ],
    "Sudeste Asiático": [
        "TH", "VN", "PH", "ID", "MY", "SG", "MM", "KH", "LA", "BN", "TL"
    ],
    "Asia Meridional": [
        "IN", "PK", "BD", "LK", "AF"
    ],
    "Asia Occidental": [
        "IR", "IL", "PS", "SA", "YE", "OM", "QA", "AE", "BH", "KW", "JO", "AM", "AZ", "SY", "LB", "IQ","KZ"
    ],
    "Norteamérica": [
        "US", "CA", "MX"
    ],
    "América del Sur": [
        "BR", "AR", "CL", "CO", "PE", "EC", "BO", "PY", "UY"
    ],
    "África": [
        "DZ", "AO", "BJ", "BW", "BF", "BI", "CM", "CV", "CF", "TD", "KM", "CD", "CG", "DJ", "EG", "GQ", "ER", "SZ", "ET", "GA", "GM", "GH", "GN", "GW", "CI", "KE", "LS", "LR", "LY", "MG", "MW", "ML", "MR", "MU", "MA", "MZ", "NA", "NE", "NG", "RW", "ST", "SN", "SC", "SL", "SO", "ZA", "SS", "SD", "TZ", "TG", "TN", "UG", "ZM", "ZW"
    ]
};

const paises = {
    "Japón": ["JP"],"China": ["CN"],"Brasil": ["BR"],"Argentina": ["AR"],"Chile": ["CL"],"México": ["MX"],"Canadá": ["CA"],"Francia": ["FR"],"Italia": ["IT"],"España": ["ES"],"Dinamarca": ["DK"],"Suecia": ["SE"],"Noruega": ["NO"],"Islandia": ["IS"],"Alemania": ["DE"],"República Checa": ["CZ", "CS"],"Holanda": ["NL"],"Polonia": ["PL"],"Rusia": ["RU", "SU"],"Turquía": ["TR"],"Grecia": ["GR"],"Rumanía": ["RO"],"Hong Kong": ["HK"],"Corea del Sur": ["KR"],"Taiwán": ["TW"],"Tailandia": ["TH"],"Vietnam": ["VN"],"India": ["IN"],"Filipinas": ["PH"],"Indonesia": ["ID"],"Irán": ["IR"],
    "Portugal": ["PT"], "Chipre": ["CY"], "Malta": ["MT"], "Reino Unido": ["GB"], "Checoslovaquia": ["CS"], "URSS": ["SU"],
    "Colombia": ["CO"], "Perú": ["PE"], "Ecuador": ["EC"], "Bolivia": ["BO"], "Paraguay": ["PY"], "Uruguay": ["UY"],
    "Israel": ["IL"], "Palestina": ["PS"], "Arabia Saudita": ["SA"], "Yemen": ["YE"], "Omán": ["OM"], "Catar": ["QA"],
    "Emiratos Árabes Unidos": ["AE"], "Baréin": ["BH"], "Kuwait": ["KW"], "Jordania": ["JO"], "Armenia": ["AM"],
    "Azerbaiyán": ["AZ"], "Siria": ["SY"], "Líbano": ["LB"], "Irak": ["IQ"], "Kazajistán": ["KZ"],
    "Pakistán": ["PK"], "Bangladés": ["BD"], "Sri Lanka": ["LK"], "Afganistán": ["AF"], "Finlandia": ["FI"],
    "Ucrania": ["UA"], "Bosnia y Herzegovina": ["BA"], "Bielorrusia": ["BY"], "Letonia": ["LV"], "Lituania": ["LT"],
    "Estonia": ["EE"], "Moldavia": ["MD"], "Georgia": ["GE"], "Croacia": ["HR"], "Eslovenia": ["SI"], "Serbia": ["RS"],
    "Montenegro": ["ME"], "Macedonia del Norte": ["MK"], "Kosovo": ["XK"],
    "Malasia": ["MY"], "Singapur": ["SG"], "Birmania": ["MM"], "Camboya": ["KH"], "Laos": ["LA"], "Brunéi": ["BN"], "Timor Oriental": ["TL"],
    "Mongolia": ["MN"]
};

const generoTraduccion = {
  "Acción": "action",
  "Aventura": "adventure",
  "Animación": "animation",
  "Comedia": "comedy",
  "Crimen": "crime",
  "Documental": "documentary",
  "Drama": "drama",
  "Familia": "family",
  "Fantasía": "fantasy",
  "Histórico": "history",
  "Terror": "horror",
  "Música": "music",
  "Misterio": "mystery",
  "Romance": "romance",
  "Sci-fi": "science fiction",
  "Thriller": "thriller",
  "Guerra": "war",
  "Western": "western"
};
