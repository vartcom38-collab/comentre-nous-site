<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

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

function jsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function wooRequest(string $baseUrl, string $key, string $secret, string $endpoint, string $method = 'GET', ?array $payload = null): array {
    $ch = curl_init($baseUrl . $endpoint);
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 25,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_USERPWD => $key . ':' . $secret,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_HTTPHEADER => ['Accept: application/json', 'Content-Type: application/json'],
        CURLOPT_CUSTOMREQUEST => $method,
    ];
    if ($payload !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
    curl_setopt_array($ch, $options);
    $body = curl_exec($ch);
    $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);

    if ($body === false || $error) {
        return ['ok' => false, 'status' => 502, 'error' => 'WooCommerce connection failed'];
    }
    $data = json_decode($body, true);
    if ($httpCode < 200 || $httpCode >= 300) {
        return [
            'ok' => false,
            'status' => $httpCode,
            'error' => 'WooCommerce API returned an error',
            'details' => is_array($data) ? ($data['message'] ?? null) : null,
        ];
    }
    return ['ok' => true, 'status' => $httpCode, 'data' => $data];
}

function githubTokenIsAllowed(string $token): bool {
    if (!$token) return false;
    $ch = curl_init('https://api.github.com/repos/vartcom38-collab/comentre-nous-site/contents/content/products.json?ref=main');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_HTTPHEADER => [
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
            'Authorization: Bearer ' . $token,
            'User-Agent: comentrenous-woo-bridge',
        ],
    ]);
    curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $status >= 200 && $status < 300;
}

function authToken(): string {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    return preg_match('/^Bearer\s+(.+)$/i', $auth, $matches) ? trim($matches[1]) : '';
}

function cleanPrice($value): string {
    $raw = str_replace(['€', ' ', ','], ['', '', '.'], (string)$value);
    $raw = preg_replace('/[^0-9.]/', '', $raw);
    if ($raw === '' || !is_numeric($raw)) return '';
    return number_format((float)$raw, 2, '.', '');
}

function findMeta(array $product, string $keyName): ?string {
    foreach ((array)($product['meta_data'] ?? []) as $meta) {
        if (($meta['key'] ?? '') === $keyName) return (string)($meta['value'] ?? '');
    }
    return null;
}

function sanitizeProduct(array $product): array {
    return [
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
        'sku' => $product['sku'] ?? '',
        'virtual' => (bool)($product['virtual'] ?? false),
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
        'managed_local_id' => findMeta($product, '_comentre_local_id'),
        'managed' => findMeta($product, '_comentre_managed') === '1',
    ];
}

