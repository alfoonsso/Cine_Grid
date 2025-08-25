<?php
$isProduction = $_SERVER['HTTP_HOST'] !== 'localhost';

if ($isProduction) {
    $host = getenv('DB_HOST_PROD');
    $dbname = getenv('DB_NAME_PROD');
    $user = getenv('DB_USER_PROD');
    $pass = getenv('DB_PASS_PROD');
} else {
    $host = getenv('DB_HOST_DEV');
    $dbname = getenv('DB_NAME_DEV');
    $user = getenv('DB_USER_DEV');
    $pass = getenv('DB_PASS_DEV');
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Conexión fallida: " . $e->getMessage());
}