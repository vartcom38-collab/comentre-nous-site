<?php

declare(strict_types=1);
require __DIR__ . '/_bootstrap.php';

function requireSiteAdminGithubTokenPodcast(): void {
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

function cleanFeedUrl(mixed $value): string {
    $url = trim((string)$value);
    if ($url === '') return '';
    if (!filter_var($url, FILTER_VALIDATE_URL)) respond(['ok' => false, 'error' => 'invalid_feed_url'], 422);
    $parts = parse_url($url);
    if (!is_array($parts) || strtolower((string)($parts['scheme'] ?? '')) !== 'https' || empty($parts['host'])) {
        respond(['ok' => false, 'error' => 'feed_url_must_be_https'], 422);
    }
    return $url;
}

function fetchFeed(string $url): array {
    if ($url === '') return ['title' => '', 'description' => '', 'image' => '', 'episodes' => []];
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 18,
        CURLOPT_CONNECTTIMEOUT => 8,
        CURLOPT_MAXREDIRS => 5,
        CURLOPT_USERAGENT => 'ComEntreNous-PodcastFeed/1.0',
        CURLOPT_HTTPHEADER => ['Accept: application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.5'],
    ]);
    $body = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $contentType = (string)curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    if ($status < 200 || $status >= 300 || !is_string($body) || trim($body) === '') {
        throw new RuntimeException('feed_unreachable');
    }
    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($body, 'SimpleXMLElement', LIBXML_NOCDATA | LIBXML_NONET);
    if (!$xml || !isset($xml->channel)) throw new RuntimeException('invalid_rss_feed');
    $channel = $xml->channel;
    $namespaces = $channel->getNameSpaces(true);
    $itunes = isset($namespaces['itunes']) ? $channel->children($namespaces['itunes']) : null;
    $channelImage = '';
    if ($itunes && isset($itunes->image)) {
        $attrs = $itunes->image->attributes();
        $channelImage = trim((string)($attrs['href'] ?? ''));
    }
    if ($channelImage === '' && isset($channel->image->url)) $channelImage = trim((string)$channel->image->url);

    $episodes = [];
    foreach ($channel->item as $item) {
        if (count($episodes) >= 50) break;
        $itemNamespaces = $item->getNameSpaces(true);
        $itemItunes = isset($itemNamespaces['itunes']) ? $item->children($itemNamespaces['itunes']) : null;
        $image = '';
        $duration = '';
        if ($itemItunes) {
            if (isset($itemItunes->image)) {
                $attrs = $itemItunes->image->attributes();
                $image = trim((string)($attrs['href'] ?? ''));
            }
            if (isset($itemItunes->duration)) $duration = trim((string)$itemItunes->duration);
        }
        $audio = '';
        if (isset($item->enclosure)) {
            $attrs = $item->enclosure->attributes();
            $audio = trim((string)($attrs['url'] ?? ''));
        }
        $description = trim(strip_tags((string)($item->description ?? '')));
        $description = preg_replace('/\s+/u', ' ', $description) ?: '';
        if (mb_strlen($description) > 700) $description = mb_substr($description, 0, 697) . '…';
        $guid = trim((string)($item->guid ?? ''));
        $link = trim((string)($item->link ?? ''));
        $title = trim((string)($item->title ?? 'Épisode'));
        $pubDateRaw = trim((string)($item->pubDate ?? ''));
        $publishedAt = '';
        if ($pubDateRaw !== '') {
            $ts = strtotime($pubDateRaw);
            if ($ts !== false) $publishedAt = date(DATE_ATOM, $ts);
        }
        $episodes[] = [
            'id' => $guid !== '' ? $guid : sha1($title . '|' . $pubDateRaw . '|' . $audio),
            'title' => $title,
            'description' => $description,
            'publishedAt' => $publishedAt,
            'duration' => $duration,
            'image' => $image !== '' ? $image : $channelImage,
            'audioUrl' => $audio,
            'link' => $link !== '' ? $link : $audio,
        ];
    }
    return [
        'title' => trim((string)($channel->title ?? '')),
        'description' => trim(strip_tags((string)($channel->description ?? ''))),
        'image' => $channelImage,
        'episodes' => $episodes,
        'contentType' => $contentType,
    ];
}

$platform = getAppSetting($pdo, 'podcast_platform', '') ?: '';
$feedUrl = getAppSetting($pdo, 'podcast_feed_url', '') ?: '';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $admin = ($_GET['admin'] ?? '') === '1';
    if ($admin) requireSiteAdminGithubTokenPodcast();
    $feed = ['title' => '', 'description' => '', 'image' => '', 'episodes' => []];
    $error = '';
    if ($feedUrl !== '') {
        try { $feed = fetchFeed($feedUrl); }
        catch (Throwable $e) { $error = $e->getMessage(); }
    }
    respond([
        'ok' => true,
        'connected' => $feedUrl !== '',
        'platform' => $platform,
        'feedUrl' => $admin ? $feedUrl : '',
        'feed' => $feed,
        'feedError' => $error,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(['ok' => false, 'error' => 'method_not_allowed'], 405);
requireSiteAdminGithubTokenPodcast();
$data = jsonBody();
$action = cleanText($data['action'] ?? '', 40);

if ($action === 'test' || $action === 'save') {
    $nextPlatform = cleanText($data['platform'] ?? 'Autre', 80);
    $nextFeedUrl = cleanFeedUrl($data['feedUrl'] ?? '');
    if ($nextFeedUrl === '') respond(['ok' => false, 'error' => 'feed_url_required'], 422);
    try { $feed = fetchFeed($nextFeedUrl); }
    catch (Throwable $e) { respond(['ok' => false, 'error' => $e->getMessage()], 422); }
    if ($action === 'save') {
        setAppSetting($pdo, 'podcast_platform', $nextPlatform);
        setAppSetting($pdo, 'podcast_feed_url', $nextFeedUrl);
    }
    respond(['ok' => true, 'connected' => true, 'platform' => $nextPlatform, 'feedUrl' => $nextFeedUrl, 'feed' => $feed]);
}

if ($action === 'disconnect') {
    deleteAppSetting($pdo, 'podcast_platform');
    deleteAppSetting($pdo, 'podcast_feed_url');
    respond(['ok' => true, 'connected' => false]);
}

respond(['ok' => false, 'error' => 'invalid_action'], 422);
