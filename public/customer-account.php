<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
ini_set('session.use_strict_mode', '1');
session_set_cookie_params([
    'lifetime' => 60 * 60 * 24 * 7,
    'path' => '/',
    'secure' => $isHttps,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

$configPath = dirname(__DIR__) . '/woo-private.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration de la boutique indisponible.']);
    exit;
}

$config = require $configPath;
$baseUrl = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if (!$baseUrl || !$key || !$secret) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration de la boutique incomplète.']);
    exit;
}

function bodyJson(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '{}', true);
    return is_array($data) ? $data : [];
}

function wooApi(string $baseUrl, string $key, string $secret, string $endpoint, string $method = 'GET', ?array $payload = null): array {
    $ch = curl_init($baseUrl . $endpoint);
    $headers = ['Accept: application/json', 'Content-Type: application/json'];
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_USERPWD => $key . ':' . $secret,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_CUSTOMREQUEST => $method,
    ];
    if ($payload !== null) $options[CURLOPT_POSTFIELDS] = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    curl_setopt_array($ch, $options);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    if ($body === false || $error) return ['ok' => false, 'status' => 502, 'data' => null];
    $data = json_decode($body, true);
    return ['ok' => $status >= 200 && $status < 300, 'status' => $status, 'data' => $data];
}

function verifyWordPressLogin(string $baseUrl, string $email, string $password): bool {
    $headers = [];
    $ch = curl_init($baseUrl . '/wp-login.php');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'log' => $email,
            'pwd' => $password,
            'wp-submit' => 'Se connecter',
            'redirect_to' => $baseUrl . '/wp-admin/profile.php',
            'testcookie' => '1',
        ]),
        CURLOPT_COOKIE => 'wordpress_test_cookie=WP%20Cookie%20check',
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HEADERFUNCTION => static function ($curl, $line) use (&$headers) {
            $headers[] = trim($line);
            return strlen($line);
        },
        CURLOPT_USERAGENT => 'ComEntreNous-CustomerAccount/1.0',
    ]);
    curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status < 200 || $status >= 400) return false;
    foreach ($headers as $line) {
        if (stripos($line, 'Set-Cookie:') === 0 && stripos($line, 'wordpress_logged_in_') !== false) return true;
    }
    return false;
}

function customerPayload(array $customer): array {
    return [
        'id' => (int)($customer['id'] ?? 0),
        'email' => (string)($customer['email'] ?? ''),
        'first_name' => (string)($customer['first_name'] ?? ''),
        'last_name' => (string)($customer['last_name'] ?? ''),
        'display_name' => trim(((string)($customer['first_name'] ?? '')) . ' ' . ((string)($customer['last_name'] ?? ''))),
        'billing' => [
            'first_name' => (string)($customer['billing']['first_name'] ?? ''),
            'last_name' => (string)($customer['billing']['last_name'] ?? ''),
            'address_1' => (string)($customer['billing']['address_1'] ?? ''),
            'address_2' => (string)($customer['billing']['address_2'] ?? ''),
            'postcode' => (string)($customer['billing']['postcode'] ?? ''),
            'city' => (string)($customer['billing']['city'] ?? ''),
            'country' => (string)($customer['billing']['country'] ?? ''),
        ],
        'shipping' => [
            'first_name' => (string)($customer['shipping']['first_name'] ?? ''),
            'last_name' => (string)($customer['shipping']['last_name'] ?? ''),
            'address_1' => (string)($customer['shipping']['address_1'] ?? ''),
            'address_2' => (string)($customer['shipping']['address_2'] ?? ''),
            'postcode' => (string)($customer['shipping']['postcode'] ?? ''),
            'city' => (string)($customer['shipping']['city'] ?? ''),
            'country' => (string)($customer['shipping']['country'] ?? ''),
        ],
    ];
}

function requireCustomer(): int {
    $id = (int)($_SESSION['customer_id'] ?? 0);
    if ($id <= 0) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'authenticated' => false, 'error' => 'Connexion requise.']);
        exit;
    }
    return $id;
}

