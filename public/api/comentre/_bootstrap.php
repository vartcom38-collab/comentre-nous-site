<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(array $payload, int $status = 200): never {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$runtimePath = __DIR__ . '/_runtime.php';
if (!is_file($runtimePath)) {
    respond(['ok' => false, 'error' => 'setup_required'], 503);
}

$config = require $runtimePath;

foreach (['db_host','db_port','db_name','db_user','db_password','admin_key'] as $required) {
    if (empty($config[$required])) respond(['ok' => false, 'error' => 'setup_required'], 503);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $allowed = $config['allowed_origins'] ?? [];
    if (!in_array($origin, $allowed, true)) respond(['ok' => false, 'error' => 'origin_forbidden'], 403);
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
    exit;
}

try {
    $dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4', $config['db_host'], (int)$config['db_port'], $config['db_name']);
    $pdo = new PDO($dsn, $config['db_user'], $config['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (Throwable $e) {
    respond(['ok' => false, 'error' => 'database_unavailable'], 503);
}

function jsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    if (!is_array($data)) respond(['ok' => false, 'error' => 'invalid_json'], 400);
    return $data;
}

function requireAdmin(array $config): void {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $expected = 'Bearer ' . $config['admin_key'];
    if (!hash_equals($expected, $auth)) respond(['ok' => false, 'error' => 'unauthorized'], 401);
}

function cleanText(mixed $value, int $max = 255): string {
    $value = trim((string)$value);
    return mb_substr($value, 0, $max);
}

function cleanEmail(mixed $value): string {
    $value = trim((string)$value);
    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) respond(['ok' => false, 'error' => 'invalid_email'], 422);
    return mb_strtolower($value);
}
