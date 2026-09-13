<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$configPath = dirname(__DIR__) . '/woo-private.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'WooCommerce configuration not found']);
    exit;
}

$config = require $configPath;
$baseUrl = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');

if (!$baseUrl || !$key || !$secret) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'WooCommerce configuration incomplete']);
    exit;
}

$action = $_GET['action'] ?? 'ping';
if (!in_array($action, ['ping', 'products'], true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown action']);
    exit;
}

$endpoint = $action === 'products'
    ? '/wp-json/wc/v3/products?status=publish&per_page=100'
    : '/wp-json/wc/v3/system_status';

$ch = curl_init($baseUrl . $endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_CONNECTTIMEOUT => 8,
    CURLOPT_USERPWD => $key . ':' . $secret,
    CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
    CURLOPT_HTTPHEADER => ['Accept: application/json'],
]);

$body = curl_exec($ch);
$httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($body === false || $error) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'WooCommerce connection failed']);
    exit;
}

$data = json_decode($body, true);
if ($httpCode < 200 || $httpCode >= 300) {
    http_response_code(502);
    echo json_encode([
        'ok' => false,
        'error' => 'WooCommerce API returned an error',
        'status' => $httpCode,
        'details' => is_array($data) ? ($data['message'] ?? null) : null,
    ]);
    exit;
}

if ($action === 'ping') {
    echo json_encode([
        'ok' => true,
        'message' => 'WooCommerce connecté',
        'store' => $baseUrl,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$products = [];
foreach ((array)$data as $product) {
    $products[] = [
        'id' => $product['id'] ?? null,
        'name' => $product['name'] ?? '',
        'slug' => $product['slug'] ?? '',
        'status' => $product['status'] ?? '',
        'price' => $product['price'] ?? '',
        'regular_price' => $product['regular_price'] ?? '',
        'sale_price' => $product['sale_price'] ?? '',
        'stock_status' => $product['stock_status'] ?? '',
        'stock_quantity' => $product['stock_quantity'] ?? null,
        'featured' => (bool)($product['featured'] ?? false),
        'permalink' => $product['permalink'] ?? '',
        'images' => array_map(static function ($image) {
            return [
                'id' => $image['id'] ?? null,
                'src' => $image['src'] ?? '',
                'alt' => $image['alt'] ?? '',
            ];
        }, (array)($product['images'] ?? [])),
        'categories' => array_map(static function ($category) {
            return [
                'id' => $category['id'] ?? null,
                'name' => $category['name'] ?? '',
                'slug' => $category['slug'] ?? '',
            ];
        }, (array)($product['categories'] ?? [])),
        'meta_data' => $product['meta_data'] ?? [],
    ];
}

echo json_encode([
    'ok' => true,
    'count' => count($products),
    'products' => $products,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
