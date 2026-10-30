# Décision d'architecture — 30 octobre 2026

## Contraintes non négociables
- La cliente reste sous une URL Com’ entre nous pendant la commande.
- Aucun paiement autonome Stripe, aucune nouvelle connexion WooPayments à une seconde boutique.
- WooCommerce du WordPress comunoracle.marionbolomey.fr reste la base des commandes, des téléchargements et des remboursements.
- Le site public comentrenous.marionbolomey.fr reste une application statique Next.js sur Infomaniak.

## Vérifications
- Le diagnostic WooCommerce renvoie `woocommerce_payments: enabled` (ainsi que Apple Pay, Google Pay et Klarna déclarés activés).
- La page de checkout WordPress est `/commander/` (ID 12). Avec panier vide, WooCommerce peut rediriger vers `/panier/`.
- Le module `integrations/wordpress/comentre-checkout` est un aperçu administrateur sur le domaine WordPress; il ne résout **pas** le problème du domaine client ni le partage de session.
- Infomaniak propose un alias de domaine, mais **ne pas l'ajouter pour l'instant**.
- WooPayments documente un mode sécurisé quand deux URLs pointent sur la même installation WP : https://woocommerce.com/document/woopayments/testing-and-troubleshooting/safe-mode/
- WooCommerce met en garde contre les désaccords d'hôte, cookies, chemins API et proxies au checkout : https://woocommerce.com/document/endless-loadingspinner-on-the-checkout-page/

## Décision provisoire
Ne pas créer `paiement.comentrenous.marionbolomey.fr` comme simple alias tant que la topologie finale et les règles de réécriture WP/SSL/session ne sont pas approuvées/testées.
Ne pas changer `WP_HOME`, `WP_SITEURL`, DNS ou WooPayments sur un site en production sans sauvegarde et plan de retour arrière.

## Scénarios à faire expertiser
A. **Migration contrôlée d'origine de l'installation WooCommerce** vers `paiement.comentrenous.marionbolomey.fr` (un seul domaine canonique pour WP/WooPayments) : l'ancien site Com’un Oracle pourrait être impacté, ce qui nécessite inventaire et plan de migration. Le site public Com’ entre nous reste distinct.
B. **Publication d'un checkout WooCommerce en proxy sur le domaine Com’ entre nous** : nécessite expertise WordPress/Infomaniak, réécriture absolue des URLs, AJAX/Store API, cookies, CSRF, 3DS, webhooks, Apple Pay et exclusions de cache. Un simple alias ne suffit pas. Compatibilité WooPayments non garantie.
C. **Checkout headless WooPayments** : demander au support WooPayments la méthode officiellement supportée de tokenisation et de `payment_data` pour un frontend cross-origin. Ne pas utiliser les exemples du plugin Stripe standard : ce ne sont pas les mêmes identifiants.

## Critères de validation avant mise en vente
- aucune URL `comunoracle.marionbolomey.fr` affichée à la cliente (navigateur, retours de paiement, e-mail produit et liens de téléchargement);
- cart session et total préservés; panier d'un seul produit; contrôle des catégories autorisées;
- paiement test accepté, refusé, authentification 3DS, retour et suppression d'item; pas de commande doublon;
- e-mails et PDF accessibles après paiement confirmé; refus pour commande non payée;
- Apple Pay / Google Pay validés séparément sur le nouveau domaine;
- plan de sauvegarde, rollback et vérification des commandes Com’un Oracle existantes.

## Prochaine opération
Soumettre les scénarios A et B au support technique Infomaniak + WooPayments pour valider l'approche autorisée pour cette configuration exacte, **avant toute modification DNS ou WP**.
