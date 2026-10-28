<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$configPath = dirname(__DIR__) . '/woo-private.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'config_unavailable']);
    exit;
}
$config = require $configPath;
$baseUrl = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if (!$baseUrl || !$key || !$secret) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'config_incomplete']);
    exit;
}

$raw = (string)file_get_contents('php://input');
$signature = trim((string)($_SERVER['HTTP_X_WC_WEBHOOK_SIGNATURE'] ?? ''));
$expected = base64_encode(hash_hmac('sha256', $raw, $secret, true));
if ($signature === '' || !hash_equals($expected, $signature)) {
    http_response_code(401);
    echo json_encode(['ok'=>false,'error'=>'invalid_signature']);
    exit;
}

$order = json_decode($raw, true);
if (!is_array($order)) {
    http_response_code(400);
    echo json_encode(['ok'=>false,'error'=>'invalid_payload']);
    exit;
}

$status = (string)($order['status'] ?? '');
if (!in_array($status, ['processing','completed'], true)) {
    echo json_encode(['ok'=>true,'ignored'=>'status']);
    exit;
}

$orderId = (int)($order['id'] ?? 0);
$email = strtolower(trim((string)($order['billing']['email'] ?? '')));
if ($orderId <= 0 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok'=>true,'ignored'=>'missing_customer']);
    exit;
}

function wooGet(string $baseUrl,string $key,string $secret,string $endpoint): ?array {
    $ch = curl_init($baseUrl . $endpoint);
    curl_setopt_array($ch,[
        CURLOPT_RETURNTRANSFER=>true,
        CURLOPT_TIMEOUT=>15,
        CURLOPT_CONNECTTIMEOUT=>6,
        CURLOPT_USERPWD=>$key . ':' . $secret,
        CURLOPT_HTTPAUTH=>CURLAUTH_BASIC,
        CURLOPT_HTTPHEADER=>['Accept: application/json'],
    ]);
    $body = curl_exec($ch);
    $code = (int)curl_getinfo($ch,CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (!is_string($body) || $code < 200 || $code >= 300) return null;
    $data = json_decode($body,true);
    return is_array($data) ? $data : null;
}

$digitalNames = [];
foreach ((array)($order['line_items'] ?? []) as $item) {
    $productId = (int)($item['product_id'] ?? 0);
    if ($productId <= 0) continue;
    $product = wooGet($baseUrl,$key,$secret,'/wp-json/wc/v3/products/' . $productId);
    if (!is_array($product) || empty($product['downloadable'])) continue;
    $digitalNames[] = trim((string)($item['name'] ?? $product['name'] ?? 'Votre produit numérique'));
}
if (!$digitalNames) {
    echo json_encode(['ok'=>true,'ignored'=>'no_digital_product']);
    exit;
}

$sentDir = __DIR__ . '/private-digital-mail';
if (!is_dir($sentDir)) @mkdir($sentDir,0750,true);
$sentMarker = $sentDir . '/order-' . $orderId . '.sent';
if (is_file($sentMarker)) {
    echo json_encode(['ok'=>true,'ignored'=>'already_sent']);
    exit;
}

$firstName = trim((string)($order['billing']['first_name'] ?? ''));
$hello = $firstName !== '' ? 'Bonjour ' . htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8') . ',' : 'Bonjour,';
$list = '';
foreach ($digitalNames as $name) {
    $list .= '<li style="margin:6px 0;">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</li>';
}
$spaceUrl = 'https://comentrenous.marionbolomey.fr/mon-espace/';
$subject = 'Votre ebook est arrivé dans votre espace Com’ entre nous ♡';

$html = '<!doctype html><html><body style="margin:0;background:#fff8f1;font-family:Arial,sans-serif;color:#171b2a;">'
  . '<div style="max-width:620px;margin:0 auto;padding:34px 18px;">'
  . '<div style="background:#ffffff;border-radius:24px;padding:34px;box-shadow:0 10px 30px rgba(30,20,10,.08);">'
  . '<p style="margin:0 0 8px;color:#ff5d62;font-size:12px;font-weight:700;letter-spacing:.08em;">COM’ ENTRE NOUS</p>'
  . '<h1 style="margin:0 0 20px;font-size:32px;line-height:1.1;">Votre ebook est arrivé ♡</h1>'
  . '<p style="font-size:16px;line-height:1.7;">' . $hello . '</p>'
  . '<p style="font-size:16px;line-height:1.7;">Merci pour votre achat. Votre produit numérique est maintenant disponible dans votre espace client Com’ entre nous.</p>'
  . '<ul style="font-size:15px;line-height:1.6;padding-left:20px;">' . $list . '</ul>'
  . '<p style="margin:26px 0;text-align:center;"><a href="' . $spaceUrl . '" style="display:inline-block;background:#171b2a;color:#fff;text-decoration:none;border-radius:999px;padding:14px 22px;font-weight:700;">Accéder à mon espace →</a></p>'
  . '<p style="font-size:13px;line-height:1.7;color:#656b79;">Dans votre espace, ouvrez la rubrique <strong>Mes téléchargements</strong>. Vous y retrouverez votre PDF ou votre lien de téléchargement.</p>'
  . '<p style="font-size:13px;line-height:1.7;color:#656b79;">À très vite,<br>Marion & Aurélie — Com’ entre nous</p>'
  . '</div></div></body></html>';

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Com entre nous <no-reply@marionbolomey.fr>\r\n";

$sent = @mail($email,$subject,$html,$headers);
if (!$sent) {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'mail_failed']);
    exit;
}
@file_put_contents($sentMarker,date('c'));
echo json_encode(['ok'=>true,'sent'=>true,'order_id'=>$orderId]);