function payloadFromInput(array $input, bool $forCreate = false): array {
    $payload = [];
    if (array_key_exists('name', $input)) $payload['name'] = trim((string)$input['name']);
    if (array_key_exists('slug', $input) && trim((string)$input['slug']) !== '') $payload['slug'] = trim((string)$input['slug']);
    if (array_key_exists('short_description', $input)) $payload['short_description'] = (string)$input['short_description'];
    if (array_key_exists('description', $input)) $payload['description'] = (string)$input['description'];
    if (array_key_exists('sku', $input)) $payload['sku'] = trim((string)$input['sku']);
    if (array_key_exists('featured', $input)) $payload['featured'] = (bool)$input['featured'];
    if (array_key_exists('status', $input) && in_array($input['status'], ['publish', 'draft', 'private'], true)) $payload['status'] = $input['status'];
    elseif ($forCreate) $payload['status'] = 'draft';

    if (array_key_exists('regular_price', $input)) {
        $price = cleanPrice($input['regular_price']);
        if ($price !== '') $payload['regular_price'] = $price;
    }
    if (array_key_exists('sale_price', $input)) {
        $salePrice = cleanPrice($input['sale_price']);
        $payload['sale_price'] = $salePrice;
    }
    if (array_key_exists('stock_status', $input) && in_array($input['stock_status'], ['instock', 'outofstock', 'onbackorder'], true)) {
        $payload['stock_status'] = $input['stock_status'];
    }
    if (array_key_exists('stock_quantity', $input)) {
        $payload['manage_stock'] = true;
        $payload['stock_quantity'] = max(0, (int)$input['stock_quantity']);
    }
    if (array_key_exists('delivery_type', $input)) {
        $isDigital = $input['delivery_type'] === 'digital';
        $payload['virtual'] = $isDigital;
        $payload['downloadable'] = $isDigital;
    }
    if (!empty($input['image']) && preg_match('#^https?://#i', (string)$input['image'])) {
        $payload['images'] = [['src' => (string)$input['image']]];
    }
    return $payload;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? 'ping';

if ($method === 'GET') {
    if (!in_array($action, ['ping', 'products'], true)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Unknown action']);
        exit;
    }

    $endpoint = $action === 'products'
        ? '/wp-json/wc/v3/products?status=any&per_page=100'
        : '/wp-json/wc/v3/system_status';
    $result = wooRequest($baseUrl, $key, $secret, $endpoint);
    if (!$result['ok']) {
        http_response_code(502);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
    foreach ((array)$result['data'] as $product) $products[] = sanitizeProduct((array)$product);
    echo json_encode(['ok' => true, 'count' => count($products), 'products' => $products], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($method === 'POST') {
    $token = authToken();
    if (!githubTokenIsAllowed($token)) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Admin authentication failed']);
        exit;
    }

    $input = jsonBody();

    if ($action === 'create-product') {
        $localId = trim((string)($input['local_id'] ?? ''));
        $name = trim((string)($input['name'] ?? ''));
        if ($localId === '' || $name === '' || $name === 'Nouveau produit') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Nom du produit requis avant création WooCommerce']);
            exit;
        }

        // Idempotence: if a managed product already exists for this local id, return it instead of duplicating it.
        $lookup = wooRequest($baseUrl, $key, $secret, '/wp-json/wc/v3/products?status=any&per_page=100');
        if ($lookup['ok']) {
            foreach ((array)$lookup['data'] as $existing) {
                $existing = (array)$existing;
                if (findMeta($existing, '_comentre_local_id') === $localId && findMeta($existing, '_comentre_managed') === '1') {
                    echo json_encode(['ok' => true, 'created' => false, 'product' => sanitizeProduct($existing)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                    exit;
                }
            }
        }

        $payload = payloadFromInput($input, true);
        $payload['meta_data'] = [
            ['key' => '_comentre_local_id', 'value' => $localId],
            ['key' => '_comentre_managed', 'value' => '1'],
        ];
        $result = wooRequest($baseUrl, $key, $secret, '/wp-json/wc/v3/products', 'POST', $payload);
        if (!$result['ok']) {
            http_response_code(502);
            echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
        echo json_encode(['ok' => true, 'created' => true, 'product' => sanitizeProduct((array)$result['data'])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if ($action === 'update-managed-product') {
        $productId = (int)($input['id'] ?? 0);
        $localId = trim((string)($input['local_id'] ?? ''));
        if ($productId <= 0 || $localId === '') {
            http_response_code(400);
            echo json_encode(['ok' => false, 'error' => 'Produit WooCommerce ou fiche locale invalide']);
            exit;
        }

        $current = wooRequest($baseUrl, $key, $secret, '/wp-json/wc/v3/products/' . $productId);
        if (!$current['ok']) {
            http_response_code(502);
            echo json_encode($current, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
        $wooProduct = (array)$current['data'];
        $managedLocalId = findMeta($wooProduct, '_comentre_local_id');
        $managed = findMeta($wooProduct, '_comentre_managed') === '1';
        if (!$managed || $managedLocalId !== $localId) {
            http_response_code(409);
            echo json_encode([
                'ok' => false,
                'error' => 'Cette fiche WooCommerce existait avant la liaison. Synchronisation automatique bloquée pour protéger ses prix.',
                'requires_confirmation' => true,
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }

        $payload = payloadFromInput($input, false);
        if (!$payload) {
            echo json_encode(['ok' => true, 'product' => sanitizeProduct($wooProduct)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
        $result = wooRequest($baseUrl, $key, $secret, '/wp-json/wc/v3/products/' . $productId, 'PUT', $payload);
        if (!$result['ok']) {
            http_response_code(502);
            echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            exit;
        }
        echo json_encode(['ok' => true, 'product' => sanitizeProduct((array)$result['data'])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Unknown action']);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
