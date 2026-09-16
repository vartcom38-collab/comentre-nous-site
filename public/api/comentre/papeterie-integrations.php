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

function stripeAccount(string $key): array {
    $ch = curl_init('https://api.stripe.com/v1/account');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $key],
    ]);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    $data = is_string($body) ? json_decode($body, true) : null;
    if ($status < 200 || $status >= 300 || !is_array($data) || empty($data['id'])) {
        respond(['ok' => false, 'error' => 'stripe_connection_failed'], 422);
    }
    return $data;
}

requireSiteAdminGithubToken();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stripeEncrypted = getAppSetting($pdo, 'papeterie_stripe_api_key', '');
    $stripeAccountId = getAppSetting($pdo, 'papeterie_stripe_account_id', '');
    $stripeLabel = getAppSetting($pdo, 'papeterie_stripe_account_label', '');
    $mrBrand = getAppSetting($pdo, 'papeterie_mondialrelay_enseigne', '');
    $mrSecret = getAppSetting($pdo, 'papeterie_mondialrelay_private_key', '');
    respond([
        'ok' => true,
        'stripe' => [
            'connected' => (bool)$stripeEncrypted,
            'accountId' => $stripeAccountId ?: '',
            'label' => $stripeLabel ?: '',
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

if ($action === 'connect_stripe') {
    $key = trim((string)($data['apiKey'] ?? ''));
    if (!preg_match('/^(sk|rk)_(test|live)_/', $key)) respond(['ok' => false, 'error' => 'invalid_stripe_key'], 422);
    $account = stripeAccount($key);
    $label = cleanText($account['business_profile']['name'] ?? $account['settings']['dashboard']['display_name'] ?? $account['email'] ?? 'Compte Stripe', 180);
    setAppSetting($pdo, 'papeterie_stripe_api_key', encryptAppSecret($config, $key));
    setAppSetting($pdo, 'papeterie_stripe_account_id', (string)$account['id']);
    setAppSetting($pdo, 'papeterie_stripe_account_label', $label);
    respond(['ok' => true, 'stripe' => ['connected' => true, 'accountId' => (string)$account['id'], 'label' => $label]]);
}

if ($action === 'disconnect_stripe') {
    foreach (['papeterie_stripe_api_key','papeterie_stripe_account_id','papeterie_stripe_account_label'] as $key) deleteAppSetting($pdo, $key);
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
