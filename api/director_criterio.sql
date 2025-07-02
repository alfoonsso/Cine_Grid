-- Crear la tabla director_criterio si no existe
CREATE TABLE IF NOT EXISTS director_criterio (
    director_id INT NOT NULL,
    criterio_id INT NOT NULL,
    PRIMARY KEY (director_id, criterio_id),
    FOREIGN KEY (director_id) REFERENCES directores(id),
    FOREIGN KEY (criterio_id) REFERENCES criterios(id)
);

-- Crear la tabla director_criterio_pareja si no existe (para exclusiones de parejas de criterios)
CREATE TABLE IF NOT EXISTS director_criterio_pareja (
    director_id INT NOT NULL,
    criterio_id1 INT NOT NULL,
    criterio_id2 INT NOT NULL,
    PRIMARY KEY (director_id, criterio_id1, criterio_id2),
    FOREIGN KEY (director_id) REFERENCES directores(id),
    FOREIGN KEY (criterio_id1) REFERENCES criterios(id),
    FOREIGN KEY (criterio_id2) REFERENCES criterios(id)
);

-- Inserts para exclusiones individuales

-- Título de una palabra (ignorar artículos)
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre IN ('Sergio Leone','Payal Kapadia') AND c.nombre = 'Título de una palabra (ignorar artículos)';

-- Título con 2 palabras
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre = 'Sergio Leone' AND c.nombre = 'Título con 2 palabras';

-- Título con 3 o más palabras
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre IN ('Andrey Zvyagintsev', 'Alex Garland') AND c.nombre = 'Título con 3 o más palabras';

-- Empieza por vocal (ignorar 'The')
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre IN ('Guillermo del Toro', 'Terrence Malick', 'Bi Gan', 'Alfonso Cuarón') 
AND c.nombre = 'Empieza por vocal (ignorar \'The\')';

-- Título empieza con A-H (ignorar 'The')
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre IN ('Joachim Trier', 'Bi Gan') 
AND c.nombre = 'Título empieza con A-H (ignorar \'The\')';

-- Título empieza con Q-Z (ignorar 'A','An')
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre = 'Sergio Leone' AND c.nombre = 'Título empieza con Q-Z (ignorar \'A\',\'An\')';

-- Título de 2h o más de duración
INSERT INTO director_criterio (director_id, criterio_id)
SELECT d.id, c.id FROM directores d, criterios c 
WHERE d.nombre IN ('Wes Anderson', 'Ernst Lubitsch', 'F. W. Murnau', 'Christian Petzold', 
                   'Piotr Szulkin', 'Thomas Vinterberg', 'Paweł Pawlikowski', 'Quentin Dupieux', 
                   'Luis Buñuel', 'Kamila Andini', 'Jonathan Glazer', 'Georges Méliès', 
                   'Karel Zeman', 'Robert Bresson', 'Mario Bava', 'Nicolas Winding Refn', 
                   'Buster Keaton', 'Alex Garland','René Laloux','Walt Disney','Auguste Lumière','Louis Lumière',
                   'Jafar Panahi','Payal Kapadia') 
AND c.nombre = 'Título de 2h o más de duración';

-- Inserts para exclusiones de parejas de criterios

-- Empieza por vocal + Título empieza con Q-Z
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Guillermo del Toro', 'Greta Gerwig')
AND c1.nombre = 'Empieza por vocal (ignorar \'The\')'
AND c2.nombre = 'Título empieza con Q-Z (ignorar \'A\',\'An\')';

-- Empieza por vocal + Título empieza con A-H
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Bi Gan'
AND c1.nombre = 'Empieza por vocal (ignorar \'The\')'
AND c2.nombre = 'Título empieza con A-H (ignorar \'The\')';

-- Empieza por vocal + Título con doble letra
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Hlynur Pálmason'
AND c1.nombre = 'Empieza por vocal (ignorar \'The\')'
AND c2.nombre = 'Título con doble letra (\'rr\', \'ll\'...)';

-- Título con 2 palabras + Título con 3 o más palabras
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Andrey Zvyagintsev'
AND c1.nombre = 'Título con 2 palabras'
AND c2.nombre = 'Título con 3 o más palabras';

-- Título con 2 palabras + Título contiene J,K,W,Z,X,Q
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Andrey Zvyagintsev'
AND c1.nombre = 'Título con 2 palabras'
AND c2.nombre = 'Título contiene J,K,W,Z,X,Q';

