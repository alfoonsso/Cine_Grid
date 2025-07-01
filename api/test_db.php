<?php
require_once './config/db.php';

echo "Conexión exitosa a la base de datos.";

// Intenta listar las tablas
try {
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<br>Tablas en la base de datos:<br>";
    if (count($tables) > 0) {
        foreach ($tables as $table) {
            echo "- $table<br>";
        }
    } else {
        echo "No hay tablas en la base de datos.";
    }
} catch (PDOException $e) {
    echo "<br>Error al listar tablas: " . $e->getMessage();
}