<?php
/**
 * Aperçu public en lecture seule du WooCommerce de /commerce/.
 * N'expose pas les brouillons, fichiers téléchargeables, clés, commandes, ni comptes.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Robots-Tag: noindex, nofollow');

$configPath = dirname(__DIR__) . '/woo-commerce-private.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Configuration de test indisponible']);
    exit;
}
$config = require $configPath;
$base = rtrim((string)($config['url'] ?? ''), '/');
$key = (string)($config['consumer_key'] ?? '');
$secret = (string)($config['consumer_secret'] ?? '');
if ($base !== 'https://comentrenous.marionbolomey.fr/commerce' || !$key || !$secret) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Configuration de test incomplète']);
    exit;
}
if (!function_exists('curl_init')) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'error' => 'Connexion serveur indisponible']);
    exit;
}
function commerceWooGet(string $base, string $key, string $secret, string $path): ?array {
    $ch = curl_init($base . $path);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_USERPWD => $key . ':' . $secret,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
        CURLOPT_CONNECTTIMEOUT => 7,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_FOLLOWLOCATION => false,
    ]);
    $raw = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($status !== 200 || !is_string($raw)) return null;
    $data = json_decode($raw, true);
    return is_array($data) && array_is_list($data) ? $data : null;
}
$published = commerceWooGet($base, $key, $secret, '/wp-json/wc/v3/products?status=publish&per_page=50');
$drafts = commerceWooGet($base, $key, $secret, '/wp-json/wc/v3/products?status=draft&per_page=50');
if ($published === null || $drafts === null) {
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Catalogue WooCommerce indisponible']);
    exit;
}
$products = [];
foreach ($published as $p) {
    if (!is_array($p)) continue;
    $images = is_array($p['images'] ?? null) ? $p['images'] : [];
    $categories = is_array($p['categories'] ?? null) ? $p['categories'] : [];
    $products[] = [
        'id' => (int)($p['id'] ?? 0),
        'name' => (string)($p['name'] ?? ''),
        'slug' => (string)($p['slug'] ?? ''),
        'type' => (string)($p['type'] ?? ''),
        'status' => 'publish',
        'price' => (string)($p['price'] ?? ''),
        'downloadable' => (bool)($p['downloadable'] ?? false),
        'short_description' => trim(html_entity_decode(strip_tags((string)($p['short_description'] ?? '')), ENT_QUOTES | ENT_HTML5, 'UTF-8')),
        'description' => trim(html_entity_decode(strip_tags((string)($p['description'] ?? '')), ENT_QUOTES | ENT_HTML5, 'UTF-8')),
        'sku' => (string)($p['sku'] ?? ''),
        'product_url' => '',
        'image' => (string)($images[0]['src'] ?? ''),
        'images' => array_values(array_map(static function ($image) {
            return ['src' => (string)($image['src'] ?? '')];
        }, $images)),
        'categories' => array_values(array_map(static function ($c) {
            return [
                'name' => (string)($c['name'] ?? ''),
                'slug' => (string)($c['slug'] ?? ''),
            ];
        }, $categories)),
    ];
}
if (isset($_GET['view']) && $_GET['view'] === '1') {
    header('Content-Type: text/html; charset=utf-8');
    $esc = static function ($value): string {
        return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    };
    ?><!doctype html>
    <html lang="fr">
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>Aperçu boutique test — Com’ entre nous</title>
    <style>
    *{box-sizing:border-box}body{background:#fff9f5;color:#232337;font-family:system-ui,sans-serif;margin:0}
    main{max-width:1100px;padding:24px;margin:30px auto 80px}
    header{background:#fce9e0;padding:30px;border-radius:28px}
    h1{font-family:Georgia,serif;font-size:clamp(28px,5vw,47px);margin:8px 0}
    .counts{display:flex;flex-wrap:wrap;gap:14px;margin:26px 0}.counts p{margin:0;background:white;border-radius:17px;padding:18px;flex:1}
    .counts strong{font-size:27px;display:block}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px}
    article{background:white;padding:16px;border-radius:20px;box-shadow:0 8px 25px #171b2a0d}
    article img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:14px}
    article a{display:inline-block;background:#25283c;color:#fff;padding:11px 16px;text-decoration:none;border-radius:999px;margin-top:12px}
    .product-head{display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:30px;align-items:start;margin-top:24px}
    .product-copy{white-space:pre-line;line-height:1.8;color:#484655}
    .back{display:inline-block;margin:14px 0 24px;color:#25283c}
    .detail-image{width:100%;border-radius:24px;object-fit:cover}
    .detail{background:white;border-radius:25px;padding:26px;margin-top:24px}
    .placeholder{background:#fce9e0;aspect-ratio:4/3;border-radius:14px}
    .note{color:#665f6a;line-height:1.6}.price{font-weight:bold}
    </style></head><body><main>
    <header><small>COM’ ENTRE NOUS · TEST UNIQUEMENT</small>
    <h1>Aperçu de la nouvelle boutique</h1>
    <p class="note">Catalogue lu depuis commerce.marionbolomey.fr. Aucun achat possible sur cette page.</p>
    </header>
    <?php
    $selectedId = isset($_GET['product']) ? (int)$_GET['product'] : 0;
    $selectedProduct = null;
    foreach ($products as $candidate) {
        if ($selectedId > 0 && $candidate['id'] === $selectedId) { $selectedProduct = $candidate; break; }
    }
    ?>
    <?php if ($selectedProduct !== null): ?>
    <a class="back" href="?view=1">← Revenir à tous les produits</a>
    <div class="detail"><div class="product-head">
      <div><?php if ($selectedProduct['image'] !== ''): ?><img class="detail-image" src="<?php echo $esc($selectedProduct['image']); ?>" alt="">
      <?php else: ?><div class="placeholder"></div><?php endif; ?></div>
      <div><p class="note"><?php echo $selectedProduct['downloadable'] ? 'Ebook à télécharger' : 'Produit'; ?></p>
      <h1><?php echo $esc($selectedProduct['name']); ?></h1>
      <p class="price"><?php echo $esc($selectedProduct['price']); ?> €</p>
      <div class="product-copy"><?php echo $esc($selectedProduct['short_description']); ?></div>
      <p class="note">Aperçu de fiche — la vente n’est pas activée.</p>
      </div></div>
      <?php if ($selectedProduct['description'] !== ''): ?><h2>Tout savoir sur ce produit</h2>
      <div class="product-copy"><?php echo $esc($selectedProduct['description']); ?></div><?php endif; ?>
    </div>
    <?php else: ?>
    <div class="counts"><p><strong><?php echo count($products); ?></strong>Produits publiés</p>
    <p><strong><?php echo count($drafts); ?></strong>Brouillons (non affichés)</p></div>
    <?php if (!$products): ?>
    <article><h2>Aucun produit publié pour le moment</h2>
    <p class="note">C’est normal si ton ebook est encore en brouillon. Il reste protégé.</p></article>
    <?php else: ?>
    <div class="grid">
    <?php foreach ($products as $product): ?>
    <article><?php if ($product['image'] !== ''): ?>
    <img src="<?php echo $esc($product['image']); ?>" alt="">
    <?php else: ?><div class="placeholder"></div><?php endif; ?>
    <h2><?php echo $esc($product['name']); ?></h2>
    <p><?php echo $product['downloadable'] ? 'PDF numérique' : 'Produit'; ?></p>
    <p class="price"><?php echo $esc($product['price']); ?> €</p>
    <a href="?view=1&amp;product=<?php echo (int)$product['id']; ?>">Voir la fiche détaillée</a>
    <p class="note">Aperçu seulement — aucun paiement</p>
    </article>
    <?php endforeach; ?>
    </div>
    <?php endif; ?>
    <?php endif; ?>
    </main></body></html><?php
    exit;
}
echo json_encode([
    'ok' => true,
    'store' => 'commerce',
    'published_count' => count($products),
    'draft_count' => count($drafts),
    'counts_limited_to_50' => true,
    'products' => $products,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
