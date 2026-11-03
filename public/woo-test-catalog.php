<?php
/**
 * Aperçu public en lecture seule du NOUVEAU WooCommerce.
 * N'expose pas les brouillons, fichiers téléchargeables, clés, commandes, ni comptes.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');

$configPath = dirname(__DIR__) . '/woo-test-private.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Configuration de test indisponible']);
    exit;
}
$config = require $configPath;
$base = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($base !== 'https://boutique-test.marionbolomey.fr' || !$key || !$secret) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Configuration de test incomplète']);
    exit;
}
if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Connexion serveur indisponible']);
    exit;
}
function testWooGet(string $base, string $key, string $secret, string $path): ?array {
    $ch = curl_init($base . $path);
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
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status !== 200 || !is_string($raw)) return null;
    $data = json_decode($raw, true);
    return is_array($data) && array_is_list($data) ? $data : null;
}
$published = testWooGet($base, $key, $secret, '/wp-json/wc/v3/products?status=publish&per_page=50');
$drafts = testWooGet($base, $key, $secret, '/wp-json/wc/v3/products?status=draft&per_page=50');
if ($published === null || $drafts === null) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Catalogue de test indisponible']);
    exit;
}
$products = [];
foreach ($published as $p) {
    if (!is_array($p)) continue;
    $images = is_array($p['images'] ?? null) ? $p['images'] : [];
    $categories = is_array($p['categories'] ?? null) ? $p['categories'] : [];
    $products[] = [
        'id' => (int)($p['id'] ?? 0),
        'name' => (string)($p['name'] ?? ''),
        'price' => (string)($p['price'] ?? ''),
        'downloadable' => (bool)($p['downloadable'] ?? false),
        'image' => (string)($images[0]['src'] ?? ''),
        'categories' => array_values(array_map(static function ($c) {
            return (string)($c['name'] ?? '');
        }, $categories)),
    ];
}
echo json_encode([
    'ok' => true,
    'store' => 'boutique-test',
    'published_count' => count($products),
    'draft_count' => count($drafts),
    'counts_limited_to_50' => true,
    'products' => $products,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
