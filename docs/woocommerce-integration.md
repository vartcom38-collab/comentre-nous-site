# WooCommerce — catalogue unique

La source unique des produits sera WooCommerce, et non content/products.json.

## Association des formats

Créer une fiche ebook téléchargeable et, si besoin, une fiche externe Amazon dans WooCommerce. Attribuer un identifiant de famille commun : par exemple `AVENT2026-EBOOK` et `AVENT2026-AMAZON` dans les champs SKU. Le site doit les regrouper par préfixe en une seule fiche visible. L'ebook est acheté avec WooCommerce / Stripe ; la version papier renvoie à Amazon.

## Avant mise en production

- Prévoir la connexion serveur à l'API WooCommerce, sans exposer les identifiants dans le navigateur.
- Remplacer la lecture du catalogue JSON dans /boutique et les pages produits par une lecture WooCommerce.
- Tester produits publiés et brouillons, images, prix, lien Amazon, commande Stripe en mode test et livraison PDF.
- Tester les erreurs réseau et vérifier qu'aucun produit non disponible n'affiche un bouton d'achat actif.
- Ne retirer l'ancien parcours que lorsque la nouvelle boutique fonctionne et que le déploiement est validé.

La création de cette note et des raccourcis d'admin ne constitue pas une synchronisation opérationnelle.