function orderProof(array $input, string $baseUrl, string $key, string $secret): array {
    $orderId = (int)($input['order_id'] ?? 0);
    $orderKey = trim((string)($input['order_key'] ?? ''));
    $email = strtolower(trim((string)($input['email'] ?? '')));
    if ($orderId <= 0 || $orderKey === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Informations de commande incomplètes.']);
        exit;
    }
    $result = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/orders/' . $orderId);
    if (!$result['ok'] || !is_array($result['data'])) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Commande introuvable.']);
        exit;
    }
    $order = (array)$result['data'];
    $storedKey = (string)($order['order_key'] ?? '');
    $billingEmail = strtolower(trim((string)($order['billing']['email'] ?? '')));
    if ($storedKey === '' || !hash_equals($storedKey, $orderKey) || $billingEmail !== $email) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Impossible de vérifier cette commande.']);
        exit;
    }
    if (in_array((string)($order['status'] ?? ''), ['cancelled', 'failed', 'refunded', 'trash'], true)) {
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' => 'Cette commande ne peut pas créer de compte client.']);
        exit;
    }
    return [$order, $email];
}

$action = (string)($_GET['action'] ?? 'session');
$method = (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($action === 'provision-from-order' && $method === 'POST') {
    $input = bodyJson();
    [$order, $email] = orderProof($input, $baseUrl, $key, $secret);
    $customerId = (int)($order['customer_id'] ?? 0);
    $created = false;

    if ($customerId <= 0) {
        $lookup = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers?email=' . rawurlencode($email) . '&per_page=1');
        if ($lookup['ok'] && is_array($lookup['data']) && !empty($lookup['data'][0]['id'])) {
            $customerId = (int)$lookup['data'][0]['id'];
        } else {
            $billing = (array)($order['billing'] ?? []);
            $shipping = (array)($order['shipping'] ?? []);
            $temporaryPassword = bin2hex(random_bytes(20));
            $create = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers', 'POST', [
                'email' => $email,
                'first_name' => (string)($billing['first_name'] ?? ''),
                'last_name' => (string)($billing['last_name'] ?? ''),
                'password' => $temporaryPassword,
                'billing' => $billing,
                'shipping' => $shipping,
                'meta_data' => [
                    ['key' => '_comentre_auto_created', 'value' => '1'],
                    ['key' => '_comentre_first_order_id', 'value' => (string)($order['id'] ?? '')],
                ],
            ]);
            if (!$create['ok'] || empty($create['data']['id'])) {
                http_response_code(502);
                echo json_encode(['ok' => false, 'error' => 'Impossible de créer le compte client pour le moment.']);
                exit;
            }
            $customerId = (int)$create['data']['id'];
            $created = true;
        }

        $linkOrder = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/orders/' . (int)$order['id'], 'PUT', ['customer_id' => $customerId]);
        if (!$linkOrder['ok']) {
            http_response_code(502);
            echo json_encode(['ok' => false, 'error' => 'Le compte existe, mais la commande n’a pas pu être rattachée.']);
            exit;
        }
    }

    echo json_encode([
        'ok' => true,
        'created' => $created,
        'customer_id' => $customerId,
        'needs_password_setup' => true,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($action === 'set-first-password' && $method === 'POST') {
    $input = bodyJson();
    [$order, $email] = orderProof($input, $baseUrl, $key, $secret);
    $password = (string)($input['password'] ?? '');
    if (strlen($password) < 10) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Choisis un mot de passe d’au moins 10 caractères.']);
        exit;
    }
    $customerId = (int)($order['customer_id'] ?? 0);
    if ($customerId <= 0) {
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' => 'Le compte client doit d’abord être créé.']);
        exit;
    }
    $customer = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $customerId);
    if (!$customer['ok'] || strtolower((string)($customer['data']['email'] ?? '')) !== $email) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Ce compte ne correspond pas à la commande.']);
        exit;
    }
    $updated = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $customerId, 'PUT', [
        'password' => $password,
        'meta_data' => [
            ['key' => '_comentre_password_ready', 'value' => '1'],
        ],
    ]);
    if (!$updated['ok']) {
        http_response_code(502);
        echo json_encode(['ok' => false, 'error' => 'Impossible d’enregistrer le mot de passe pour le moment.']);
        exit;
    }
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $customerId;
    $_SESSION['customer_email'] = $email;
    echo json_encode(['ok' => true, 'authenticated' => true, 'customer' => customerPayload((array)$updated['data'])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($action === 'login' && $method === 'POST') {
    $input = bodyJson();
    $email = strtolower(trim((string)($input['email'] ?? '')));
    $password = (string)($input['password'] ?? '');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'E-mail et mot de passe requis.']);
        exit;
    }
    if (!verifyWordPressLogin($baseUrl, $email, $password)) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'E-mail ou mot de passe incorrect.']);
        exit;
    }
    $lookup = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers?email=' . rawurlencode($email) . '&per_page=1');
    if (!$lookup['ok'] || !is_array($lookup['data']) || empty($lookup['data'][0]['id'])) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Compte client introuvable pour cette adresse e-mail.']);
        exit;
    }
    $customer = (array)$lookup['data'][0];
    session_regenerate_id(true);
    $_SESSION['customer_id'] = (int)$customer['id'];
    $_SESSION['customer_email'] = $email;
    echo json_encode(['ok' => true, 'authenticated' => true, 'customer' => customerPayload($customer)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($action === 'logout' && $method === 'POST') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', (bool)$params['secure'], (bool)$params['httponly']);
    }
    session_destroy();
    echo json_encode(['ok' => true, 'authenticated' => false]);
    exit;
}

