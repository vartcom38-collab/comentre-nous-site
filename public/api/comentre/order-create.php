<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);

$catalogPath = __DIR__ . '/papeterie-catalog.json';
if (!is_file($catalogPath)) respond(['ok' => false, 'error' => 'catalog_unavailable'], 503);
$catalog = json_decode((string)file_get_contents($catalogPath), true);
if (!is_array($catalog) || !is_array($catalog['products'] ?? null)) respond(['ok' => false, 'error' => 'catalog_unavailable'], 503);

$data = jsonBody();
$customer = is_array($data['customer'] ?? null) ? $data['customer'] : [];
$address = is_array($data['shippingAddress'] ?? null) ? $data['shippingAddress'] : [];
$items = is_array($data['items'] ?? null) ? $data['items'] : [];
if (!$items || count($items) > 50) respond(['ok' => false, 'error' => 'invalid_items'], 422);

$email = cleanEmail($customer['email'] ?? '');
$firstName = cleanText($customer['firstName'] ?? '', 120);
$lastName = cleanText($customer['lastName'] ?? '', 120);
$phone = cleanText($customer['phone'] ?? '', 50);
$address1 = cleanText($address['address1'] ?? '', 190);
$address2 = cleanText($address['address2'] ?? '', 190);
$postalCode = cleanText($address['postalCode'] ?? '', 30);
$city = cleanText($address['city'] ?? '', 120);
$region = cleanText($address['region'] ?? '', 120);
$country = cleanText($address['country'] ?? 'France', 100);
$shippingMethod = cleanText($data['shippingMethod'] ?? 'standard', 100);
$customerNote = cleanText($data['customerNote'] ?? '', 2000);
$currency = 'EUR';

foreach ([$firstName,$lastName,$address1,$postalCode,$city,$country] as $required) {
    if ($required === '') respond(['ok' => false, 'error' => 'missing_customer_data'], 422);
}

$productMap = [];
foreach ($catalog['products'] as $product) {
    if (is_array($product) && !empty($product['id'])) $productMap[(string)$product['id']] = $product;
}

$subtotalCents = 0;
$normalizedItems = [];
foreach ($items as $item) {
    if (!is_array($item)) respond(['ok' => false, 'error' => 'invalid_item'], 422);
    $productId = cleanText($item['productId'] ?? '', 120);
    $optionId = cleanText($item['optionId'] ?? '', 160);
    $quantity = max(1, min(99, (int)($item['quantity'] ?? 1)));
    $product = $productMap[$productId] ?? null;
    if (!is_array($product) || empty($product['published']) || ($product['paymentOwner'] ?? '') !== 'aurelie' || ($product['paymentChannel'] ?? '') !== 'stripe') {
        respond(['ok' => false, 'error' => 'papeterie_product_not_available'], 422);
    }
    $options = is_array($product['options'] ?? null) ? $product['options'] : [];
    $selected = null;
    if ($optionId !== '') {
        foreach ($options as $option) {
            if (is_array($option) && (string)($option['id'] ?? '') === $optionId) { $selected = $option; break; }
        }
    } elseif (count($options) === 1) {
        $selected = $options[0];
    }
    if (!is_array($selected) || !isset($selected['priceCents']) || ($selected['paymentOwner'] ?? '') !== 'aurelie') {
        respond(['ok' => false, 'error' => 'papeterie_option_not_available'], 422);
    }
    $unitCents = max(0, (int)$selected['priceCents']);
    $lineCents = $unitCents * $quantity;
    $subtotalCents += $lineCents;
    $normalizedItems[] = [
        'productId' => $productId,
        'title' => cleanText($product['title'] ?? '', 255),
        'productType' => cleanText($selected['label'] ?? $selected['kind'] ?? 'Papeterie', 120),
        'quantity' => $quantity,
        'unitPrice' => round($unitCents / 100, 2),
        'lineTotal' => round($lineCents / 100, 2),
    ];
}

