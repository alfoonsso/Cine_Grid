const categoriasFilas = [
    "Alfred Hitchcock", "Stanley Kubrick", "Víctor Erice", "Takashi Miike", "Gakuryu Ishii", "David Cronenberg",
    "Christopher Nolan", "Denis Villeneuve","Michael Haneke","Richard Linklater","Terry Gilliam", "John Cassavetes",
    "Chantal Akerman", "Kathryn Bigelow","John Carpenter","Michael Mann","Andrey Zvyagintsev","Paul Verhoeven",     
    "Francis Ford Coppola", "Martin Scorsese", "Alejandro González Iñárritu", "Gaspar Noé","Abel Ferrara",
    "Clint Eastwood", "Paolo Sorrentino","Walter Salles","Ernst Lubitsch","Chris Marker",
    "F. W. Murnau", "Carl Theodor Dreyer","Sidney Lumet","Robert Eggers","Tim Burton","Christian Petzold",
    "Charlie Chaplin", "Steven Spielberg","Theo Angelopoulos", "Semih Kaplanoğlu", "Cristi Puiu","Miguel Gomes",
    "Bong Joon-ho", "Orson Wells","Luis García Berlanga","Carlos Saura", "Alain Resnais","Hiroshi Shimizu",
    "Alice Rohrwacher", "Brian De Palma","Roy Andersson","Patricio Guzmán", "Raúl Ruiz", "Radu Jude", "Piotr Szulkin",
    "David Lynch", "Akira Kurosawa","Jacques Demy", "Thomas Vinterberg", "Éric Rohmer","Alejandro Amenábar","Tsui Hark",
    "Yasujirō Ozu", "Billy Wilder","Sergei Eisenstein","Pablo Larraín","Ben Affleck","Guy Ritchie","Rob Reiner",
    "Ingmar Bergman", "Andrei Tarkovsky","Peter Greenaway","David Lean","Paweł Pawlikowski","Leos Carax","Maya Deren",
    "Quentin Tarantino", "Jean-Luc Godard","Kim Ki-duk","Masaki Kobayashi","Jonas Mekas","Quentin Dupieux","Greta Gerwig",
    "Agnès Varda", "Luis Buñuel","Miloš Forman","Nobuhiko Obayashi","Fruit Chan","Carlos Reygadas","John Woo",
    "Ridley Scott", "Hayao Miyazaki","Trần Anh Hùng","Franco Piavoli","King Hu","Hiroshi Teshigahara",
    "Aki Kaurismäki", "Kiyoshi Kurosawa","Takeshi Kitano","Woody Allen","John Huston","William Wyler","Aleksandr Sokurov",
    "Edward Yang", "Anders Thomas Jensen","Kamila Andini","Satyajit Ray","Zack Snyder","Joachim Trier","Jonathan Glazer",
    "Paul Thomas Anderson", "Terrence Malick","Fernando Fernán Gómez","Luchino Visconti","Manoel de Oliveira",
    "Bi Gan", "Jia Zhangke", "Nuri Bilge Ceylan","George Meliés","Rainier Werner Fassbinder","Dario Argento",
    "Jean-Pierre Melville", "Jacques Rivette","Joao César Monteiro","Constantin Costa-Gavras","Glauber Rocha",
    "Pedro Almodóvar", "Zhang Yimou", "Wim Wenders","Karel Zeman", "Wojciech Jerzy Has",
    "Robert Bresson", "Fritz Lang", "Park Chan-wook",
    "Pedro Costa", "Krzysztof Kieślowski",
    "Wong Kar-wai", "François Truffaut", "Lars von Trier", 
    "Mario Bava", "Federico Fellini", "Wes Anderson", 
    "Michelangelo Antonioni", "Darren Aronofsky", "Yorgos Lanthimos",
    "M. Night Shyamalan", "Apichatpong Weerasethakul",
    "James Cameron", "Nicolas Winding Refn", "Joel Coen", 
    "Abbas Kiarostami", "Werner Herzog", "Buster Keaton",
    "Hou Hsiao-hsien", "Tsai Ming-liang", "Béla Tarr",
    "Kenji Mizoguchi", "Guillermo del Toro", 
    "Alfonso Cuarón", "Neill Blomkamp",
    "Gus Van Sant", "Ryūsuke Hamaguchi",
    "Sofia Coppola", "Alex Garland",
    "Claire Denis", "Luca Guadagnino",
    "Sean Baker", "Hirokazu Koreeda",
    "Shunji Iwai", "Jim Jarmusch",
    "Andrzej Żuławski", "Šarūnas Bartas",
    "Hong Sang-soo", "John Ford"
];

 const directoresNivelFacil = [ // 49 directores
    "Alfred Hitchcock","Akira Kurosawa", "Ingmar Bergman","Billy Wilder", "Jean-Luc Godard","Stanley Kubrick",
    "Francis Ford Coppola", "Martin Scorsese", "Clint Eastwood", "Brian De Palma","Michael Mann","David Lynch","James Cameron",
    "Tim Burton","Ridley Scott", "Hayao Miyazaki", "Aki Kaurismäki","Terrence Malick", "Pedro Almodóvar","Christopher Nolan", 
    "Paolo Sorrentino","Bong Joon-ho","Quentin Tarantino","Guillermo del Toro","Alfonso Cuarón","Steven Spielberg",
    "Sofia Coppola","Luca Guadagnino","Paul Thomas Anderson","Wong Kar-wai","Lars von Trier","Wes Anderson","Denis Villeneuve",
    "Darren Aronofsky", "Yorgos Lanthimos","M. Night Shyamalan","Joel Coen","Andrei Tarkovsky","Éric Rohmer","Alejandro Amenábar",
    "Ben Affleck","Guy Ritchie","Greta Gerwig","Woody Allen","Zack Snyder","Joachim Trier","Jonathan Glazer","Luis García Berlanga",
]