if ($action === 'session' && $method === 'GET') {
    $id = (int)($_SESSION['customer_id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['ok' => true, 'authenticated' => false]);
        exit;
    }
    $result = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $id);
    if (!$result['ok'] || !is_array($result['data'])) {
        $_SESSION = [];
        echo json_encode(['ok' => true, 'authenticated' => false]);
        exit;
    }
    echo json_encode(['ok' => true, 'authenticated' => true, 'customer' => customerPayload((array)$result['data'])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($action === 'orders' && $method === 'GET') {
    $id = requireCustomer();
    $result = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/orders?customer=' . $id . '&per_page=50&orderby=date&order=desc');
    if (!$result['ok'] || !is_array($result['data'])) {
        http_response_code(502);
        echo json_encode(['ok' => false, 'error' => 'Impossible de charger les commandes pour le moment.']);
        exit;
    }
    $orders = array_map(static function ($order) {
        $items = array_map(static function ($item) {
            return [
                'name' => (string)($item['name'] ?? ''),
                'quantity' => (int)($item['quantity'] ?? 0),
                'total' => (string)($item['total'] ?? ''),
            ];
        }, (array)($order['line_items'] ?? []));
        return [
            'id' => (int)($order['id'] ?? 0),
            'number' => (string)($order['number'] ?? ''),
            'status' => (string)($order['status'] ?? ''),
            'date_created' => (string)($order['date_created'] ?? ''),
            'total' => (string)($order['total'] ?? ''),
            'currency' => (string)($order['currency'] ?? 'EUR'),
            'items' => $items,
        ];
    }, $result['data']);
    echo json_encode(['ok' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($action === 'downloads' && $method === 'GET') {
    $id = requireCustomer();
    $result = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $id . '/downloads');
    if (!$result['ok'] || !is_array($result['data'])) {
        echo json_encode(['ok' => true, 'downloads' => []]);
        exit;
    }
    $downloads = array_map(static function ($item) {
        return [
            'download_name' => (string)($item['download_name'] ?? ''),
            'product_name' => (string)($item['product_name'] ?? ''),
            'download_url' => (string)($item['download_url'] ?? ''),
            'downloads_remaining' => $item['downloads_remaining'] ?? '',
            'access_expires' => (string)($item['access_expires'] ?? ''),
        ];
    }, $result['data']);
    echo json_encode(['ok' => true, 'downloads' => $downloads], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Action non disponible.']);
