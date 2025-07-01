<?php
$host = 'localhost';
$dbname = 'cine_grid';
$user = 'root';
$pass = '';

/* $host = 'sql211.infinityfree.com';
$dbname = 'if0_39213987_cine_grid';
$user = 'if0_39213987';
$pass = 'vtlXbaHVqUizB'; */

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Conexión fallida: " . $e->getMessage());
}