const directoresNivelMedio = [ // 49 directores
    "Charlie Chaplin","Yasujirō Ozu","Ernst Lubitsch","Agnès Varda", "Luis Buñuel","Orson Wells","Robert Bresson",
    "Fritz Lang", "François Truffaut","Federico Fellini", "Michelangelo Antonioni", "Buster Keaton","Carlos Saura","Leos Carax",
    "Sidney Lumet","Edward Yang","Wim Wenders","Béla Tarr","Jim Jarmusch","Kathryn Bigelow","Abel Ferrara","Rob Reiner",
    "Alice Rohrwacher","Neill Blomkamp","Gus Van Sant", "Ryūsuke Hamaguchi","Michael Haneke","Alex Garland","Alejandro González Iñárritu",
    "Sean Baker", "Hirokazu Kore-eda","Kiyoshi Kurosawa","Nicolas Winding Refn","John Huston","Pablo Larraín","Danny Boyle",
    "Hong Sang-soo","John Cassavetes","Krzysztof Kieślowski","Werner Herzog","Jacques Demy", "Thomas Vinterberg",
    "Paul Verhoeven","Park Chan-wook","David Lean","John Ford","Rodrigo Sorogoyen","Álex de la Iglesia","Manoel de Oliveira",

]

const directoresNivelDificil = [ // 49 directores
    "Hiroshi Shimizu","Mario Bava","Kenji Mizoguchi","Chantal Akerman","Alain Resnais","Chris Marker",
    "Theo Angelopoulos","Gakuryu Ishii","Zhang Yimou","Abbas Kiarostami","Hou Hsiao-hsien", "Tsai Ming-liang","Pedro Costa",
    "Claire Denis","Andrzej Żuławski", "Šarūnas Bartas","Semih Kaplanoğlu", "Cristi Puiu","Takashi Miike","Shunji Iwai",
    "Walter Salles","Andrei Zvyagintsev","Lav Diaz","Bi Gan","Jia Zhangke", "Nuri Bilge Ceylan","Apichatpong Weerasethakul",
    "Roy Andersson","Patricio Guzmán","Raúl Ruiz", "Radu Jude", "Piotr Szulkin","Sergei Eisenstein","Peter Greenaway",
    "Paweł Pawlikowski","Maya Deren","Kim Ki-duk","Masaki Kobayashi","Jonas Mekas","Quentin Dupieux","King Hu",
    "Miloš Forman","Nobuhiko Obayashi","Fruit Chan","Carlos Reygadas","John Woo","Trần Anh Hùng","Franco Piavoli",
    "Hiroshi Teshigahara","Takeshi Kitano","William Wyler","Aleksandr Sokurov","Kamila Andini","Satyajit Ray","Anders Thomas Jensen",
    ,"Fernando Fernán Gómez","Luchino Visconti",
]

