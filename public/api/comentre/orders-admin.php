<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';
requireAdmin($config);

if ($_SERVER['REQUEST_METHOD'] !== 'GET') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);

$status = cleanText($_GET['status'] ?? '', 40);
$params = [];
$sql = 'SELECT id, order_number, customer_email, customer_first_name, customer_last_name, customer_phone, shipping_address1, shipping_address2, shipping_postal_code, shipping_city, shipping_region, shipping_country, shipping_country_code, shipping_method, shipping_amount, subtotal_amount, total_amount, currency, status, payment_status, fulfillment_owner, carrier, tracking_number, tracking_url, customer_note, internal_note, created_at, updated_at, shipped_at FROM orders WHERE fulfillment_owner = ?';
$params[] = 'aurelie';
if ($status !== '') {
    $sql .= ' AND status = ?';
    $params[] = $status;
}
$sql .= ' ORDER BY created_at DESC LIMIT 200';
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

if ($orders) {
    $ids = array_map(fn($o) => (int)$o['id'], $orders);
    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $itemStmt = $pdo->prepare("SELECT order_id, product_id, product_title, sku, quantity, unit_price, line_total FROM order_items WHERE order_id IN ($placeholders) ORDER BY id ASC");
    $itemStmt->execute($ids);
    $itemsByOrder = [];
    foreach ($itemStmt->fetchAll() as $item) $itemsByOrder[(int)$item['order_id']][] = $item;
    foreach ($orders as &$order) $order['items'] = $itemsByOrder[(int)$order['id']] ?? [];
    unset($order);
}

respond(['ok' => true, 'orders' => $orders]);
