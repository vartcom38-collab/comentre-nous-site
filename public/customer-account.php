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

$configPath = dirname(__DIR__) . '/woo-commerce-write-private.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Configuration de la boutique indisponible.']);
    exit;
}

$config = require $configPath;
$baseUrl = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($baseUrl !== 'https://comentrenous.marionbolomey.fr/commerce' || !$key || !$secret) {
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

/**
 * Vérification directe par WordPress installé sur le même hébergement.
 * L'ancienne méthode contrôlait un cookie de wp-login.php et pouvait
 * rejeter une authentification valide selon les redirections/plugins.
 * Aucun mot de passe n'est conservé ou renvoyé au navigateur.
 */
function verifyWordPressLogin(string $baseUrl, string $email, string $password): int {
    if ($baseUrl !== 'https://comentrenous.marionbolomey.fr/commerce') return 0;
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) return 0;
    require_once $wpLoader;
    if (!function_exists('wp_authenticate')) return 0;
    $user = wp_authenticate($email, $password);
    if (is_wp_error($user) || !($user instanceof WP_User)) return 0;
    if (strtolower((string)$user->user_email) !== strtolower($email)) return 0;
    // Ne pas transformer un compte administrateur WordPress en session cliente.
    if (!in_array('customer', (array)$user->roles, true)) return 0;
    return (int)$user->ID;
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
    if ($id > 0 && function_exists('get_user_by')) {
        $wpUser = get_user_by('id', $id);
        if (!$wpUser || !in_array('customer', (array)$wpUser->roles, true)
            || strtolower((string)$wpUser->user_email) !== (string)($_SESSION['customer_email'] ?? '')) {
            $_SESSION = [];
            $id = 0;
        }
    }
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
    if (!in_array((string)($order['status'] ?? ''), ['processing', 'completed'], true)) {
        http_response_code(409);
        echo json_encode(['ok' => false, 'error' => 'Cette commande ne peut pas créer de compte client.']);
        exit;
    }
    return [$order, $email];
}

$action = (string)($_GET['action'] ?? 'session');
$method = (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');
/* Les comptes sont créés pendant la commande WooCommerce.
 * Aucun lien de commande ne doit pouvoir créer un compte ou réinitialiser un mot de passe.
 * La récupération du mot de passe est gérée par les jetons natifs de WordPress.
 */
if (in_array($action, ['provision-from-order', 'set-first-password'], true)) {
    http_response_code(410);
    echo json_encode(['ok'=>false, 'error'=>'Utilise la connexion ou la récupération du mot de passe depuis Mon espace.']);
    exit;
}


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

    // Pour un client existant, ne jamais proposer de nouvelle création de mot de passe.
    $currentCustomer = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $customerId);
    $autoCreated = false;
    $firstOrderId = '';
    $passwordReady = false;
    foreach ((array)($currentCustomer['data']['meta_data'] ?? []) as $meta) {
        if (($meta['key'] ?? '') === '_comentre_auto_created' && (string)($meta['value'] ?? '') === '1') $autoCreated = true;
        if (($meta['key'] ?? '') === '_comentre_first_order_id') $firstOrderId = (string)($meta['value'] ?? '');
        if (($meta['key'] ?? '') === '_comentre_password_ready' && (string)($meta['value'] ?? '') === '1') $passwordReady = true;
    }
    echo json_encode([
        'ok' => true,
        'created' => $created,
        'needs_password_setup' => $autoCreated && $firstOrderId === (string)$order['id'] && !$passwordReady,
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
    // L’activation par reçu ne doit JAMAIS écraser le mot de passe d’un compte existant.
    // Seul un compte créé automatiquement par ce parcours pour cette commande est éligible.
    $autoCreated = false;
    $firstOrderId = '';
    $passwordReady = false;
    foreach ((array)($customer['data']['meta_data'] ?? []) as $meta) {
        if (($meta['key'] ?? '') === '_comentre_auto_created' && (string)($meta['value'] ?? '') === '1') $autoCreated = true;
        if (($meta['key'] ?? '') === '_comentre_first_order_id') $firstOrderId = (string)($meta['value'] ?? '');
        if (($meta['key'] ?? '') === '_comentre_password_ready' && (string)($meta['value'] ?? '') === '1') $passwordReady = true;
    }
    if (!$autoCreated || $firstOrderId !== (string)$order['id'] || $passwordReady) {
        http_response_code(409);
        echo json_encode(['ok'=>false, 'error'=>'Ce compte existe déjà ou a été activé. Connecte-toi avec ton mot de passe dans Mon espace.']);
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
    $wordpressUserId = verifyWordPressLogin($baseUrl, $email, $password);
    if ($wordpressUserId <= 0) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Connexion impossible. Vérifie tes identifiants ou utilise « Mot de passe oublié ? ».']);
        exit;
    }
    $lookup = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/customers/' . $wordpressUserId);
    if (!$lookup['ok'] || !is_array($lookup['data']) ||
        (int)($lookup['data']['id'] ?? 0) !== $wordpressUserId ||
        strtolower((string)($lookup['data']['email'] ?? '')) !== $email) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Compte client indisponible.']);
        exit;
    }
    $customer = (array)$lookup['data'];
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
    if ($id > 0) {
        $wpLoader = __DIR__ . '/commerce/wp-load.php';
        if (is_file($wpLoader)) require_once $wpLoader;
        $wpUser = function_exists('get_user_by') ? get_user_by('id', $id) : false;
        if (!$wpUser || !in_array('customer', (array)$wpUser->roles, true)
            || strtolower((string)$wpUser->user_email) !== (string)($_SESSION['customer_email'] ?? '')) {
            $_SESSION = [];
            $id = 0;
        }
    }
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
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (is_file($wpLoader)) require_once $wpLoader;
    $id = requireCustomer();
    $result = wooApi($baseUrl, $key, $secret, '/wp-json/wc/v3/orders?customer=' . $id . '&per_page=50&orderby=date&order=desc');
    if (!$result['ok'] || !is_array($result['data'])) {
        // Code HTTP uniquement : utile au diagnostic, sans afficher clés ni données sensibles.
        $upstreamStatus = (int)($result['status'] ?? 0);
        http_response_code(502);
        echo json_encode([
            'ok' => false,
            'error' => 'Impossible de charger les commandes depuis WooCommerce.',
            'diagnostic' => $upstreamStatus > 0 ? 'WooCommerce HTTP ' . $upstreamStatus : 'Connexion API indisponible',
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
