# Cine Grid

Juego de cuadrícula de películas inspirado en "MovieGrid", donde los jugadores deben encontrar películas que cumplan con criterios específicos en una cuadrícula.

## Características

- Búsqueda de películas usando la API de TMDB
- Validación de criterios por género, director, año y características del título
- Diferentes niveles de dificultad

## Configuración del Proyecto

1. Clona el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd cine-grid-v3.2
```

2. Configura las variables de entorno
   - Copia `.env.example` a `.env`
   - Actualiza las variables con tus credenciales:
     - API key de TMDB
     - Credenciales de base de datos

3. Configuración de la Base de Datos
   - Importa el esquema de la base de datos (archivo SQL incluido)
   - Configura las credenciales en el archivo `.env`

## Tecnologías Utilizadas

- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Base de datos: MySQL
- API: TMDB (The Movie Database)

## Autor

[Alfonso Jiménez](https://github.com/alfoonsso)