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

requireSiteAdminGithubToken();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stripeToken = getAppSetting($pdo, 'papeterie_stripe_access_token', '');
    $stripeAccountId = getAppSetting($pdo, 'papeterie_stripe_account_id', '');
    $stripeLabel = getAppSetting($pdo, 'papeterie_stripe_account_label', '');
    $stripeLivemode = getAppSetting($pdo, 'papeterie_stripe_livemode', '0') === '1';
    $stripeReady = !empty($config['stripe_connect_client_id']) && !empty($config['stripe_connect_secret_key']);
    $mrBrand = getAppSetting($pdo, 'papeterie_mondialrelay_enseigne', '');
    $mrSecret = getAppSetting($pdo, 'papeterie_mondialrelay_private_key', '');
    respond([
        'ok' => true,
        'stripe' => [
            'connected' => (bool)($stripeToken && $stripeAccountId),
            'accountId' => $stripeAccountId ?: '',
            'label' => $stripeLabel ?: '',
            'livemode' => $stripeLivemode,
            'connectReady' => $stripeReady,
        ],
        'mondialRelay' => [
            'connected' => (bool)($mrBrand && $mrSecret),
            'enseigne' => $mrBrand ?: '',
        ],
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
$data = jsonBody();
$action = cleanText($data['action'] ?? '', 40);

if ($action === 'disconnect_stripe') {
    foreach ([
        'papeterie_stripe_access_token',
        'papeterie_stripe_refresh_token',
        'papeterie_stripe_account_id',
        'papeterie_stripe_account_label',
        'papeterie_stripe_livemode',
        'papeterie_stripe_oauth_state',
        'papeterie_stripe_oauth_expires',
        'papeterie_stripe_api_key'
    ] as $key) deleteAppSetting($pdo, $key);
    respond(['ok' => true]);
}

if ($action === 'save_mondialrelay') {
    $enseigne = strtoupper(cleanText($data['enseigne'] ?? '', 20));
    $privateKey = trim((string)($data['privateKey'] ?? ''));
    if ($enseigne === '' || $privateKey === '') respond(['ok' => false, 'error' => 'mondialrelay_credentials_required'], 422);
    setAppSetting($pdo, 'papeterie_mondialrelay_enseigne', $enseigne);
    setAppSetting($pdo, 'papeterie_mondialrelay_private_key', encryptAppSecret($config, $privateKey));
    respond(['ok' => true, 'mondialRelay' => ['connected' => true, 'enseigne' => $enseigne]]);
}

if ($action === 'disconnect_mondialrelay') {
    deleteAppSetting($pdo, 'papeterie_mondialrelay_enseigne');
    deleteAppSetting($pdo, 'papeterie_mondialrelay_private_key');
    respond(['ok' => true]);
}

respond(['ok' => false, 'error' => 'invalid_action'], 422);