$shipping = is_array($catalog['shipping'] ?? null) ? $catalog['shipping'] : [];
$isFrance = in_array(mb_strtolower($country), ['france','fr','français','francaise'], true);
$shippingCents = 0;
if ($shippingMethod === 'pickup') {
    if (empty($shipping['pickupEnabled'])) respond(['ok' => false, 'error' => 'shipping_method_unavailable'], 422);
} else {
    if ($isFrance) {
        if (empty($shipping['franceEnabled'])) respond(['ok' => false, 'error' => 'shipping_country_unavailable'], 422);
        $shippingCents = max(0, (int)($shipping['franceFlatRateCents'] ?? 0));
    } else {
        if (empty($shipping['europeEnabled'])) respond(['ok' => false, 'error' => 'shipping_country_unavailable'], 422);
        $shippingCents = max(0, (int)($shipping['europeFlatRateCents'] ?? 0));
    }
    $freeThreshold = max(0, (int)($shipping['freeShippingThresholdCents'] ?? 0));
    if ($freeThreshold > 0 && $subtotalCents >= $freeThreshold) $shippingCents = 0;
}

$subtotal = round($subtotalCents / 100, 2);
$shippingAmount = round($shippingCents / 100, 2);
$total = round(($subtotalCents + $shippingCents) / 100, 2);
$orderNumber = 'PAP-' . date('ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

try {
    $pdo->beginTransaction();
    $stmt = $pdo->prepare('INSERT INTO orders (order_number, customer_email, customer_first_name, customer_last_name, customer_phone, shipping_address1, shipping_address2, shipping_postcode, shipping_city, shipping_region, shipping_country, shipping_method, shipping_amount, subtotal_amount, total_amount, currency, customer_note, fulfillment_owner) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $stmt->execute([$orderNumber,$email,$firstName,$lastName,$phone ?: null,$address1,$address2 ?: null,$postalCode,$city,$region ?: null,$country,$shippingMethod,$shippingAmount,$subtotal,$total,$currency,$customerNote ?: null,'aurelie']);
    $orderId = (int)$pdo->lastInsertId();

    $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, product_title, product_type, quantity, unit_price, line_total, fulfillment_owner, fulfillment_type) VALUES (?,?,?,?,?,?,?,?,?)');
    foreach ($normalizedItems as $item) {
        $itemStmt->execute([$orderId,$item['productId'],$item['title'],$item['productType'] ?: null,$item['quantity'],$item['unitPrice'],$item['lineTotal'],'aurelie','aurelie']);
    }
    $pdo->prepare('INSERT INTO order_status_history (order_id,status,message,visible_to_customer) VALUES (?,?,?,1)')->execute([$orderId,'new','Commande créée']);
    $pdo->commit();

    $notificationEmail = getAppSetting($pdo, 'papeterie_order_email', $config['aurelie_order_email'] ?? '');
    if ($notificationEmail) {
        $lines = [];
        foreach ($normalizedItems as $item) {
            $lines[] = '- ' . $item['quantity'] . ' x ' . $item['title'] . ' — ' . number_format((float)$item['lineTotal'], 2, ',', ' ') . ' ' . $currency;
        }
        $body = "Nouvelle commande Papeterie\n\n";
        $body .= "Commande : {$orderNumber}\n";
        $body .= "Cliente : {$firstName} {$lastName}\n";
        $body .= "Email : {$email}\n";
        if ($phone) $body .= "Téléphone : {$phone}\n";
        $body .= "\nArticles :\n" . implode("\n", $lines) . "\n";
        $body .= "\nSous-total : " . number_format($subtotal, 2, ',', ' ') . " {$currency}\n";
        $body .= "Livraison : " . number_format($shippingAmount, 2, ',', ' ') . " {$currency}\n";
        $body .= "Total : " . number_format($total, 2, ',', ' ') . " {$currency}\n";
        $body .= "\nAdresse de livraison :\n{$firstName} {$lastName}\n{$address1}\n";
        if ($address2) $body .= $address2 . "\n";
        $body .= "{$postalCode} {$city}\n{$country}\n";
        $body .= "\nVoir les commandes : https://comentrenous.marionbolomey.fr/admin/papeterie/commandes/\n";
        $headers = "Content-Type: text/plain; charset=UTF-8\r\n";
        $headers .= "From: Com entre nous <no-reply@marionbolomey.fr>\r\n";
        $headers .= "Reply-To: {$email}\r\n";
        @mail($notificationEmail, 'Nouvelle commande Papeterie ' . $orderNumber, $body, $headers);
    }

    respond(['ok' => true, 'orderNumber' => $orderNumber, 'status' => 'new', 'total' => $total, 'currency' => $currency, 'paymentOwner' => 'aurelie'], 201);
} catch (Throwable $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    respond(['ok' => false, 'error' => 'order_creation_failed'], 500);
}
