<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
$data = jsonBody();
$orderNumber = cleanText($data['orderNumber'] ?? '', 40);
$email = cleanEmail($data['email'] ?? '');
if ($orderNumber === '') respond(['ok' => false, 'error' => 'invalid_order_number'], 422);

$stmt = $pdo->prepare('SELECT order_number, order_status AS status, carrier, tracking_number, tracking_url, created_at, shipped_at, delivered_at FROM orders WHERE order_number = ? AND customer_email = ? LIMIT 1');
$stmt->execute([$orderNumber,$email]);
$order = $stmt->fetch();
if (!$order) respond(['ok' => false, 'error' => 'order_not_found'], 404);

respond(['ok' => true, 'order' => $order]);
