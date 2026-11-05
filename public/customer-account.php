<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
ini_set('session.use_strict_mode', '1');
session_name('COMENTRECLIENT');
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

function localCustomerPayload(int $id): ?array {
    if (!class_exists('WC_Customer')) return null;
    try {
        $customer = new WC_Customer($id);
        if (!$customer->get_id()) return null;
        $address = static function (string $kind) use ($customer): array {
            $out = [];
            foreach (['first_name','last_name','address_1','address_2','postcode','city','country'] as $field) {
                $getter = 'get_' . $kind . '_' . $field;
                $out[$field] = method_exists($customer, $getter) ? (string)$customer->$getter() : '';
            }
            return $out;
        };
        return customerPayload([
            'id' => $id,
            'email' => (string)$customer->get_email(),
            'first_name' => (string)$customer->get_first_name(),
            'last_name' => (string)$customer->get_last_name(),
            'billing' => $address('billing'),
            'shipping' => $address('shipping'),
        ]);
    } catch (Throwable $e) { return null; }
}

function sessionToken(): string {
    if (empty($_SESSION['customer_csrf'])) $_SESSION['customer_csrf'] = bin2hex(random_bytes(24));
    return (string)$_SESSION['customer_csrf'];
}

function verifyCustomerWrite(): void {
    $token = (string)($_SERVER['HTTP_X_COMENTRE_CSRF'] ?? '');
    if ($token === '' || !hash_equals(sessionToken(), $token)) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => 'Session de sécurité expirée. Actualise ton espace puis réessaie.']);
        exit;
    }
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
    $customer = localCustomerPayload($wordpressUserId);
    if (!$customer || strtolower((string)$customer['email']) !== $email) {
        http_response_code(401);
        echo json_encode(['ok' => false, 'error' => 'Compte client indisponible.']);
        exit;
    }
    session_regenerate_id(true);
    $_SESSION['customer_id'] = $wordpressUserId;
    $_SESSION['customer_email'] = $email;
    echo json_encode(['ok' => true, 'authenticated' => true, 'customer' => $customer, 'csrf' => sessionToken()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (is_file($wpLoader)) require_once $wpLoader;
    $id = (int)($_SESSION['customer_id'] ?? 0);
    if ($id <= 0) {
        echo json_encode(['ok' => true, 'authenticated' => false]);
        exit;
    }
    $wpUser = function_exists('get_user_by') ? get_user_by('id', $id) : false;
    if (!$wpUser || !in_array('customer', (array)$wpUser->roles, true)
        || strtolower((string)$wpUser->user_email) !== (string)($_SESSION['customer_email'] ?? '')) {
        $_SESSION = [];
        echo json_encode(['ok' => true, 'authenticated' => false]);
        exit;
    }
    // Ne dépend plus des appels REST WooCommerce, qui renvoyaient parfois HTTP 401.
    $customer = localCustomerPayload($id);
    if (!$customer) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Connexion temporairement indisponible.']);
        exit;
    }
    echo json_encode(['ok' => true, 'authenticated' => true, 'customer' => $customer, 'csrf' => sessionToken()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}


if ($action === 'request-email-change' && $method === 'POST') {
    $loader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($loader)) { http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Boutique indisponible.']); exit; }
    require_once $loader;
    $id = requireCustomer();
    verifyCustomerWrite();
    $data = bodyJson();
    $email = isset($data['new_email']) && is_string($data['new_email']) ? strtolower(trim($data['new_email'])) : '';
    $password = $data['current_password'] ?? null;
    $user = get_user_by('id', $id);
    if (!is_email($email) || strlen($email)>190 || !is_string($password) || !$user) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Adresse e-mail ou mot de passe invalide.']); exit;
    }
    if ($email === strtolower($user->user_email)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Cette adresse est déjà utilisée pour ton compte.']); exit;
    }
    $tries = array_values(array_filter((array)($_SESSION['email_change_tries'] ?? []), static function($t){ return is_numeric($t) && $t > time()-900; }));
    if (count($tries)>=5) { http_response_code(429); echo json_encode(['ok'=>false,'error'=>'Trop de tentatives. Réessaie dans 15 minutes.']); exit; }
    if (!wp_check_password($password, $user->user_pass, $id)) {
        $tries[] = time(); $_SESSION['email_change_tries'] = $tries;
        http_response_code(403); echo json_encode(['ok'=>false,'error'=>'Mot de passe actuel incorrect.']); exit;
    }
    if (email_exists($email)) { http_response_code(409); echo json_encode(['ok'=>false,'error'=>'Cette adresse est déjà associée à un compte.']); exit; }
    $pending = get_user_meta($id, '_comentre_email_pending', true);
    if (is_array($pending) && ($pending['created'] ?? 0) > time()-120) {
        http_response_code(429); echo json_encode(['ok'=>false,'error'=>'Attends deux minutes avant de renvoyer un lien.']); exit;
    }
    $token = bin2hex(random_bytes(32));
    update_user_meta($id, '_comentre_email_pending', ['email'=>$email, 'hash'=>hash('sha256',$token), 'old'=>$user->user_email,'created'=>time()]);
    $link = 'https://comentrenous.marionbolomey.fr/mon-espace/#confirmer-email=' . $id . '.' . $token;
    $mail = "Bonjour,\n\nPour confirmer ta nouvelle adresse e-mail Com’ entre nous, ouvre ce lien :\n" . $link
        . "\n\nLe lien est valable 30 minutes. Si tu n'as rien demandé, ignore cet e-mail.\n\nCom’ entre nous";
    if (!wp_mail($email,'Confirme ta nouvelle adresse — Com’ entre nous',$mail,['Content-Type: text/plain; charset=UTF-8'])) {
        delete_user_meta($id, '_comentre_email_pending');
        http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Impossible d’envoyer la confirmation pour le moment.']); exit;
    }
    echo json_encode(['ok'=>true,'message'=>'Un lien de confirmation a été envoyé à la nouvelle adresse.']); exit;
}

if ($action === 'confirm-email-change' && $method === 'POST') {
    $loader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($loader)) { http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Boutique indisponible.']); exit; }
    require_once $loader;
    $data = bodyJson();
    $id = filter_var($data['customer_id'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]);
    $token = $data['token'] ?? null;
    if (!$id || !is_string($token) || !preg_match('/^[a-f0-9]{64}$/', $token)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Lien invalide.']); exit;
    }
    $user = get_user_by('id',$id);
    $pending = get_user_meta($id,'_comentre_email_pending',true);
    if (!$user || !in_array('customer',(array)$user->roles,true) || !is_array($pending)
        || !hash_equals((string)($pending['hash'] ?? ''),hash('sha256',$token))
        || (int)($pending['created'] ?? 0) < time()-1800
        || strtolower($user->user_email) !== strtolower((string)($pending['old'] ?? ''))) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Lien expiré ou déjà utilisé.']); exit;
    }
    $new = (string)($pending['email'] ?? '');
    if (!is_email($new) || email_exists($new)) {
        http_response_code(409); echo json_encode(['ok'=>false,'error'=>'Cette adresse n’est plus disponible.']); exit;
    }
    $old = $user->user_email;
    $updated = wp_update_user(['ID'=>$id,'user_email'=>$new]);
    if (is_wp_error($updated)) {
        http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Impossible de modifier l’adresse pour le moment.']); exit;
    }
    delete_user_meta($id,'_comentre_email_pending');
    // Les commandes et permissions restent liées à l'ID client, pas à l'ancien e-mail.
    try { $c = new WC_Customer($id); $c->set_billing_email($new); $c->save(); } catch (Throwable $e) {}
    if ((int)($_SESSION['customer_id'] ?? 0) === $id) {
        $_SESSION['customer_email'] = strtolower($new);
        session_regenerate_id(true);
    }
    wp_mail($old,'Changement d’adresse — Com’ entre nous',
        "Bonjour,\n\nL’adresse e-mail de ton compte Com’ entre nous a été modifiée. Si tu n’es pas à l’origine de ce changement, contacte-nous.\n\nCom’ entre nous",
        ['Content-Type: text/plain; charset=UTF-8']);
    echo json_encode(['ok'=>true,'message'=>'Ta nouvelle adresse est confirmée. Tous tes achats restent associés au même compte.']); exit;
}

