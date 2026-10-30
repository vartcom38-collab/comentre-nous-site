# Migration WooCommerce vers Com’ entre nous — plan d'exécution

Date : 30 octobre 2026. **Préparation uniquement, aucune intervention sur Infomaniak réalisée.**

## Architecture décidée
- Vitrine Next.js statique et administration existante conservées à `https://comentrenous.marionbolomey.fr/`.
- Installation **indépendante** de WordPress + WooCommerce sous `https://comentrenous.marionbolomey.fr/commerce/`, dans un dossier `commerce` du document root existant. Éviter tout WordPress à la racine.
- Paiement WooCommerce natif à `/commerce/commander/` après les tests.
- Les produits restent dans WooCommerce, mais l'API du site devra ensuite pointer vers cette nouvelle installation. Prévoir refonte des identifiants produits, variantes et sessions de panier, et conserver l'historique des commandes.
- Les URL WooCommerce doivent avoir une origine canonique UNIQUE sous `comentrenous.marionbolomey.fr`. Ne pas utiliser d'alias vers le WordPress Com’un Oracle.

## Préflight avant installation
1. Sauvegarder l'intégralité des fichiers du site Com’ entre nous, y compris les fichiers PHP, `woo-private.php` (hors GitHub), les règles .htaccess, et vérifier le point de restauration Infomaniak.
2. Sauvegarder la base de données et les fichiers de Com’un Oracle, notamment WooCommerce, produits téléchargeables, permissions, transactions, commandes et réglages des webhooks.
3. Vérifier le document root du site principal; confirmer que `/commerce/` n'existe pas et ne sert pas au contenu existant.
4. Vérifier la possibilité d'installer **dans un sous-répertoire sur site non vierge**. Ne jamais cliquer sur « Ajouter une application » puis valider sans aperçu du chemin cible.
5. Créer une **base de données MySQL distincte** pour la nouvelle installation WordPress; ne pas partager la base Com’un Oracle.
6. Prévoir les règles Apache de réécriture **dans `/commerce/.htaccess` uniquement**, sans remplacer celles du site principal. Vérifier que le déploiement GitHub ne supprime pas ce dossier.
7. Vérifier version PHP et extensions WordPress/WooCommerce (Site PHP 8.4 indiqué sur capture).

## Ordre d'exécution
**Phase 1 — Isolation :** installation WordPress en /commerce/ avec une base séparée, accès restreint, moteurs de recherche bloqués. Installation WooCommerce ; choisir le type produits numériques; configurer TVA/mentions légales; pas de WooPayments réel.
**Phase 2 — Migration de données :** export produits et fichiers PDF depuis l'ancien Woo; import dans le nouveau; images, catégories `com-en-famille` / `com-des-entrepreneuses`, SKU et autorisations ; décider explicitement du traitement des anciennes commandes/comptes (les migrations de données clients comportent des obligations de confidentialité).
**Phase 3 — WooPayments :** sur l'ancien compte, suivre la procédure officielle de transfert de connexion, pas une création de compte Stripe autonome; attention l'ancienne connexion est débranchée, planifier fenêtre de bascule. Vérifier conditions et licences et ne pas transférer avant parcours pré-testé.
**Phase 4 — Checkout :** créer page de commande WooCommerce dans /commerce/, identité Com’ entre nous; produit unique; adapter le bouton Acheter maintenant et le panier existant en préservant les sessions; brancher le PHP bridge sur **les nouvelles clés REST** enregistrées hors dépôt.
**Phase 5 — Recette :** tests achat accepté/refusé, 3DS, wallets, reçu, accès PDF, permissions après paiement, compte client, remboursement, mobile, fuite d'URL Com’un Oracle; appliquer rollback si erreur.
**Phase 6 — Mise en production :** activer les CTA après validation; conserver ancienne base en lecture seule/sauvegarde; retirer le diagnostic public `woo-checkout-capabilities.php` et le prototype temporaire sur Com’un Oracle lorsque plus nécessaire.

## Attention
- La migration **ne reprend pas automatiquement** les comptes, commandes, paiements, PDF, téléchargements et clés de WooCommerce. Ne pas supprimer l'ancien WordPress.
- WooPayments se rattache à l'identifiant de site; le transfert doit suivre les procédures officielles et peut activer Safe Mode. Ne pas tenter de dupliquer la connexion en production.
- Aucun changement de DNS requis pour un vrai sous-dossier; pas de nouveau site Infomaniak requis si l'installation du sous-dossier est prise en charge.
- Le site Web FTP ne doit jamais contenir de mot de passe de base de données ou clé de paiement dans les fichiers partagés via GitHub.

Sources :
https://fr.wordpress.org/support/article/how-to-install-wordpress/
https://woocommerce.com/document/woopayments/account-management/site-migrations/
https://woocommerce.com/document/woopayments/testing-and-troubleshooting/safe-mode/
https://www.infomaniak.com/fr/support/faq/1931/installer-rapidement-wordpress-desinstaller
