<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
requireAdmin($config);

if (!in_array($_SERVER['REQUEST_METHOD'], ['POST','PATCH'], true)) respond(['ok' => false, 'error' => 'method_not_allowed'], 405);

$data = jsonBody();
$orderNumber = cleanText($data['orderNumber'] ?? '', 40);
$status = cleanText($data['status'] ?? '', 40);
$carrier = cleanText($data['carrier'] ?? '', 100);
$trackingNumber = cleanText($data['trackingNumber'] ?? '', 190);
$trackingUrl = cleanText($data['trackingUrl'] ?? '', 500);
$internalNote = cleanText($data['internalNote'] ?? '', 2000);
$allowedStatuses = ['new','preparing','ready','shipped','delivered','cancelled'];
if ($orderNumber === '' || !in_array($status, $allowedStatuses, true)) respond(['ok' => false, 'error' => 'invalid_update'], 422);

$stmt = $pdo->prepare('SELECT id,order_status FROM orders WHERE order_number = ? AND fulfillment_owner = ? LIMIT 1');
$stmt->execute([$orderNumber,'aurelie']);
$order = $stmt->fetch();
if (!$order) respond(['ok' => false, 'error' => 'order_not_found'], 404);

$shippedAt = $status === 'shipped' ? date('Y-m-d H:i:s') : null;
$deliveredAt = $status === 'delivered' ? date('Y-m-d H:i:s') : null;
$update = $pdo->prepare('UPDATE orders SET order_status=?, carrier=?, tracking_number=?, tracking_url=?, internal_note=?, shipped_at=CASE WHEN ? IS NOT NULL THEN ? ELSE shipped_at END, delivered_at=CASE WHEN ? IS NOT NULL THEN ? ELSE delivered_at END WHERE id=?');
$update->execute([$status,$carrier ?: null,$trackingNumber ?: null,$trackingUrl ?: null,$internalNote ?: null,$shippedAt,$shippedAt,$deliveredAt,$deliveredAt,(int)$order['id']]);
$pdo->prepare('INSERT INTO order_status_history (order_id,status,message,visible_to_customer) VALUES (?,?,?,1)')->execute([(int)$order['id'],$status,$internalNote ?: null]);

respond(['ok' => true, 'orderNumber' => $orderNumber, 'status' => $status]);