if ($action === 'change-password' && $method === 'POST') {
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Boutique indisponible.']);
        exit;
    }
    require_once $wpLoader;
    $id = requireCustomer();
    verifyCustomerWrite();

    // Limite les tentatives de validation de l'ancien mot de passe dans la session.
    $attempts = (array)($_SESSION['password_change_attempts'] ?? []);
    $attempts = array_values(array_filter($attempts, static function ($timestamp) {
        return is_numeric($timestamp) && (int)$timestamp > time() - 900;
    }));
    if (count($attempts) >= 5) {
        http_response_code(429);
        echo json_encode(['ok'=>false,'error'=>'Trop de tentatives. Réessaie dans 15 minutes.']);
        exit;
    }

    $input = bodyJson();
    $current = $input['current_password'] ?? null;
    $new = $input['new_password'] ?? null;
    $confirm = $input['confirm_password'] ?? null;
    if (!is_string($current) || !is_string($new) || !is_string($confirm) ||
        $current === '' || strlen($new) < 12 || strlen($new) > 256 || $new !== $confirm) {
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Vérifie ton ancien mot de passe et choisis un nouveau mot de passe de 12 caractères minimum, confirmé à l’identique.']);
        exit;
    }
    $wpUser = get_user_by('id', $id);
    if (!$wpUser || !in_array('customer', (array)$wpUser->roles, true)) {
        http_response_code(401);
        echo json_encode(['ok'=>false,'error'=>'Connexion requise.']);
        exit;
    }
    if (!wp_check_password($current, (string)$wpUser->user_pass, $id)) {
        $attempts[] = time();
        $_SESSION['password_change_attempts'] = $attempts;
        http_response_code(403);
        echo json_encode(['ok'=>false,'error'=>'Le mot de passe actuel est incorrect.']);
        exit;
    }
    if (wp_check_password($new, (string)$wpUser->user_pass, $id)) {
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Le nouveau mot de passe doit être différent de l’ancien.']);
        exit;
    }

    wp_set_password($new, $id);
    // Exige une nouvelle connexion après rotation des identifiants.
    $_SESSION = [];
    session_regenerate_id(true);
    echo json_encode(['ok'=>true,'reauthenticate'=>true,'message'=>'Ton mot de passe est modifié. Connecte-toi avec le nouveau mot de passe.']);
    exit;
}

