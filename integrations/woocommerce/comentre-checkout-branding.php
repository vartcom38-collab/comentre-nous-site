<?php
/**
 * Plugin Name: Com' entre nous — Habillage commande
 * Description: Habillage léger du paiement WooCommerce sur /commerce/, sans modifier les moyens de paiement ni le tunnel d'achat.
 * Version: 0.3.0
 */
defined('ABSPATH') || exit;

/**
 * Uniquement sur la page de validation de commande, et sa confirmation.
 * Les données et formulaires WooPayments restent entièrement gérés par WooCommerce.
 */
add_action('wp_enqueue_scripts', static function () {
    if (!function_exists('is_checkout') || !is_checkout()) return;

    wp_enqueue_style(
        'comentre-checkout-fonts',
        'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Patrick+Hand&display=swap',
        [],
        null
    );

    wp_register_style('comentre-checkout-theme', false, ['comentre-checkout-fonts'], '0.2.0');
    wp_enqueue_style('comentre-checkout-theme');
    $css = <<<'CSS'
/* COM’ ENTRE NOUS — habillage de la commande.
   Styles limités à body.woocommerce-checkout, sans masquer ni modifier le paiement. */
body.woocommerce-checkout {
  --ce-cream:#fff8f1; --ce-ink:#171b2a; --ce-pink:#fce9e0;
  --ce-coral:#ff766d; --ce-mint:#dff6f0; --ce-border:#eadfd6;
  background:var(--ce-cream) !important; color:var(--ce-ink);
  font-family:'Comfortaa',system-ui,sans-serif;
}
body.woocommerce-checkout :is(h1,h2,h3,.entry-title,.wp-block-post-title) {
  color:var(--ce-ink);
}
body.woocommerce-checkout :is(.wp-site-blocks,main.site-main,.site-content) {
  background:transparent;
}
body.woocommerce-checkout :is(.wp-block-post-content,.entry-content) {
  max-width:1250px;
  margin-inline:auto;
}
body.woocommerce-checkout .comentre-checkout-ribbon {
  max-width:1250px; margin:22px auto 18px;
  padding:18px 24px; border-radius:24px;
  background:linear-gradient(110deg,#fce9e0,#fff4ed 65%,#dff6f0);
  display:flex; flex-wrap:wrap; gap:12px 24px; align-items:center;
  border:1px solid rgba(23,27,42,.04);
  box-shadow:0 12px 32px rgba(48,30,18,.05);
}
body.woocommerce-checkout .comentre-checkout-ribbon__logo {
  width:150px; max-height:56px; object-fit:contain; object-position:left center;
}
body.woocommerce-checkout .comentre-checkout-ribbon__copy { flex:1; min-width:190px; }
body.woocommerce-checkout .comentre-checkout-ribbon__copy strong {
  display:block; font:400 clamp(27px,3.5vw,44px)/1.05 'Patrick Hand',cursive;
}
body.woocommerce-checkout .comentre-checkout-ribbon__copy span {
  display:block; margin-top:5px; font:500 11px/1.6 'Comfortaa',sans-serif;
}
body.woocommerce-checkout .comentre-checkout-ribbon__back {
  color:var(--ce-ink); text-decoration:none; font:700 11px/1.4 'Comfortaa',sans-serif;
  background:#fff; border-radius:999px; padding:12px 17px;
}
body.woocommerce-checkout :is(.wc-block-checkout,.woocommerce-checkout) {
  color:var(--ce-ink);
  font-family:'Comfortaa',system-ui,sans-serif;
}
body.woocommerce-checkout .wp-block-woocommerce-checkout {
  max-width:1250px; margin-inline:auto; padding:12px 16px 52px;
}
body.woocommerce-checkout .wc-block-checkout__main :is(
  .wc-block-components-checkout-step,
  .wc-block-components-address-form
) { color:var(--ce-ink); }
body.woocommerce-checkout .wc-block-components-checkout-step__heading {
  font:400 clamp(26px,3vw,36px)/1.1 'Patrick Hand',cursive;
}
body.woocommerce-checkout :is(
  .wc-block-components-text-input input,
  .wc-block-components-combobox-control input,
  .wc-block-components-textarea,
  .woocommerce-input-wrapper input,
  .woocommerce-input-wrapper textarea,
  .woocommerce-input-wrapper select
) {
  border-radius:14px !important;
  border-color:var(--ce-border) !important;
  background:#fff !important;
  color:var(--ce-ink) !important;
}
body.woocommerce-checkout :is(.wc-block-components-button,.woocommerce #place_order) {
  background:var(--ce-ink); color:#fff;
  border:0; border-radius:999px; font-family:'Comfortaa',sans-serif;
  font-size:13px; font-weight:700; min-height:48px;
  transition:background-color .16s ease;
}
body.woocommerce-checkout :is(.wc-block-components-button,.woocommerce #place_order):hover {
  background:#303b4f; color:#fff;
}
body.woocommerce-checkout :is(.wc-block-components-button,.woocommerce #place_order):focus-visible {
  outline:3px solid var(--ce-coral); outline-offset:3px;
}
body.woocommerce-checkout .wc-block-checkout__sidebar :is(
  .wc-block-components-totals-wrapper,
  .wp-block-woocommerce-checkout-order-summary-block
) {
  border-color:var(--ce-border);
}
body.woocommerce-checkout .wc-block-checkout__sidebar {
  background:#fffdfb; border:1px solid var(--ce-border);
  border-radius:24px; padding:18px;
}
body.woocommerce-checkout .wc-block-components-order-summary-item__quantity {
  background:var(--ce-mint); border-color:#bce7df; color:var(--ce-ink);
}
body.woocommerce-checkout :is(
  .wc-block-components-checkbox__input,
  input[type=checkbox],
  input[type=radio]
) { accent-color:#e67572; }
body.woocommerce-checkout a { color:#9c4847; }
body.woocommerce-checkout :is(.woocommerce-message,.wc-block-components-notice-banner.is-success) {
  border-radius:14px; background:var(--ce-mint);
}
body.woocommerce-checkout .woocommerce form.checkout {
  max-width:1250px; margin-inline:auto;
}
/* Retirer le menu du thème WordPress pendant le paiement et la confirmation.
   La bannière Com’ entre nous ci-dessus reste visible. */
body.woocommerce-checkout .wp-block-template-part:has(.wp-block-navigation),
body.woocommerce-checkout header.site-header,
body.woocommerce-checkout #masthead,
body.woocommerce-checkout .main-navigation,
body.woocommerce-checkout .wp-site-blocks > header,
body.woocommerce-checkout .site-footer,
body.woocommerce-checkout .wp-site-blocks > footer {
  display:none !important;
}
body.woocommerce-checkout .comentre-order-next {
  display:flex;flex-wrap:wrap;align-items:center;gap:12px 18px;
  margin:24px 0 28px;padding:20px 22px;
  background:linear-gradient(110deg,#dff6f0,#fffaf6);
  border:1px solid #d3e8e1;border-radius:22px;
}
body.woocommerce-checkout .comentre-order-next__copy {flex:1;min-width:220px}
body.woocommerce-checkout .comentre-order-next__copy strong {
  display:block;font:400 29px/1.1 'Patrick Hand',cursive;
}
body.woocommerce-checkout .comentre-order-next__copy span {
  display:block;font:500 11px/1.75 'Comfortaa',sans-serif;margin-top:7px;
}
body.woocommerce-checkout .comentre-order-next__link {
  display:inline-block;padding:13px 20px;border-radius:999px;
  background:#171b2a;color:#fff!important;text-decoration:none;
  font:700 12px/1.4 'Comfortaa',sans-serif;
}
body.woocommerce-checkout .comentre-order-next__link:focus-visible {
  outline:3px solid #ff766d;outline-offset:3px;
}
@media(max-width:780px) {
  body.woocommerce-checkout .comentre-checkout-ribbon {
    margin:14px 12px; padding:16px; border-radius:18px;
  }
  body.woocommerce-checkout .comentre-checkout-ribbon__logo {width:110px;}
  body.woocommerce-checkout .comentre-checkout-ribbon__back {width:100%;text-align:center;}
  body.woocommerce-checkout .wc-block-checkout__sidebar {padding:10px;border-radius:16px;}
}
CSS;
    wp_add_inline_style('comentre-checkout-theme', $css);
}, 30);

/* Le repère de marque ne modifie pas le bloc de paiement. */
add_action('wp_body_open', static function () {
    if (!function_exists('is_checkout') || !is_checkout()) return;
    $origin = 'https://comentrenous.marionbolomey.fr';
    ?>
    <div class="comentre-checkout-ribbon" aria-label="Commande Com' entre nous">
      <img class="comentre-checkout-ribbon__logo"
           src="<?php echo esc_url($origin . '/logo-comentre-nous.svg?v=transparent-final-20260907'); ?>"
           alt="Com’ entre nous">
      <div class="comentre-checkout-ribbon__copy">
        <strong>On y est presque ♡</strong>
        <span>Un dernier petit pas pour recevoir ta création Com’ entre nous.</span>
      </div>
      <a class="comentre-checkout-ribbon__back" href="<?php echo esc_url($origin . '/com-en-famille/'); ?>">← Revenir au site</a>
    </div>
    <?php
}, 15);

/**
 * Confirmation : le client garde son reçu et ses téléchargements WooCommerce,
 * puis peut ouvrir l'espace client du SITE PRINCIPAL (pas /commerce/mon-compte/).
 * Pas de connexion automatique ni de création de mot de passe sur une page publique.
 */
add_action('woocommerce_before_thankyou', static function ($order_id) {
    if (!$order_id || !function_exists('wc_get_order')) return;
    $order = wc_get_order($order_id);
    if (!$order || !in_array($order->get_status(), ['processing','completed'], true)) return;
    $space = 'https://comentrenous.marionbolomey.fr/mon-espace/';
    ?>
    <section class="comentre-order-next" aria-label="Retrouver mes achats">
      <div class="comentre-order-next__copy">
        <strong>Merci pour ta commande ♡</strong>
        <span>Ton achat est confirmé. Retrouve tes commandes et tes téléchargements dans ton espace Com’ entre nous. L’accès à cet espace nécessite une connexion sécurisée.</span>
      </div>
      <a class="comentre-order-next__link" href="<?php echo esc_url($space); ?>">Accéder à mon espace ♡</a>
    </section>
    <?php
}, 20);

/** Dans les e-mails envoyés aux clientes, présenter la bonne adresse de connexion.
 * Le lien ne contient aucune clé de commande ni mot de passe.
 */
add_action('woocommerce_email_after_order_table', static function ($order, $sent_to_admin, $plain_text, $email) {
    if ($sent_to_admin || !is_a($order, 'WC_Order')) return;
    $url = 'https://comentrenous.marionbolomey.fr/mon-espace/';
    if ($plain_text) {
        echo "\nRetrouver mes achats dans mon espace Com’ entre nous : " . esc_url($url) . "\n";
    } else {
        echo '<p style="margin:20px 0">Vos achats et téléchargements sont à retrouver dans <a href="' . esc_url($url) . '">votre espace Com’ entre nous</a>, après connexion.</p>';
    }
}, 20, 4);

/**
 * Réinitialisation du mot de passe : habillage de l'écran WooCommerce,
 * tout en conservant les formulaires et jetons de sécurité natifs.
 */
add_action('wp_enqueue_scripts', static function () {
    if (!function_exists('is_account_page') || !is_account_page() ||
        !function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('lost-password')) return;

    wp_enqueue_style(
        'comentre-password-fonts',
        'https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Patrick+Hand&display=swap',
        [],
        null
    );
    wp_register_style('comentre-password-style', false, ['comentre-password-fonts'], '0.3.0');
    wp_enqueue_style('comentre-password-style');
    $css = <<<'CSS'
body.woocommerce-account {
  background:#fff8f1!important;color:#171b2a;
  font-family:'Comfortaa',system-ui,sans-serif;
}
body.woocommerce-account .wp-site-blocks>header,
body.woocommerce-account .wp-site-blocks>footer,
body.woocommerce-account header.site-header,
body.woocommerce-account footer.site-footer,
body.woocommerce-account #masthead,
body.woocommerce-account .main-navigation,
body.woocommerce-account .wp-block-template-part:has(.wp-block-navigation) {
  display:none!important;
}
body.woocommerce-account .ce-password-ribbon {
  box-sizing:border-box;max-width:1050px;margin:28px auto 26px;
  padding:20px 26px;display:flex;align-items:center;flex-wrap:wrap;gap:16px 28px;
  border-radius:25px;background:linear-gradient(105deg,#fce9e0,#fff6ee 64%,#dff6f0);
}
body.woocommerce-account .ce-password-ribbon img {
  width:105px;height:70px;object-fit:contain;
}
body.woocommerce-account .ce-password-ribbon__title {
  flex:1;min-width:200px;
}
body.woocommerce-account .ce-password-ribbon__title strong {
  display:block;font:400 clamp(29px,4vw,43px)/1.1 'Patrick Hand',cursive;
}
body.woocommerce-account .ce-password-ribbon__title span {
  display:block;font:500 11px/1.8 'Comfortaa',sans-serif;
}
body.woocommerce-account .ce-password-ribbon__back {
  background:#fff;color:#171b2a!important;text-decoration:none;
  padding:13px 17px;border-radius:999px;
  font:700 11px/1.5 'Comfortaa',sans-serif;
}
body.woocommerce-account main,
body.woocommerce-account .site-main,
body.woocommerce-account .wp-block-post-content {
  max-width:1050px;margin-inline:auto;
}
body.woocommerce-account .woocommerce {
  max-width:680px;margin:24px auto 64px;background:white;
  padding:clamp(22px,5vw,42px);border-radius:26px;
  box-shadow:0 15px 45px rgba(48,30,18,.07);
}
body.woocommerce-account .woocommerce :is(h1,h2,h3) {
  font:400 clamp(31px,4vw,44px)/1.15 'Patrick Hand',cursive;color:#171b2a;
}
body.woocommerce-account .woocommerce p {
  color:#515562;font:500 13px/1.85 'Comfortaa',sans-serif;
}
body.woocommerce-account .woocommerce input:is([type=email],[type=text],[type=password]) {
  box-sizing:border-box;width:100%;max-width:100%;
  background:#fffdfb;border:1px solid #e4d9d0;border-radius:14px;
  padding:14px;color:#171b2a;font-family:'Comfortaa',sans-serif;
}
body.woocommerce-account .woocommerce button,
body.woocommerce-account .woocommerce button.button {
  border:0!important;background:#171b2a!important;color:#fff!important;
  padding:15px 21px!important;border-radius:999px!important;
  font:700 12px/1.5 'Comfortaa',sans-serif!important;
}
body.woocommerce-account .woocommerce :is(.woocommerce-message,.woocommerce-info,.woocommerce-error) {
  border-radius:14px;
}
body.woocommerce-account .woocommerce a {color:#9c4847;}
@media(max-width:700px) {
  body.woocommerce-account .ce-password-ribbon {margin:12px;padding:16px;}
  body.woocommerce-account .ce-password-ribbon__back {width:100%;text-align:center;}
  body.woocommerce-account .woocommerce {margin-inline:12px;}
}
CSS;
    wp_add_inline_style('comentre-password-style', $css);
}, 30);

add_action('wp_body_open', static function () {
    if (!function_exists('is_account_page') || !is_account_page() ||
        !function_exists('is_wc_endpoint_url') || !is_wc_endpoint_url('lost-password')) return;
    ?>
    <div class="ce-password-ribbon" aria-label="Com’ entre nous">
      <img src="<?php echo esc_url('https://comentrenous.marionbolomey.fr/logo-comentre-nous.svg?v=transparent-final-20260907'); ?>" alt="Com’ entre nous">
      <div class="ce-password-ribbon__title">
        <strong>On retrouve ton accès ♡</strong>
        <span>Un petit lien par e-mail, et tu pourras retrouver tes créations.</span>
      </div>
      <a class="ce-password-ribbon__back" href="https://comentrenous.marionbolomey.fr/mon-espace/">← Retour à mon espace</a>
    </div>
    <?php
}, 15);
