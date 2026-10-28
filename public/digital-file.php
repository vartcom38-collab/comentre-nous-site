<?php
declare(strict_types=1);

$key = strtolower(trim((string)($_GET['key'] ?? '')));
if (!preg_match('/^[a-f0-9]{48}$/', $key)) {
    http_response_code(404);
    exit('Fichier introuvable');
}

$path = __DIR__ . '/private-digital/' . $key . '.pdf';
if (!is_file($path)) {
    http_response_code(404);
    exit('Fichier introuvable');
}

$name = trim((string)($_GET['name'] ?? 'telechargement.pdf'));
$name = preg_replace('/[^\pL\pN._ -]+/u', '-', $name) ?: 'telechargement.pdf';
if (!preg_match('/\.pdf$/i', $name)) $name .= '.pdf';

header('Content-Type: application/pdf');
header('Content-Length: ' . filesize($path));
header('Content-Disposition: attachment; filename="' . str_replace('"', '', $name) . '"');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: private, no-store, max-age=0');
readfile($path);
