<?php
/**
 * Plugin Name: Com' entre nous — Habillage commande
 * Description: Habillage léger du paiement WooCommerce sur /commerce/, sans modifier les moyens de paiement ni le tunnel d'achat.
 * Version: 0.1.0
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

    wp_register_style('comentre-checkout-theme', false, ['comentre-checkout-fonts'], '0.1.0');
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
