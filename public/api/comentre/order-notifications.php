<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

function requireSiteAdminGithubToken(): void {
    $token = trim((string)($_SERVER['HTTP_X_ADMIN_GITHUB_TOKEN'] ?? ''));
    if ($token === '') respond(['ok' => false, 'error' => 'admin_login_required'], 401);

    $ch = curl_init('https://api.github.com/repos/vartcom38-collab/comentre-nous-site');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => [
            'Accept: application/vnd.github+json',
            'Authorization: Bearer ' . $token,
            'X-GitHub-Api-Version: 2022-11-28',
            'User-Agent: ComEntreNous-Admin'
        ],
    ]);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);

    if ($status !== 200 || !is_string($body)) {
        respond(['ok' => false, 'error' => 'admin_login_required'], 401);
    }

    $repo = json_decode($body, true);
    $canPush = is_array($repo) && !empty($repo['permissions']['push']);
    if (!$canPush) respond(['ok' => false, 'error' => 'admin_forbidden'], 403);
}

requireSiteAdminGithubToken();

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
