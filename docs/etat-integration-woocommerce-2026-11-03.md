# Intégration Com’ entre nous ↔ WooCommerce — état réel au 3 novembre 2026

## Cible
- Conserver la vitrine Next.js existante, les chemins des pages, la DA, le menu et l’administration Com’ entre nous.
- WooCommerce doit devenir l’unique source commerciale des produits, prix, fichiers téléchargeables, commandes et droits d’accès.
- WooPayments doit gérer le checkout natif sur le domaine Com’ entre nous, **sans** rediriger les clientes vers Com’un Oracle ou la boutique de test.
- Une même version de produit ne doit pas avoir deux sources de vérité contradictoires.

## Ce qui est prêt dans le dépôt
- Site existant : catalogue `/boutique/`, détail `/boutique/produit/?id=...`.
- Passerelle actuelle `public/woo-bridge.php` : catalogue et panier encore rattachés à la configuration `sites/woo-private.php` de **Com’un Oracle**. Ne pas modifier cette configuration avant la bascule.
- Nouvelle connexion de test : `sites/woo-test-private.php`, **hors dépôt**. La vérification en lecture seule a répondu HTTP 200 avec un brouillon.
- `public/woo-test-catalog.php` lit exclusivement les produits publiés de la boutique de test et ne renvoie jamais les URLs des fichiers PDF, clés API ou données de commandes. Il répond en JSON et dispose d’un aperçu PHP `?view=1`.
- `/boutique/apercu-test/` : vitrine à la DA Com’ entre nous alimentée par ce fichier ; fiches détaillées `/boutique/produit/?source=test&id=ID`, avec boutons d’achat désactivés.
- Les produits en brouillon ne s’affichent pas dans ces pages, y compris le produit de test à 1 €.
- Les nouveaux composants React doivent être compilés et déployés sur Infomaniak. Un commit GitHub seul ne garantit pas leur présence sur le site en ligne.

## Décisions indispensables avant la mise en vente
1. Installer ou déplacer le NOUVEAU WordPress WooCommerce sous `https://comentrenous.marionbolomey.fr/commerce/` en préservant le répertoire du site Next.js, ses fichiers PHP, son `.htaccess` et `woo-private.php`. **Ne pas créer un alias ou réécrire toute la racine du site.**
2. Vérifier les permaliens WordPress, le stockage privé des PDF, les catégories et les produits ; conserver les références SKU et prendre en compte les changements d’ID Woo.
3. Créer des clés REST distinctes pour le WooCommerce définitif. Lecture seule pour les lecteurs publics du catalogue ; écriture uniquement pour les opérations d’administration, derrière une autorisation robuste et jamais exposée au navigateur.
4. Réviser la synchronisation de l’administration personnalisée : création, édition, publication, téléversement PDF, suppression, catégorie, image, SKU, et gestion des erreurs/retours WooCommerce. Ne pas permettre que le « Publier » local prétende avoir publié sur WooCommerce sans réussite de l’API.
5. Basculer le panier **et** les fiches produits vers la même instance WooCommerce, sans mélanger les ID de l’ancien site et du nouveau. Vérifier la continuité des sessions et l’URL de checkout sur le même domaine.
6. Configurer WooPayments sur la NOUVELLE instance dans les règles de migration et de Safe Mode ; ne déconnecter ni ne basculer l’ancienne instance prématurément.
7. Tester une transaction (y compris échec/3DS), l’e-mail WooCommerce, les liens de téléchargement, l’accès depuis `/mon-espace/`, les remboursements, le mobile, la TVA et les conditions.
8. Vérifier les droits d’accès aux PDF. Un simple lien public non protégé n’est pas une solution d’autorisation de téléchargement.
9. Organiser sauvegarde, retour arrière, confidentialité des données clients et suppression des sondes de diagnostic lorsque les essais sont terminés.

## Interdictions pendant les tests
- Ne pas publier ou acheter le produit de test par inadvertance.
- Ne pas exposer les secrets API, URL PDF privées ou identifiants WordPress dans GitHub ou des routes publiques.
- Ne pas changer `woo-private.php` ni utiliser `woo-test-private.php` pour des appels d’écriture : la clé de test est lecture seule.
- Ne pas promettre que les paiements et téléchargements sont actifs tant qu’aucun achat bout-en-bout n’a été validé.

## Fichiers de cette étape
- `public/woo-test-catalog.php` (adaptateur API de test en lecture seule)
- `app/boutique/apercu-test/page.tsx`
- `app/boutique/apercu-test/preview.module.css`
- `app/boutique/produit/page.tsx` (paramètre `source=test`)
- `app/boutique/produit/product.module.css` (DA existante)

## Opérations côté hébergement à réaliser séparément
- Déployer la version compilée des pages Next.js et le fichier PHP `public/woo-test-catalog.php` mis à jour.
- Vérifier l’accès au site de test WordPress et à son panneau administrateur.
- Décider et effectuer, après sauvegardes, le rattachement du WordPress au répertoire définitif.
- Procéder à WooPayments seulement avec accès WordPress et autorisation explicite.