-- Título con 3 o más palabras + Título empieza con Q-Z
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Andrey Zvyagintsev', 'Alex Garland')
AND c1.nombre = 'Título con 3 o más palabras'
AND c2.nombre = 'Título empieza con Q-Z (ignorar \'A\',\'An\')';

-- Título con 3 o más palabras + Título empieza con I-P
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Alex Garland'
AND c1.nombre = 'Título con 3 o más palabras'
AND c2.nombre = 'Título empieza con I-P (ignorar \'The\',\'A\',\'An\')';

-- Título con 3 o más palabras + Título contiene J,K,W,Z,X,Q
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Andrey Zvyagintsev'
AND c1.nombre = 'Título con 3 o más palabras'
AND c2.nombre = 'Título contiene J,K,W,Z,X,Q';

-- Título con 3 o más palabras + Título con doble letra
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Andrey Zvyagintsev', 'Alex Garland')
AND c1.nombre = 'Título con 3 o más palabras'
AND c2.nombre = 'Título con doble letra (\'rr\', \'ll\'...)';

-- Título con 3 o más palabras + Título de 2h o más de duración
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre in ('Alex Garland','René Laloux')
AND c1.nombre = 'Título con 3 o más palabras'
AND c2.nombre = 'Título de 2h o más de duración';

-- Título con 2 palabras + Título con doble letra
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Robert Eggers'
AND c1.nombre = 'Título con 2 palabras'
AND c2.nombre = 'Título con doble letra (\'rr\', \'ll\'...)';

-- Título con 2 palabras + Título empieza con Q-Z
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Sergio Leone'
AND c1.nombre = 'Título con 2 palabras'
AND c2.nombre = 'Título empieza con Q-Z (ignorar \'A\',\'An\')';

-- Empieza por vocal + Título de 2h o más de duración
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Jonathan Glazer', 'Quentin Dupieux', 'Hlynur Pálmason','René Laloux')
AND c1.nombre = 'Empieza por vocal (ignorar \'The\')'
AND c2.nombre = 'Título de 2h o más de duración';

-- Título de una palabra + Título con 2 palabras
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Sergio Leone'
AND c1.nombre = 'Título de una palabra (ignorar artículos)'
AND c2.nombre = 'Título con 2 palabras';

-- Título de una palabra + Título empieza con A-H
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Greta Gerwig'
AND c1.nombre = 'Título de una palabra (ignorar artículos)'
AND c2.nombre = 'Título empieza con A-H (ignorar \'The\')';

-- Título de una palabra + Título empieza con Q-Z
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Sergio Leone'
AND c1.nombre = 'Título de una palabra (ignorar artículos)'
AND c2.nombre = 'Título empieza con Q-Z (ignorar \'The\')';

-- Título empieza con A-H + Título contiene J,K,W,Z,X,Q
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Joachim Trier'
AND c1.nombre = 'Título empieza con A-H (ignorar \'The\')'
AND c2.nombre = 'Título contiene J,K,W,Z,X,Q';

-- Título empieza con A-H + Título con doble letra
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre = 'Joachim Trier'
AND c1.nombre = 'Título empieza con A-H (ignorar \'The\')'
AND c2.nombre = 'Título con doble letra (\'rr\', \'ll\'...)';

-- Título empieza con I-P + Título de 2h o más de duración
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Jonathan Glazer', 'Alex Garland')
AND c1.nombre = 'Título empieza con I-P (ignorar \'The\',\'A\',\'An\')'
AND c2.nombre = 'Título de 2h o más de duración';

-- Título empieza con Q-Z + Título de 2h o más de duración
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Robert Bresson', 'Alex Garland')
AND c1.nombre = 'Título empieza con Q-Z (ignorar \'A\',\'An\')'
AND c2.nombre = 'Título de 2h o más de duración';

-- Título con doble letra + Título de 2h o más de duración
INSERT INTO director_criterio_pareja (director_id, criterio_id1, criterio_id2)
SELECT d.id, c1.id, c2.id FROM directores d, criterios c1, criterios c2
WHERE d.nombre IN ('Alex Garland', 'Hlynur Pálmason','René Laloux')
AND c1.nombre = 'Título con doble letra (\'rr\', \'ll\',...)'
AND c2.nombre = 'Título de 2h o más de duración';