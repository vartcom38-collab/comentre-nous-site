<?php
declare(strict_types=1);
/**
 * Panier privé de vérification — Com’ entre nous /commerce/.
 * AUCUN paiement, aucune commande, aucun compte créé par cette passerelle.
 * Limité au produit-test WooCommerce #14 et aux collaborateurs GitHub ayant
 * le droit d'écriture sur le dépôt du site.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store, no-cache, max-age=0');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');

function answer(int $status, array $data): void {
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function adminAllowed(): bool {
    $auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (!preg_match('/^Bearer\\s+(\\S+)$/i', $auth, $match)) return false;
    $token = trim($match[1]);
    if (strlen($token) < 16 || !function_exists('curl_init')) return false;
    $ch = curl_init('https://api.github.com/repos/vartcom38-collab/comentre-nous-site');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_HTTPHEADER => [
            'Authorization: Bearer ' . $token,
            'Accept: application/vnd.github+json',
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: comentrenous-private-cart',
        ],
    ]);
    $body = curl_exec($ch);
    $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $json = is_string($body) ? json_decode($body, true) : null;
    return $http === 200 && is_array($json) && !empty($json['permissions']['push']);
}
if (!adminAllowed()) answer(403, ['ok'=>false,'error'=>'Panier test réservé à l’administration']);
$action = (string)($_GET['action'] ?? 'ping');
if ($action === 'ping' && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET') {
    answer(200, ['ok'=>true,'store'=>'commerce','test_only'=>true,'payment_enabled'=>false,'allowed_product_id'=>14]);
}
if (!in_array($action, ['cart','cart-add','cart-update','cart-remove'], true)) {
    answer(405, ['ok'=>false,'error'=>'Action non autorisée']);
}
$method = (string)($_SERVER['REQUEST_METHOD'] ?? 'GET');
if (($action === 'cart' && $method !== 'GET') || ($action !== 'cart' && $method !== 'POST')) {
    answer(405, ['ok'=>false,'error'=>'Méthode non autorisée']);
}
$base = 'https://comentrenous.marionbolomey.fr/commerce';
$cartToken = trim((string)($_SERVER['HTTP_X_CART_TOKEN'] ?? ''));
if ($cartToken !== '' && (!preg_match('/^[A-Za-z0-9._-]{16,2048}$/', $cartToken))) {
    answer(400, ['ok'=>false,'error'=>'Jeton panier invalide']);
}
function storeCart(string $base, string $route, string $method='GET', ?array $payload=null, string $token=''): array {
    $headers = ['Accept: application/json','Content-Type: application/json'];
    if ($token !== '') $headers[] = 'Cart-Token: ' . $token;
    $responseHeaders = [];
    $ch = curl_init($base . '/wp-json/wc/store/v1/' . $route);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 7, CURLOPT_TIMEOUT => 20,
        CURLOPT_FOLLOWLOCATION => false, CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_HEADERFUNCTION => static function ($curl, $header) use (&$responseHeaders) {
            $parts=explode(':', $header, 2);
            if (count($parts)===2) $responseHeaders[strtolower(trim($parts[0]))]=trim($parts[1]);
            return strlen($header);
        },
    ]);
    if ($payload !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }
    $raw = curl_exec($ch);
    $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    $nextToken = (string)($responseHeaders['cart-token'] ?? $token);
    return ['ok'=>$http>=200 && $http<300 && is_array($data), 'status'=>$http, 'cart'=>$data, 'cart_token'=>$nextToken];
}
$input = [];
if ($method === 'POST') {
    $input = json_decode((string)file_get_contents('php://input'), true);
    if (!is_array($input)) answer(400,['ok'=>false,'error'=>'Données invalides']);
}
if ($action === 'cart') {
    $result = storeCart($base, 'cart', 'GET', null, $cartToken);
} else {
    // La Store API utilise son Cart-Token pour la session (aucune commande créée).
    if ($cartToken === '') {
        $initial = storeCart($base, 'cart');
        if (!$initial['ok'] || $initial['cart_token'] === '') {
            answer(502, ['ok'=>false,'error'=>'Impossible d’initialiser le panier du nouveau WooCommerce']);
        }
        $cartToken = $initial['cart_token'];
    }
    if ($action === 'cart-add') {
        $id = (int)($input['id'] ?? 0);
        if ($id !== 14) answer(403,['ok'=>false,'error'=>'Seul l’ebook test n° 14 est autorisé']);
        $result = storeCart($base, 'cart/add-item','POST',['id'=>14,'quantity'=>1],$cartToken);
    } elseif ($action === 'cart-update') {
        $key = (string)($input['key'] ?? '');
        if (!preg_match('/^[A-Za-z0-9_-]{8,128}$/', $key)) answer(400,['ok'=>false,'error'=>'Ligne du panier invalide']);
        $quantity = min(10,max(1,(int)($input['quantity'] ?? 1)));
        $result = storeCart($base,'cart/update-item','POST',['key'=>$key,'quantity'=>$quantity],$cartToken);
    } else {
        $key = (string)($input['key'] ?? '');
        if (!preg_match('/^[A-Za-z0-9_-]{8,128}$/', $key)) answer(400,['ok'=>false,'error'=>'Ligne du panier invalide']);
        $result = storeCart($base,'cart/remove-item','POST',['key'=>$key],$cartToken);
    }
}
if (!$result['ok']) {
    $message=(string)($result['cart']['message'] ?? 'Le panier test ne répond pas.');
    answer(502,['ok'=>false,'error'=>$message,'upstream_status'=>$result['status']]);
}
answer(200,['ok'=>true,'store'=>'commerce','test_only'=>true,'payment_enabled'=>false,'cart'=>$result['cart'],'cart_token'=>$result['cart_token']]);
