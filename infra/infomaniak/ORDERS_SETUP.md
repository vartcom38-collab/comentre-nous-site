# Commandes Papeterie — activation Infomaniak

Le code du backend est déjà déployable avec le site statique. Les données clientes restent dans MariaDB chez Infomaniak et ne sont jamais stockées dans GitHub.

## 1. Créer les tables dans MariaDB

Dans le Manager Infomaniak, ouvrir **Connexion à phpMyAdmin**, sélectionner la base :

- Base : `ng43h__comentrenous`
- Hôte : `ng43h.myd.infomaniak.com`
- Port : `3306`
- Utilisateur : `ng43h_comentreno`

Puis ouvrir l’onglet **Importer** et importer `infra/infomaniak/orders-schema.sql`, ou copier son contenu dans l’onglet SQL puis exécuter.

Les tables créées sont :

- `orders`
- `order_items`
- `order_status_history`

## 2. Ajouter les secrets GitHub

Dans le dépôt GitHub : **Settings → Secrets and variables → Actions → New repository secret**.

Créer :

- `COMENTRE_DB_PASSWORD` : mot de passe MariaDB de `ng43h_comentreno`
- `COMENTRE_ORDERS_ADMIN_KEY` : une longue clé aléatoire réservée à l’espace commandes d’Aurélie
- `AURELIE_ORDER_EMAIL` : facultatif, email qui reçoit une notification sans adresse postale lorsqu’une nouvelle commande est créée

Ne jamais enregistrer ces valeurs dans un fichier du dépôt.

Au prochain déploiement, GitHub Actions génère `out/api/comentre/_runtime.php` uniquement pendant le build et l’envoie au serveur. Ce fichier n’existe pas dans le dépôt.

## Endpoints

- `POST /api/comentre/order-create.php` : création d’une commande en statut `pending/new` ; à raccorder au checkout final
- `GET /api/comentre/orders-admin.php` : commandes attribuées à Aurélie, protégé par clé admin
- `POST /api/comentre/order-update.php` : statut, transporteur et suivi, protégé par clé admin
- `POST /api/comentre/order-track.php` : suivi cliente par numéro + email

## Interfaces

- `/admin/papeterie/commandes/` : gestion des commandes par Aurélie
- `/suivi-commande/` : suivi côté cliente

## Avant mise en production du paiement

Le checkout/paiement doit fournir au serveur des montants vérifiés côté serveur ou via webhook du prestataire de paiement. Ne pas considérer une commande comme payée sur la seule base de valeurs envoyées par le navigateur.