if ($action === 'update-profile' && $method === 'POST') {
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Boutique indisponible.']);
        exit;
    }
    require_once $wpLoader;
    $id = requireCustomer();
    verifyCustomerWrite();
    $input = bodyJson();
    $firstName = $input['first_name'] ?? null;
    $lastName = $input['last_name'] ?? null;
    if (!is_string($firstName) || !is_string($lastName) ||
        trim($firstName) === '' || trim($lastName) === '' ||
        mb_strlen($firstName) > 100 || mb_strlen($lastName) > 100) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Renseigne un prénom et un nom valides.']);
        exit;
    }
    try {
        $customer = new WC_Customer($id);
        if ((int)$customer->get_id() !== $id) throw new RuntimeException('Compte introuvable');
        $customer->set_first_name(sanitize_text_field($firstName));
        $customer->set_last_name(sanitize_text_field($lastName));
        $customer->save();
        echo json_encode(['ok' => true, 'customer' => localCustomerPayload($id)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Impossible de modifier les informations du compte.']);
    }
    exit;
}

if ($action === 'update-address' && $method === 'POST') {
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) {
        http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Boutique indisponible.']); exit;
    }
    require_once $wpLoader;
    $id = requireCustomer();
    verifyCustomerWrite();
    $input = bodyJson();
    $kind = (string)($input['kind'] ?? '');
    if (!in_array($kind, ['billing', 'shipping'], true)) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Type d’adresse invalide.']); exit;
    }
    $fields = (array)($input['address'] ?? []);
    $allowed = ['first_name','last_name','address_1','address_2','postcode','city','country'];
    foreach ($allowed as $field) {
        if (!isset($fields[$field]) || !is_string($fields[$field]) || mb_strlen($fields[$field]) > 160) {
            http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Vérifie les champs de ton adresse.']); exit;
        }
    }
    if (trim($fields['first_name']) === '' || trim($fields['last_name']) === '' ||
        trim($fields['address_1']) === '' || trim($fields['postcode']) === '' ||
        trim($fields['city']) === '' || !preg_match('/^[A-Z]{2}$/', $fields['country'])) {
        http_response_code(400); echo json_encode(['ok'=>false,'error'=>'Complète les champs obligatoires de ton adresse.']); exit;
    }
    try {
        $customer = new WC_Customer($id);
        if ((int)$customer->get_id() !== $id) throw new RuntimeException('Compte introuvable');
        foreach ($allowed as $field) {
            $setter = 'set_' . $kind . '_' . $field;
            if (method_exists($customer, $setter)) $customer->$setter(sanitize_text_field($fields[$field]));
        }
        $customer->save();
        echo json_encode(['ok'=>true,'customer'=>localCustomerPayload($id)], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Impossible d’enregistrer l’adresse pour le moment.']);
    }
    exit;
}


/**
 * Liste des cartes enregistrées : ne renvoie jamais les jetons du prestataire.
 * Seules les quatre dernières positions et l'échéance sont exposées.
 */
