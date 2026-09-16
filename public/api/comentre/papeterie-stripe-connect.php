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
    if ($status !== 200 || !is_string($body)) respond(['ok' => false, 'error' => 'admin_login_required'], 401);
    $repo = json_decode($body, true);
    if (!is_array($repo) || empty($repo['permissions']['push'])) respond(['ok' => false, 'error' => 'admin_forbidden'], 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
requireSiteAdminGithubToken();

$clientId = trim((string)($config['stripe_connect_client_id'] ?? ''));
$redirectUri = trim((string)($config['stripe_connect_redirect_uri'] ?? ''));
if ($clientId === '' || $redirectUri === '') {
    respond(['ok' => false, 'error' => 'stripe_connect_not_configured'], 503);
}

$state = bin2hex(random_bytes(24));
setAppSetting($pdo, 'papeterie_stripe_oauth_state', hash('sha256', $state));
setAppSetting($pdo, 'papeterie_stripe_oauth_expires', (string)(time() + 900));

$query = http_build_query([
    'response_type' => 'code',
    'client_id' => $clientId,
    'scope' => 'read_write',
    'redirect_uri' => $redirectUri,
    'state' => $state,
]);

respond(['ok' => true, 'authorizeUrl' => 'https://connect.stripe.com/oauth/authorize?' . $query]);
