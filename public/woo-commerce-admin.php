<?php
/**
 * Administration Com' entre nous -> WooCommerce /commerce/.
 * Connexion séparée de l'ancien WooCommerce. Aucune vente ni paiement activés ici.
 * Configuration privée : ../woo-commerce-write-private.php (hors racine publique).
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, no-store');
header('X-Robots-Tag: noindex, nofollow');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function authorized(): bool {
    $auth = (string)($_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (!preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) return false;
    $token = trim($m[1]);
    if (strlen($token) < 16 || !function_exists('curl_init')) return false;
    // Vérification du jeton GitHub de l'admin ; ne jamais envoyer les clés Woo au navigateur.
    $ch = curl_init('https://api.github.com/repos/vartcom38-collab/comentre-nous-site/contents/content/products.json?ref=main');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true, CURLOPT_CONNECTTIMEOUT => 6, CURLOPT_TIMEOUT => 12,
        CURLOPT_HTTPHEADER => [
            'Accept: application/vnd.github+json',
            'Authorization: Bearer ' . $token,
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: comentrenous-commerce-admin',
        ],
    ]);
    curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $status === 200;
}
if (!authorized()) respond(401, ['ok' => false, 'error' => 'Connexion administrateur requise']);

$configFile = dirname(__DIR__) . '/woo-commerce-write-private.php';
if (!is_file($configFile)) respond(503, ['ok'=>false,'error'=>'Clés d’administration du nouveau WooCommerce non configurées']);
$config = require $configFile;
$base = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($base !== 'https://comentrenous.marionbolomey.fr/commerce' || !$key || !$secret) {
    respond(503, ['ok'=>false,'error'=>'Configuration privée du nouveau WooCommerce incomplète']);
}
function wc(string $base, string $key, string $secret, string $route, string $method='GET', ?array $payload=null): array {
    $ch = curl_init($base . $route);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER=>true, CURLOPT_CONNECTTIMEOUT=>8, CURLOPT_TIMEOUT=>25,
        CURLOPT_HTTPAUTH=>CURLAUTH_BASIC, CURLOPT_USERPWD=>$key . ':' . $secret,
        CURLOPT_HTTPHEADER=>['Accept: application/json','Content-Type: application/json'],
        CURLOPT_CUSTOMREQUEST=>$method, CURLOPT_FOLLOWLOCATION=>false,
    ]);
    if ($payload !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    $raw = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    $data = is_string($raw) ? json_decode($raw, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($data)) {
        respond(502, ['ok'=>false,'error'=>'WooCommerce /commerce/ ne répond pas correctement','upstream_status'=>$status]);
    }
    return $data;
}
function meta(array $p, string $name): string {
    foreach (($p['meta_data'] ?? []) as $item) {
        if (($item['key'] ?? '') === $name) return (string)($item['value'] ?? '');
    }
    return '';
}
function safeProduct(array $p): array {
    return [
        'id'=>(int)($p['id'] ?? 0), 'name'=>(string)($p['name'] ?? ''),
        'status'=>(string)($p['status'] ?? ''), 'price'=>(string)($p['price'] ?? ''),
        'managed'=>meta($p,'_comentre_managed') === '1',
        'managed_local_id'=>meta($p,'_comentre_local_id'),
    ];
}
function cleanPrice($raw): string {
    $str = preg_replace('/[^0-9.]/','',str_replace([',','€',' '],['.','',''],(string)$raw));
    return $str === '' || !is_numeric($str) ? '' : number_format((float)$str,2,'.','');
}
function inputPayload(array $data): array {
    $p = [
        'name'=>trim((string)($data['name'] ?? '')),
        'description'=>(string)($data['description'] ?? ''),
        'short_description'=>(string)($data['short_description'] ?? ''),
        'featured'=>(bool)($data['featured'] ?? false),
        // Verrou de pré-lancement : aucun produit synchronisé n'est publiable par cette passerelle.
        'status'=>'draft',
    ];
    if (!empty($data['slug'])) $p['slug'] = trim((string)$data['slug']);
    if (!empty($data['sku'])) $p['sku'] = trim((string)$data['sku']);
    if (isset($data['regular_price'])) {
        $price = cleanPrice($data['regular_price']);
        if ($price !== '') $p['regular_price'] = $price;
    }
    if (!empty($data['stock_status']) && in_array($data['stock_status'], ['instock','outofstock','onbackorder'], true)) {
        $p['stock_status'] = $data['stock_status'];
    }
    if (isset($data['stock_quantity']) && $data['stock_quantity'] !== null) {
        $p['manage_stock'] = true;
        $p['stock_quantity'] = max(0,(int)$data['stock_quantity']);
    }
    $digital = ($data['delivery_type'] ?? '') === 'digital';
    $p['virtual'] = $digital;
    $p['downloadable'] = $digital;
    // Aucun lien de PDF n'est transféré tant que le stockage privé et les accès clients ne sont pas validés.
    if (!empty($data['image']) && filter_var($data['image'], FILTER_VALIDATE_URL)) $p['images'] = [['src'=>$data['image']]];
    return $p;
}
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = (string)($_GET['action'] ?? '');
if ($method === 'GET' && $action === 'products') {
    $list = wc($base,$key,$secret,'/wp-json/wc/v3/products?status=any&per_page=100');
    respond(200,['ok'=>true,'products'=>array_map('safeProduct',$list),'store'=>'commerce']);
}
if ($method === 'GET' && $action === 'ping') respond(200,['ok'=>true,'store'=>'commerce','write_ready'=>true,'launch_locked'=>true]);
if ($method !== 'POST' || !in_array($action,['create-product','update-managed-product'],true)) {
    respond(405,['ok'=>false,'error'=>'Action non autorisée']);
}
$input = json_decode(file_get_contents('php://input') ?: '{}',true);
if (!is_array($input)) respond(400,['ok'=>false,'error'=>'Données invalides']);
$localId = trim((string)($input['local_id'] ?? ''));
if ($localId === '' || strlen($localId)>200) respond(400,['ok'=>false,'error'=>'Identifiant local requis']);
if ($action === 'create-product') {
    $payload = inputPayload($input);
    if ($payload['name'] === '' || $payload['name'] === 'Nouveau produit') {
        respond(400,['ok'=>false,'error'=>'Nom du produit requis']);
    }
    // Empêcher la duplication lors des doubles déclenchements de scripts d’administration.
    $list = wc($base,$key,$secret,'/wp-json/wc/v3/products?status=any&per_page=100');
    foreach ($list as $p) {
        if (is_array($p) && meta($p,'_comentre_managed')==='1' && meta($p,'_comentre_local_id')===$localId) {
            respond(200,['ok'=>true,'created'=>false,'product'=>safeProduct($p)]);
        }
    }
    $payload['meta_data'] = [
        ['key'=>'_comentre_managed','value'=>'1'],
        ['key'=>'_comentre_local_id','value'=>$localId],
    ];
    $new = wc($base,$key,$secret,'/wp-json/wc/v3/products','POST',$payload);
    respond(200,['ok'=>true,'created'=>true,'product'=>safeProduct($new)]);
}
$id = (int)($input['id'] ?? 0);
if ($id <= 0) respond(400,['ok'=>false,'error'=>'Identifiant WooCommerce invalide']);
$current = wc($base,$key,$secret,'/wp-json/wc/v3/products/'.$id);
if (meta($current,'_comentre_managed')!=='1' || meta($current,'_comentre_local_id')!==$localId) {
    respond(409,['ok'=>false,'error'=>'Produit WooCommerce non géré par cette administration. Modification bloquée.']);
}
$updated = wc($base,$key,$secret,'/wp-json/wc/v3/products/'.$id,'PUT',inputPayload($input));
respond(200,['ok'=>true,'product'=>safeProduct($updated)]);
