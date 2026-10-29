# Paiement Com’ entre nous avec WooPayments — décision et vérifications

## Objectif client
Une fiche commerciale complète sur comentrenous.marionbolomey.fr ; achat direct d'un ebook à la fois ; aucune exposition de la vitrine comunoracle.marionbolomey.fr. WooCommerce et WooPayments restent la source des commandes, paiements, permissions de téléchargement et e-mails.

## État vérifié
- WooPayments est actif dans l'administration WooCommerce ; PayPal demande une configuration.
- WooCommerce est connecté à Com’ entre nous via woo-bridge.php ; public-products exclut les brouillons.
- Les fiches et le panier sont visibles sur Com’ entre nous.
- Aucune transaction de test confirmée en flux headless WooPayments ; ne pas annoncer un checkout prêt.
- Le mode Next.js du site est `output: 'export'`, statique sur Infomaniak. Une page React ne peut donc pas appeler directement un module serveur WooPayments.
- La passerelle existante supporte cart, cart-add, cart-update et cart-remove, mais **pas** checkout avec WooPayments.
- Le code expérimental de paiement Stripe autonome a été supprimé pour éviter de doubler WooPayments.

## Points à valider AVANT d'activer une vente
1. Identifier l'ID réel de passerelle WooPayments (ne pas confondre avec le plugin WooCommerce Stripe Payment Gateway).
2. Déterminer le mécanisme officiel compatible avec l'API WooCommerce Store API Checkout, notamment les `payment_data` WooPayments, la tokenisation et 3DS/SCA. Les exemples Stripe standard ne garantissent pas la compatibilité WooPayments.
3. Décider si une page checkout 100 % Com’ entre nous peut légalement/techniquement présenter les champs bancaires en composant sécurisé WooPayments. Ne jamais collecter ou relayer les numéros de carte dans un PHP maison.
4. Préserver la session panier WooCommerce et la protection CSRF avec Cart-Token/Nonce, valider l'ordre, le total et les produits côté serveur.
5. Vérifier WooPayments en mode test : paiement réussi, refusé, authentification bancaire, commande unique, droits PDF, e-mail, lien Mon espace et remboursements.
6. Si WooPayments n'offre pas d'intégration cross-domain fiable sans afficher l'ancien domaine, prévoir une option éprouvée (par exemple transfert vers une page WooCommerce en marque blanche sur un sous-domaine Com’ entre nous clairement assumé) et demander validation avant tout changement de domaine/DNS/checkout.

## Consigne opérationnelle
Ne pas proposer de bouton de paiement direct opérationnel avant les tests ci-dessus. Ne pas publier le calendrier 665 pour tester un paiement non validé. Ne jamais exposer consumer_secret, token WordPress, Stripe/WooPayments ou webhook secret dans le client ni dans le dépôt.
