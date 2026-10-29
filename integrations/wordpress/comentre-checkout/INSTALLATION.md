# Prototype checkout Com’ entre nous — installation de test uniquement

**Statut : NON DÉPLOYÉ.** Aucun client ne doit recevoir cette URL ni aucun bouton acheter maintenant ne doit y mener.

## Où installer
L'installation WordPress/WooCommerce est sur **comunoracle.marionbolomey.fr**, distincte de l'hébergement statique de **comentrenous.marionbolomey.fr**. Ne pas copier ce plugin dans le dossier où se trouve le `index.html` du site Com’ entre nous.

Copier `comentre-checkout.php` dans le dossier **`wp-content/plugins/comentre-checkout/`** du WordPress, puis activer l'extension sous **Extensions**. Effectuer d'abord une sauvegarde, de préférence une préproduction. La version courante est un prototype et ne remplace pas la page de commande par défaut.

## Comment afficher l'aperçu
- Se connecter comme administrateur du WordPress contenant WooCommerce.
- Ajouter `?comentre_preview=1` à la véritable URL de page **Commande** WooCommerce (`&comentre_preview=1` si elle a déjà des paramètres).
- L'aperçu ne s'affiche qu'aux utilisateurs autorisés à gérer WooCommerce.
- Ce prototype conserve le formulaire `[woocommerce_checkout]` et charge `wp_head()` / `wp_footer()` pour les scripts de paiement.
- **NE PAS VALIDER DE PAIEMENT EN PRODUCTION** durant cette inspection : un vrai bouton de commande peut encore être présent si WooPayments est en mode réel.

## Limitations impératives
Ce prototype n'est pas un checkout headless : il ne transporte pas le panier Com’ entre nous sur le WordPress, ne change pas le domaine WordPress, ne garantit pas les méthodes express et ne teste pas 3DS. Un simple reverse proxy WooCommerce non configuré peut casser les cookies de session, les URLs absolues, les retours de paiement ou les wallets. **Ne pas mettre en place de proxy non testé.**

Avant activation client :
1. Décider avec l'hébergeur d'une véritable origine de paiement en marque blanche, compatible avec les sessions WordPress et WooPayments.
2. Valider la création du panier WooCommerce dans la même session, sans copier un Cart-Token dans un lien.
3. Utiliser WooPayments en mode test ; contrôler une commande valide, une carte refusée, l'authentification 3DS, l'email et le fichier PDF.
4. Contrôler la visibilité du domaine de paiement pour la cliente et les retours/annulations.
5. Quand tout est passé, concevoir le vrai bouton Acheter maintenant, jamais avant.

## Diagnostic précédent
Le diagnostic `woo-checkout-capabilities.php` a confirmé `woocommerce_payments` actif. Il ne prouve ni que les champs bancaires fonctionnent sur un autre domaine ni que le paiement sera accepté. Après ces contrôles, supprimer le diagnostic public du serveur Com’ entre nous.
