<?php
require_once './config/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // WARNING: Be specific in production

$type = $_GET['type'] ?? null;
$difficulty = $_GET['difficulty'] ?? null; // Used for filtering directores, paises, regiones

if (!$type) {
    http_response_code(400);
    echo json_encode(['error' => 'Parameter "type" is required.']);
    exit;
}

// Map requested type to the corresponding table name and select columns
$tableName = '';
$selectColumns = 'id, nombre, descripcion'; // Default columns to select
$joinClause = ''; // For joins (like director_genero)

switch ($type) {
    case 'director':
        $tableName = 'directores';
        $selectColumns .= ', tmdb_id, difficulty';
        // If you want genres included with directors, join director_genero and generos
        // This makes the query more complex and might return duplicate director rows
        // if they have multiple genres. A better approach is to fetch genres separately
        // or fetch director IDs and then a separate query for their genres.
        // Let's stick to fetching just director data here, and fetch genres separately in JS.
        break;
    case 'criterio':
        $tableName = 'criterios';
        break;
    case 'genero':
        $tableName = 'generos';
        break;
    case 'pais':
        $tableName = 'paises';
        $selectColumns .= ', iso_codes, difficulty';
        break;
    case 'region':
        $tableName = 'regiones';
        $selectColumns .= ', iso_codes, difficulty';
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid type parameter. Allowed types: director, criterio, genero, pais, region']);
        exit;
}

$sql = "SELECT " . $selectColumns . " FROM " . $tableName;
$params = [];
$whereClauses = [];

// Add difficulty filter if applicable
if ($difficulty && in_array($type, ['director', 'pais', 'region'])) {
    if ($difficulty !== 'total') {
         // For a specific difficulty, get only rows matching that difficulty level.
         $whereClauses[] = "difficulty = :difficulty";
         $params[':difficulty'] = $difficulty;
    }
    // If difficulty is 'total', we select all rows of that type, including NULL difficulty.
}

// Combine WHERE clauses
if (!empty($whereClauses)) {
    $sql .= " WHERE " . implode(" AND ", $whereClauses);
}

$sql .= " ORDER BY nombre ASC"; // Optional: order for consistency

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add 'tipo' field and decode JSON for relevant types before sending
    foreach ($results as &$row) {
        $row['tipo'] = $type;
         // Decode iso_codes JSON string into a PHP array
         if (isset($row['iso_codes']) && is_string($row['iso_codes'])) {
             $row['iso_codes'] = json_decode($row['iso_codes'], true);
         }
         // Ensure iso_codes is always an array in the output, even if NULL or empty in DB
         if (!isset($row['iso_codes']) || !is_array($row['iso_codes'])) {
             $row['iso_codes'] = [];
         }

         // For directors, fetch their genres
         if ($type === 'director') {
             $stmtGenres = $pdo->prepare("
                 SELECT g.nombre
                 FROM director_genero dg
                 JOIN generos g ON dg.genero_id = g.id
                 WHERE dg.director_id = :director_id
             ");
             $stmtGenres->execute([':director_id' => $row['id']]);
             $row['generos'] = $stmtGenres->fetchAll(PDO::FETCH_COLUMN); // Fetch only the genre names
         }
    }
    unset($row); // Unset reference after loop

    echo json_encode($results);

} catch (PDOException $e) {
    error_log("Database error in get_categories.php: " . $e->getMessage() . " SQL: " . $sql . " Params: " . json_encode($params));
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar datos del servidor.', 'details' => $e->getMessage()]);
}