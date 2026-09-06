# Déploiement Infomaniak

Objectif : publier le site sur `comentrenous.marionbolomey.fr`.

## Architecture prévue

- Site : Next.js / Node.js
- Hébergement : Infomaniak Web + application Node.js
- Code : GitHub
- Boutique : fiches produits dans `src/data/products.ts`, avec liens Amazon / Stripe / PayPal / Gumroad selon les produits.

## Variables/secrets GitHub à prévoir

Dans GitHub > Settings > Secrets and variables > Actions :

- `INFOMANIAK_HOST` : hôte SSH Infomaniak
- `INFOMANIAK_USER` : utilisateur SSH
- `INFOMANIAK_PORT` : souvent 22
- `INFOMANIAK_SSH_KEY` : clé privée SSH autorisée sur Infomaniak
- `INFOMANIAK_APP_PATH` : chemin du dossier de l’app sur l’hébergement

## Configuration Node côté Infomaniak

Scripts :

- Installation : `npm ci`
- Build : `npm run build`
- Start : `npm run start`

Port : utiliser la variable `PORT` fournie par Infomaniak.

## Notes

Le workflow est préparé, mais les secrets doivent être ajoutés dans GitHub par la propriétaire du compte. Aucun mot de passe ne doit être collé dans le chat.
