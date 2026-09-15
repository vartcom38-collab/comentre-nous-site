<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

requireAdmin($config);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $email = getAppSetting($pdo, 'papeterie_order_email', $config['aurelie_order_email'] ?? '');
    respond(['ok' => true, 'email' => $email ?: '']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
}

$data = jsonBody();
$action = cleanText($data['action'] ?? 'save', 20);
$email = cleanEmail($data['email'] ?? '');

if ($action === 'save') {
    setAppSetting($pdo, 'papeterie_order_email', $email);
    respond(['ok' => true, 'email' => $email]);
}

if ($action === 'test') {
    $subject = 'Test notifications commandes Papeterie';
    $body = "Bonjour,\n\nLes notifications de commandes Papeterie sont bien configurées pour cette adresse.\n\nCom’ entre nous";
    $headers = "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "From: Com entre nous <no-reply@marionbolomey.fr>\r\n";
    $sent = @mail($email, $subject, $body, $headers);
    if (!$sent) respond(['ok' => false, 'error' => 'mail_send_failed'], 502);
    respond(['ok' => true, 'sent' => true]);
}

respond(['ok' => false, 'error' => 'invalid_action'], 422);