if ($action === 'payment-methods' && $method === 'GET') {
    $loader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($loader)) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Boutique indisponible.']);
        exit;
    }
    require_once $loader;
    $id = requireCustomer();
    if (!class_exists('WC_Payment_Tokens')) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Les moyens de paiement sont momentanément indisponibles.']);
        exit;
    }
    try {
        $tokens = WC_Payment_Tokens::get_customer_tokens($id);
        $methods = [];
        foreach ($tokens as $token) {
            if (!($token instanceof WC_Payment_Token) || (int)$token->get_user_id() !== $id) continue;
            if (!($token instanceof WC_Payment_Token_CC)) continue;
            $methods[] = [
                'id' => (int)$token->get_id(),
                'brand' => (string)$token->get_card_type(),
                'last4' => (string)$token->get_last4(),
                'expiry_month' => (string)$token->get_expiry_month(),
                'expiry_year' => (string)$token->get_expiry_year(),
                'is_default' => (bool)$token->get_is_default(),
            ];
        }
        echo json_encode(['ok'=>true,'payment_methods'=>$methods],JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Impossible de récupérer tes moyens de paiement pour le moment.']);
    }
    exit;
}

if ($action === 'payment-method-action' && $method === 'POST') {
    $loader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($loader)) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Boutique indisponible.']);
        exit;
    }
    require_once $loader;
    $id = requireCustomer();
    verifyCustomerWrite();
    $input = bodyJson();
    $tokenId = filter_var($input['token_id'] ?? null, FILTER_VALIDATE_INT, ['options'=>['min_range'=>1]]);
    $operation = $input['operation'] ?? null;
    if (!$tokenId || !in_array($operation, ['delete','make-default'], true)) {
        http_response_code(400);
        echo json_encode(['ok'=>false,'error'=>'Action invalide.']);
        exit;
    }
    if (!class_exists('WC_Payment_Tokens')) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Les moyens de paiement sont momentanément indisponibles.']);
        exit;
    }
    try {
        $token = WC_Payment_Tokens::get($tokenId);
        if (!($token instanceof WC_Payment_Token_CC) || (int)$token->get_user_id() !== $id) {
            http_response_code(404);
            echo json_encode(['ok'=>false,'error'=>'Ce moyen de paiement est introuvable.']);
            exit;
        }
        if ($operation === 'delete') {
            WC_Payment_Tokens::delete($tokenId);
        } else {
            WC_Payment_Tokens::set_users_default($id, $tokenId);
        }
        echo json_encode(['ok'=>true]);
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['ok'=>false,'error'=>'Impossible de modifier ce moyen de paiement pour le moment.']);
    }
    exit;
}

if ($action === 'orders' && $method === 'GET') {
    // La boutique WooCommerce est installée sur ce même serveur :
    // lecture locale des commandes, sans authentification REST externe (HTTP 401).
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Boutique indisponible.']);
        exit;
    }
    require_once $wpLoader;
    $id = requireCustomer();
    if (!function_exists('wc_get_orders')) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'WooCommerce indisponible.']);
        exit;
    }
    try {
        $wooOrders = wc_get_orders([
            'customer_id' => $id,
            'limit' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
            'return' => 'objects',
        ]);
        $orders = [];
        foreach ($wooOrders as $order) {
            if (!($order instanceof WC_Order) || (int)$order->get_customer_id() !== $id) continue;
            $items = [];
            foreach ($order->get_items('line_item') as $item) {
                $items[] = [
                    'name' => (string)$item->get_name(),
                    'quantity' => (int)$item->get_quantity(),
                    'total' => (string)$item->get_total(),
                ];
            }
            $created = $order->get_date_created();
            $orders[] = [
                'id' => (int)$order->get_id(),
                'number' => (string)$order->get_order_number(),
                'status' => (string)$order->get_status(),
                'date_created' => $created ? $created->date('c') : '',
                'total' => (string)$order->get_total(),
                'currency' => (string)$order->get_currency(),
                'items' => $items,
            ];
        }
        echo json_encode(['ok' => true, 'orders' => $orders], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Impossible de lire les commandes pour le moment.']);
    }
    exit;
}

if ($action === 'downloads' && $method === 'GET') {
    $wpLoader = __DIR__ . '/commerce/wp-load.php';
    if (!is_file($wpLoader)) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Boutique indisponible.']);
        exit;
    }
    require_once $wpLoader;
    $id = requireCustomer();
    if (!function_exists('wc_get_customer_available_downloads')) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'WooCommerce indisponible.']);
        exit;
    }
    try {
        $available = wc_get_customer_available_downloads($id);
        $downloads = [];
        foreach ((array)$available as $item) {
            if (!is_array($item)) continue;
            $downloads[] = [
                'download_name' => (string)($item['download_name'] ?? ''),
                'product_name' => (string)($item['product_name'] ?? ''),
                'download_url' => (string)($item['download_url'] ?? ''),
                'downloads_remaining' => $item['downloads_remaining'] ?? '',
                'access_expires' => (string)($item['access_expires'] ?? ''),
            ];
        }
        echo json_encode(['ok' => true, 'downloads' => $downloads], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } catch (Throwable $e) {
        http_response_code(503);
        echo json_encode(['ok' => false, 'error' => 'Impossible de lire les téléchargements pour le moment.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Action non disponible.']);
