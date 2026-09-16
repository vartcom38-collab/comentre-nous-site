<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

function backToAdmin(string $status): never {
    header('Location: https://comentrenous.marionbolomey.fr/admin/papeterie/connexions/?stripe=' . rawurlencode($status));
    exit;
}

$code = trim((string)($_GET['code'] ?? ''));
$state = trim((string)($_GET['state'] ?? ''));
$error = trim((string)($_GET['error'] ?? ''));
if ($error !== '') backToAdmin('cancelled');
if ($code === '' || $state === '') backToAdmin('invalid');

$expectedHash = getAppSetting($pdo, 'papeterie_stripe_oauth_state', '');
$expires = (int)(getAppSetting($pdo, 'papeterie_stripe_oauth_expires', '0') ?: 0);
if (!$expectedHash || $expires < time() || !hash_equals($expectedHash, hash('sha256', $state))) {
    backToAdmin('expired');
}

$secret = trim((string)($config['stripe_connect_secret_key'] ?? ''));
$redirectUri = trim((string)($config['stripe_connect_redirect_uri'] ?? ''));
if ($secret === '' || $redirectUri === '') backToAdmin('setup');

$ch = curl_init('https://connect.stripe.com/oauth/token');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $redirectUri,
    ]),
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $secret],
]);
$body = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
curl_close($ch);
$data = is_string($body) ? json_decode($body, true) : null;
if ($status < 200 || $status >= 300 || !is_array($data) || empty($data['stripe_user_id']) || empty($data['access_token'])) {
    backToAdmin('failed');
}

$accountId = (string)$data['stripe_user_id'];
$accessToken = (string)$data['access_token'];
$refreshToken = (string)($data['refresh_token'] ?? '');
$livemode = !empty($data['livemode']) ? '1' : '0';

$label = 'Compte Stripe Aurélie';
$acc = curl_init('https://api.stripe.com/v1/account');
curl_setopt_array($acc, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $accessToken],
]);
$accBody = curl_exec($acc);
$accStatus = (int)curl_getinfo($acc, CURLINFO_RESPONSE_CODE);
curl_close($acc);
if ($accStatus >= 200 && $accStatus < 300 && is_string($accBody)) {
    $account = json_decode($accBody, true);
    if (is_array($account)) {
        $label = cleanText($account['business_profile']['name'] ?? $account['settings']['dashboard']['display_name'] ?? $account['email'] ?? $label, 180);
    }
}

setAppSetting($pdo, 'papeterie_stripe_access_token', encryptAppSecret($config, $accessToken));
setAppSetting($pdo, 'papeterie_stripe_refresh_token', encryptAppSecret($config, $refreshToken));
setAppSetting($pdo, 'papeterie_stripe_account_id', $accountId);
setAppSetting($pdo, 'papeterie_stripe_account_label', $label);
setAppSetting($pdo, 'papeterie_stripe_livemode', $livemode);
deleteAppSetting($pdo, 'papeterie_stripe_oauth_state');
deleteAppSetting($pdo, 'papeterie_stripe_oauth_expires');

backToAdmin('connected');
