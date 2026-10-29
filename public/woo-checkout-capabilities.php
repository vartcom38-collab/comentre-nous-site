<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$configPath = dirname(__DIR__) . '/woo-private.php';
if (!is_file($configPath)) { http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Configuration WooCommerce indisponible']); exit; }
$config = require $configPath;
$url = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if (!$url || !$key || !$secret) { http_response_code(503); echo json_encode(['ok'=>false,'error'=>'Configuration WooCommerce incomplète']); exit; }
$ch = curl_init($url . '/wp-json/wc/v3/payment_gateways');
curl_setopt_array($ch, [
 CURLOPT_RETURNTRANSFER=>true,
 CURLOPT_CONNECTTIMEOUT=>8,
 CURLOPT_TIMEOUT=>20,
 CURLOPT_HTTPAUTH=>CURLAUTH_BASIC,
 CURLOPT_USERPWD=>$key . ':' . $secret,
 CURLOPT_HTTPHEADER=>['Accept: application/json'],
]);
$body = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
if (!is_string($body) || $status < 200 || $status >= 300) { http_response_code(502); echo json_encode(['ok'=>false,'error'=>'Vérification des moyens de paiement indisponible']); exit; }
$data = json_decode($body, true);
if (!is_array($data)) { http_response_code(502); echo json_encode(['ok'=>false,'error'=>'Réponse WooCommerce invalide']); exit; }
$gateways = [];
foreach ($data as $gateway) {
 if (!is_array($gateway)) continue;
 $id = (string)($gateway['id'] ?? '');
 if ($id === '') continue;
 $gateways[] = ['id'=>$id,'enabled'=>(bool)($gateway['enabled'] ?? false)];
}
echo json_encode(['ok'=>true,'gateways'=>$gateways],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
