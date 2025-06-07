const categoriasColumnas = [
    "Título de una palabra (ignorar artículos)",
    "Título con 3 o más palabras",
    "Empieza por vocal (ignorar artículos)",
    "Título empieza con A-H (ignorar artículos)",
    "Título empieza con I-P (ignorar artículos)",
    "Título empieza con Q-Z (ignorar artículos)",
    "Título contiene J,K,W,Z,X,Q",
    "Título con 2 palabras",
    "Título con doble letra ('rr', 'll'...)",
    "Título de menos de 2h de duración",
    "Título de 2h o más de duración"
];

function validarTitulo(pelicula, categoria) {
    const tituloOriginal = pelicula.title || pelicula.original_title;
    let tituloSinArticulos = tituloOriginal.replace(/^(the|a|an)\s+/i, "");
    const words = tituloSinArticulos.split(/\s+/).filter(word => word.length > 0);
    let firstCharToEvaluate = '';

    const startsWithDigit = /^\d/.test(tituloSinArticulos);

    if (startsWithDigit) {
        if (words.length >= 2) {
            firstCharToEvaluate = words[1].charAt(0).toUpperCase();
        } else {
            firstCharToEvaluate = '';
        }
    } else {
        if (words.length > 0) {
            firstCharToEvaluate = words[0].charAt(0).toUpperCase();
        } else {
            return false;
        }
    }

    console.log(`Validando título ORIGINAL: "${tituloOriginal}" para la categoría: "${categoria}"`);
    console.log(`Título sin artículos: "${tituloSinArticulos}"`);
    console.log(`Palabras procesadas: ${JSON.stringify(words)}`);
    console.log(`Primer caracter a evaluar: "${firstCharToEvaluate}"`);

    switch (categoria.trim()) {
        case "Título de una palabra (ignorar artículos)":
            if (tituloSinArticulos.split(/\s+/).length !== 1) return false;
            break;
        case "Título con 3 o más palabras":
            if (tituloOriginal.split(/\s+/).length < 3) return false;
            break;
        case "Empieza por vocal (ignorar artículos)":
            if (firstCharToEvaluate === '') return false;
            if (!/^[AEIOUÁÉÍÓÚÜ]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con A-H (ignorar artículos)":
            if (firstCharToEvaluate === '') return false;
            if (!/^[A-H]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con I-P (ignorar artículos)":
            if (firstCharToEvaluate === '') return false;
            if (!/^[I-P]/.test(firstCharToEvaluate)) return false;
            break;
        case "Título empieza con Q-Z (ignorar artículos)":
            if (firstCharToEvaluate === '') return false;
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
            if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0) return false;
            if (pelicula.runtime >= 120) return false;
            break;
        case "Título de 2h o más de duración":
            if (typeof pelicula.runtime !== 'number' || pelicula.runtime === 0) return false;
            if (pelicula.runtime < 120) return false;
            break;
    }
    return true;
}

const CURRENT_YEAR = new Date().getFullYear();

const infoDirectores = {
  "Steven Spielberg": {activo: [1971, CURRENT_YEAR], premios: ["Oscar", "BAFTA", "Golden Globe"], generos: ["Aventura", "Drama", "Histórico", "Ciencia ficción"]},
  "Martin Scorsese": {activo: [1967, CURRENT_YEAR], premios: ["Oscar", "BAFTA", "Golden Globe", "Cannes"], generos: ["Drama", "Crimen", "Biografía"]},
  "Christopher Nolan": {activo: [1998, CURRENT_YEAR], premios: ["Oscar", "BAFTA", "Golden Globe"], generos: ["Sci-fi", "Drama", "Acción", "Thriller"]},
  "Quentin Tarantino": {activo: [1992, CURRENT_YEAR], premios: ["Oscar", "BAFTA", "Cannes", "Golden Globe"], generos: ["Crimen", "Drama", "Western"]},
  "Alfred Hitchcock": {activo: [1925, 1980], premios: ["BAFTA", "Golden Globe"], generos: ["Suspense", "Thriller", "Misterio"]},
  "Stanley Kubrick": {activo: [1953, 1999], premios: ["BAFTA", "Golden Globe"], generos: ["Sci-fi", "Drama", "Guerra", "Terror"]},
  "Pedro Almodóvar": {activo: [1980, CURRENT_YEAR], premios: ["Oscar", "BAFTA", "Cannes", "Goya"], generos: ["Drama", "Comedia", "Melodrama"]},
  "Alejandro Amenábar": {activo: [1996, CURRENT_YEAR], premios: ["Oscar", "Goya", "Venecia"], generos: ["Drama", "Terror", "Thriller"]},
  "Luis García Berlanga": {activo: [1951, 2002], premios: ["Goya", "Venecia"], generos: ["Comedia", "Sátira", "Drama"]},
  "Álex de la Iglesia": {activo: [1993, CURRENT_YEAR], premios: ["Goya", "Venecia", "Sitges"], generos: ["Comedia", "Terror", "Thriller"]},
};

const directoresExcluidosPorCategoria = {
  // Por cantidad de palabras en el título
  "Título de una palabra (ignorar artículos)": ["Sergio Leone"],
  "Título con 2 palabras": ["Sergio Leone"],
  "Título con 3 o más palabras": ["Andrey Zvyagintsev","Alex Garland"],    

  // Por letra inicial del título
  "Empieza por vocal (ignorar artículos)": ["Guillermo del Toro","Terrence Malick","Bi Gan","Alfonso Cuarón"],
  "Título empieza con A-H (ignorar artículos)": ["Joachim Trier","Bi Gan",],
  "Título empieza con I-P (ignorar artículos)": [],
  "Título empieza con Q-Z (ignorar artículos)": ["Sergio Leone"],

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

  // Por premios (si se decide usarlos como categoría futura)
  "Película ganadora del Oscar": [],
  "Película ganadora de Cannes": [],
  "Película ganadora del Goya": [],
  "Película nominada al BAFTA": [],

  // Por año de estreno
  "Película entre 1920 y 1940": [],
  "Película entre 1980 y 2000": [],
  "Película posterior a 2010": [],
};

const directoresExcluidosParejasCategoria = {
    "Empieza por vocal (ignorar artículos) + Título empieza con Q-Z (ignorar artículos)": ["Guillermo del Toro","Greta Gerwig",],
    "Empieza por vocal (ignorar artículos) + Título empieza con A-H (ignorar artículos)":["Bi Gan"],
    "Título con 2 palabras + Título con 3 o más palabras" : ["Andrey Zvyagintsev"],
    "Título con 2 palabras + Título contiene J,K,W,Z,X,Q": ["Andrey Zvyagintsev"],
    "Título con 3 o más palabras + Título empieza con Q-Z (ignorar artículos)":["Andrey Zvyagintsev","Alex Garland"],
    "Título con 3 o más palabras + Título empieza con I-P (ignorar artículos)":["Alex Garland",],
    "Título con 3 o más palabras + Título contiene J,K,W,Z,X,Q":["Andrey Zvyagintsev"],
    "Título con 3 o más palabras + Título con doble letra ('rr', 'll'...)":["Andrey Zvyagintsev","Alex Garland"],
    "Título con 3 o más palabras + Título de 2h o más de duración":["Alex Garland"],
    "Título con 2 palabras + Título con doble letra ('rr', 'll'...)": ["Robert Eggers",],
    "Título con 2 palabras + Título empieza con Q-Z (ignorar artículos)": ["Sergio Leone"],
    "Empieza por vocal (ignorar artículos) + Título de 2h o más de duración":["Jonathan Glazer","Quentin Dupieux"],
    "Título de una palabra (ignorar artículos) + Título con 2 palabras": ["Sergio Leone"],
    "Título de una palabra (ignorar artículos) + Título empieza con A-H (ignorar artículos)":["Greta Gerwig",],
    "Título de una palabra (ignorar artículos) + Título empieza con Q-Z (ignorar artículos)": ["Sergio Leone"],
    "Título empieza con A-H (ignorar artículos) + Título contiene J,K,W,Z,X,Q": ["Joachim Trier"],
    "Título empieza con A-H (ignorar artículos) + Título con doble letra ('rr', 'll'...)":["Joachim Trier"],
    "Título empieza con I-P (ignorar artículos) + Título de 2h o más de duración":["Jonathan Glazer","Alex Garland",],
    "Título empieza con Q-Z (ignorar artículos) + Título de 2h o más de duración":["Robert Bresson","Alex Garland"],
    "Título con doble letra ('rr', 'll'...) + Título de 2h o más de duración":["Alex Garland"]
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

const directoresNivelMedio = [ // 50 directores
    "Charlie Chaplin","Yasujirō Ozu","Ernst Lubitsch","Agnès Varda", "Luis Buñuel","Orson Wells","Robert Bresson","Éric Rohmer",
    "Fritz Lang", "François Truffaut", "Michelangelo Antonioni", "Buster Keaton","Carlos Saura","Leos Carax","Aki Kaurismäki",
    "Sidney Lumet","Edward Yang","Wim Wenders","Béla Tarr","Jim Jarmusch","Kathryn Bigelow","Abel Ferrara","Rob Reiner","Bi Gan",
    "Alice Rohrwacher","Neill Blomkamp","Gus Van Sant", "Ryūsuke Hamaguchi","Michael Haneke","Alejandro González Iñárritu",
    "Sean Baker", "Hirokazu Kore-eda","Kiyoshi Kurosawa","Nicolas Winding Refn","John Huston","Pablo Larraín",
    "Hong Sang-soo","John Cassavetes","Werner Herzog","Jacques Demy", "Thomas Vinterberg","Abbas Kiarostami","Frank Capra",
    "Paul Verhoeven","David Lean","Rodrigo Sorogoyen","Álex de la Iglesia","Manoel de Oliveira","Miloš Forman","Jean-Pierre Melville",
    "Georges Méliès","Terry Gilliam","Carl Theodor Dreyer","Rainer Werner Fassbinder","Constantin Costa-Gavras","Dario Argento",
    "Glauber Rocha","Karel Zeman","Miguel Gomes",
];

const directoresNivelDificil = [ // 54 directores
    "Hiroshi Shimizu","Mario Bava","Kenji Mizoguchi","Chantal Akerman","Alain Resnais","Chris Marker",
    "Theo Angelopoulos","Gakuryu Ishii","Zhang Yimou","Hou Hsiao-hsien", "Tsai Ming-liang","Pedro Costa",
    "Claire Denis","Andrzej Żuławski", "Šarūnas Bartas","Semih Kaplanoğlu", "Cristi Puiu","Takashi Miike","Shunji Iwai",
    "Walter Salles","Andrei Zvyagintsev","Lav Diaz","Jia Zhangke", "Nuri Bilge Ceylan","Apichatpong Weerasethakul",
    "Roy Andersson","Patricio Guzmán","Raúl Ruiz", "Radu Jude", "Piotr Szulkin","Sergei Eisenstein","Peter Greenaway",
    "Paweł Pawlikowski","Maya Deren","Kim Ki-duk","Masaki Kobayashi","Jonas Mekas","Quentin Dupieux","King Hu",
    "Nobuhiko Obayashi","Fruit Chan","Carlos Reygadas","John Woo","Trần Anh Hùng","Franco Piavoli",
    "Hiroshi Teshigahara","Takeshi Kitano","William Wyler","Aleksandr Sokurov","Kamila Andini","Satyajit Ray","Anders Thomas Jensen",
    "Fernando Fernán Gómez","Luchino Visconti","João César Monteiro","Tsui Hark","Wojciech Jerzy Has","Jacques Rivette",
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
