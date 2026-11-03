<?php
// Diagnostic en lecture seule de la NOUVELLE boutique WooCommerce.
// Les identifiants restent dans woo-test-private.php, hors du dossier public.
// À retirer après le test.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');
$configFile = dirname(__DIR__) . '/woo-test-private.php';
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['ok'=>false,'stage'=>'config_missing','message'=>'Configuration de test non installée']);
    exit;
}
$config = require $configFile;
$base = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($base !== 'https://boutique-test.marionbolomey.fr' || $key === '' || $secret === '') {
    http_response_code(503);
    echo json_encode(['ok'=>false,'stage'=>'config_invalid','message'=>'Configuration de test incomplète']);
    exit;
}
if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['ok'=>false,'stage'=>'curl_missing']);
    exit;
}
$ch = curl_init($base . '/wp-json/wc/v3/products?per_page=1&status=draft');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_HTTPAUTH=>CURLAUTH_BASIC,
    CURLOPT_USERPWD=>$key . ':' . $secret,
    CURLOPT_HTTPHEADER=>['Accept: application/json'],
    CURLOPT_CONNECTTIMEOUT=>7,
    CURLOPT_TIMEOUT=>15,
    CURLOPT_FOLLOWLOCATION=>false,
]);
$raw = curl_exec($ch);
$http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$decoded = is_string($raw) ? json_decode($raw, true) : null;
$ok = $http === 200 && is_array($decoded) && array_is_list($decoded);
http_response_code($ok ? 200 : 502);
echo json_encode([
    'ok'=>$ok,
    'stage'=>$ok ? 'connected' : 'api_error',
    'http_status'=>$http,
    'draft_products_returned'=>$ok ? count($decoded) : null,
], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
