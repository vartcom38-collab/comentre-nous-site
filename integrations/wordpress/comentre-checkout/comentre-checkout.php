<?php
/**
 * Plugin Name: Com' entre nous — commande WooPayments
 * Description: Prototype de page de commande WooCommerce à l'identité Com' entre nous. Ne modifie pas les passerelles et ne crée pas de paiement.
 * Version: 0.1.0
 * Requires Plugins: woocommerce
 */
if (!defined('ABSPATH')) exit;

/**
 * Prépare un habillage dédié du checkout WooCommerce natif.
 * Activation volontairement limitée au checkout WooCommerce normal avec ?comentre_preview=1.
 * Il faut vérifier un vrai checkout de test, les moyens express et le 3DS avant de l'ouvrir aux clientes.
 * Attention : ce prototype ne change PAS l'origine/domaine WordPress.
 */
add_filter('template_include', function($template) {
    if (!function_exists('is_checkout') || !is_checkout() || is_order_received_page()) return $template;
    if (!isset($_GET['comentre_preview']) || $_GET['comentre_preview'] !== '1') return $template;
    // Only shop managers/admins can view the experimental checkout.
    if (!current_user_can('manage_woocommerce')) return $template;
    if (!function_exists('WC') || !WC()->cart || WC()->cart->is_empty()) return $template;
    return __FILE__;
}, 99);

if (basename((string)($_SERVER['SCRIPT_FILENAME'] ?? '')) === basename(__FILE__) && !defined('ABSPATH')) exit;

// When loaded by template_include, WordPress and WooCommerce are already initialized.
// This is a checkout preview only, not a payment activation.
if (defined('ABSPATH') && did_action('template_redirect') && function_exists('is_checkout') && is_checkout() && isset($_GET['comentre_preview']) && current_user_can('manage_woocommerce')) {
    status_header(200);
    ?><!doctype html>
    <html <?php language_attributes(); ?>>
    <head>
      <meta charset="<?php bloginfo('charset'); ?>">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="robots" content="noindex,nofollow">
      <title>Paiement sécurisé — Com’ entre nous</title>
      <?php wp_head(); ?>
      <style>
        body{margin:0;background:#fff9f4;color:#171b2a;font-family:system-ui,sans-serif}
        .ce-shell{max-width:1100px;margin:auto;padding:24px 20px 80px}
        .ce-brand{text-align:center;padding:24px 0;border-bottom:1px solid #ecdcd7}
        .ce-brand strong{font-size:26px;font-family:cursive;color:#171b2a}
        .ce-brand small{display:block;letter-spacing:.1em;margin-top:8px}
        .ce-header{text-align:center;margin:45px auto 30px}
        .ce-header h1{font-family:cursive;font-size:clamp(36px,6vw,56px);margin:0 0 12px}
        .ce-header p{color:#65606a}
        .woocommerce{background:#fff;border-radius:24px;padding:clamp(15px,3vw,32px);box-shadow:0 10px 40px #2010190b}
        .woocommerce #payment,.woocommerce-checkout #payment{background:#fff4ef;border-radius:18px}
        .woocommerce button.button.alt,.woocommerce #payment #place_order{background:#171b2a;color:white;border-radius:30px;padding:16px 28px}
        .ce-foot{text-align:center;color:#68626b;font-size:13px;margin:32px auto}
      </style>
    </head>
    <body <?php body_class('comentre-checkout-preview'); ?>>
      <?php wp_body_open(); ?>
      <div class="ce-shell">
        <div style="background:#fff0c9;border:1px solid #e8c66d;color:#4c3a16;padding:12px 20px;border-radius:12px;text-align:center;font-weight:700">APERÇU ADMINISTRATEUR — Ne pas effectuer de paiement réel. Cette page utilise encore le domaine WordPress.</div>
        <header class="ce-brand"><strong>Com’ entre nous</strong><small>DES MOMENTS À PARTAGER</small></header>
        <div class="ce-header"><h1>Finaliser ma commande</h1><p>Paiement sécurisé par WooPayments</p></div>
        <main><?php echo do_shortcode('[woocommerce_checkout]'); ?></main>
        <p class="ce-foot">Un souci avec ta commande ? Contacte l'équipe Com’ entre nous.</p>
      </div>
      <?php wp_footer(); ?>
    </body></html><?php
    exit;
}