const modoAltoLapiz = [
    "Alfred Hitchcock","Akira Kurosawa", "Ingmar Bergman", "Jia Zhangke","Stanley Kubrick","Takashi Miike","Billy Wilder",
    "Jean-Luc Godard","Francis Ford Coppola", "Martin Scorsese", "Clint Eastwood", "Brian De Palma","David Lynch",,"Michael Mann",
    "Ridley Scott", "Hayao Miyazaki", "Aki Kaurismäki","Terrence Malick", "Pedro Almodóvar","Steven Spielberg","Lars von Trier",
    "Sofia Coppola","Luca Guadagnino","Paul Thomas Anderson","Wong Kar-wai","Wes Anderson","Denis Villeneuve","Joel Coen",
    "Yorgos Lanthimos","M. Night Shyamalan","Éric Rohmer","Guy Ritchie","Woody Allen","Zack Snyder","Joachim Trier","Jonathan Glazer",
    "Charlie Chaplin","Yasujirō Ozu","Ernst Lubitsch","Agnès Varda","Luis Buñuel","Orson Wells","Robert Bresson",
]

const modoGeografia = [
    "Japón", "China", "Brasil", "Argentina", "Chile", "México", "Canadá", "Mediterráneo","Asia Oriental","Sudeste Asiático","Asia Meridional","Asia Occidental",
    "Francia", "Italia", "España", "Dinamarca", "Suecia", "Noruega", "Islandia", "Norteamérica","América del Sur", "Escandinavia",
    "Alemania", "Holanda", "Polonia", "Rusia", "Turquía", "Grecia", 
    "Rumania", "Hong Kong", "Corea del Sur", "Taiwán", "Tailandia", "Vietnam", 
    "India", "Filipinas", "Indonesia", "Irán","Centroeuropa","Europa del este",
]

const categoriaRegiones = [
    "Centroeuropa","Europa del este","Mediterráneo","Asia Oriental","Sudeste Asiático","Asia Meridional","Asia Occidental","Norteamérica","América del Sur", "Escandinavia"
]

const categoriaPaises = [
    "Japón", "China", "Brasil", "Argentina", "Chile", "México", "Canadá", 
    "Francia", "Italia", "España", "Dinamarca", "Suecia", "Noruega", "Islandia", 
    "Alemania", "Bélgica", "Holanda", "Polonia", "Rusia", "Turquía", "Grecia", 
    "Rumania", "Hong Kong", "Corea del Sur", "Taiwán", "Tailandia", "Vietnam", 
    "India", "Filipinas", "Indonesia", "Irán"
];

const regiones = {
    "Centroeuropa": [
        "DE", "HU", "SK", "BE", "CZ", "GB", "NL", "LU", "AT", "PL", "FR", "CS" // CS : Checoslovaquia
    ],
    "Europa del este": [
        "RU", "SU", "RO", "UA", "BA", "BY", "LV", "LT", "EE", "MD", "GE", "HR", "SI", "RS", "ME", "MK", "XK" // SU : URSS
    ],
    "Escandinavia": [
        "SE", "NO", "FL", "IS", "DK"
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
        "IR", "IL", "PS", "SA", "YE", "OM", "QA", "AE", "BH", "KW", "JO", "AM", "AZ", "SY", "LB", "IQ"
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
    "Japón": ["JP"],"China": ["CN"],"Brasil": ["BR"],"Argentina": ["AR"],"Chile": ["CL"],"México": ["MX"],"Canadá": ["CA"],"Francia": ["FR"],"Italia": ["IT"],"España": ["ES"],"Dinamarca": ["DK"],"Suecia": ["SE"],"Noruega": ["NO"],"Islandia": ["IS"],"Alemania": ["DE"],"República Checa": ["CZ", "CS"],"Holanda": ["NL"],"Polonia": ["PL"],"Rusia": ["RU", "SU"],"Turquía": ["TR"],"Grecia": ["GR"],"Rumanía": ["RO"],"Hong Kong": ["HK"],"Corea del Sur": ["KR"],"Taiwán": ["TW"],"Tailandia": ["TH"],"Vietnam": ["VN"],"India": ["IN"],"Filipinas": ["PH"],"Indonesia": ["ID"],"Irán": ["IR"]
};