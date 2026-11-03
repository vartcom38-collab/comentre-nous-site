<?php
// Diagnostic temporaire, en lecture seule, du WooCommerce officiel /commerce/.
// Aucun secret ni détail de commande n'est affiché. Retirer après vérification.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');
function result(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
$configFile = dirname(__DIR__) . '/woo-commerce-private.php';
if (!is_file($configFile)) result(503, ['ok' => false, 'stage' => 'config_missing']);
$config = require $configFile;
$base = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($base !== 'https://comentrenous.marionbolomey.fr/commerce' || $key === '' || $secret === '') {
    result(503, ['ok' => false, 'stage' => 'config_invalid']);
}
if (!function_exists('curl_init')) result(503, ['ok' => false, 'stage' => 'curl_missing']);
$ch = curl_init($base . '/wp-json/wc/v3/products?per_page=1&status=draft');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
    CURLOPT_USERPWD => $key . ':' . $secret,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
    CURLOPT_CONNECTTIMEOUT => 7,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_FOLLOWLOCATION => false,
]);
$raw = curl_exec($ch);
$http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
$data = is_string($raw) ? json_decode($raw, true) : null;
$ok = $http === 200 && is_array($data) && array_is_list($data);
result($ok ? 200 : 502, [
    'ok' => $ok,
    'stage' => $ok ? 'connected' : 'api_error',
    'http_status' => $http,
    'draft_products_returned' => $ok ? count($data) : null,
]);
