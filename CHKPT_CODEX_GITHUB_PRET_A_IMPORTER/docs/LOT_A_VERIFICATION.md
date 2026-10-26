# Lot A — Accès privés, check-in et vérification

Ce lot conserve React, Express, les cinq sections et les données fictives. Aucun travail des lots B–D.
Ce prototype reste réservé à une démonstration privée, non prêt pour la production.

## Lancer une présentation privée

Depuis `CHKPT_CODEX_GITHUB_PRET_A_IMPORTER`, avec Node 22.12+ :

```bash
npm ci
export CHKPT_PRIVATE_DEMO=true
read -rsp 'Mot de passe opérateur (16 caractères minimum) : ' CHKPT_DEMO_ADMIN_PASSWORD
export CHKPT_DEMO_ADMIN_PASSWORD
npm run dev
```

Le mot de passe saisi reste dans le processus local, pas dans l'historique des commandes.
Un fichier `.env` local ignoré est également pris en charge ; `.env.example` décrit les noms.
Ne jamais envoyer la valeur dans un commit, une PR ou une conversation.

1. Ouvrir l'application locale sur le port 3000 ; ouvrir « Profil & Compte Démo ».
2. Dans Connexion, utiliser `redloop_admin` et le mot de passe personnel saisi au démarrage.
3. Dans « Profils Démo (opérateur) », choisir Koffi ou Sarah pour jouer le scénario.
4. Après bascule vers un compte ordinaire, se reconnecter comme opérateur pour changer de persona ou réinitialiser.
5. Un reset autorisé efface les comptes créés pendant la démo, les visites, les médias et les sessions.
   Se reconnecter ensuite comme opérateur, puis sélectionner le persona pour rejouer.

Sans activation explicite, les outils et comptes de seed restent inaccessibles. Les inscriptions ordinaires fonctionnent.
La préférence GPS du navigateur n'active aucune permission serveur. La clé Gemini reste facultative.
`HOST` vaut `127.0.0.1` par défaut ; ne pas exposer la démo sur Internet.

## Vérifier sans toucher aux données de présentation

```bash
npm run lint
npm run build
npm test
npx playwright install chromium
npm run test:browser
```

Les tests démarrent leurs propres serveurs sur des ports libres, génèrent un secret éphémère,
utilisent des bases dans un répertoire temporaire et arrêtent leurs serveurs à la fin.
`TEST_URL` n'est pas utilisé par le nouveau lanceur. Le test historique seul reste disponible
dans `tests/security_and_checkin.test.ts`, mais il ne faut jamais le viser sur une vraie base.

Pour utiliser un navigateur système déjà installé :

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Vérifications locales effectuées avec Node 24.19.0 et npm 11.9.0 : installation propre par `npm ci`,
typage, compilation, suite historique (11 tests), contrôles complémentaires des accès,
simulation, coordonnées, mineurs, confidentialité et migration des anciennes bases.
Parcours navigateur vérifié aux largeurs 390 et 1280 pixels : carte → fiche → check-in au bon lieu,
simulation explicite, absence de résultat périmé à la réouverture, autre lieu bien transmis et refus hors rayon.
Un refus de reset conserve la session et affiche l'erreur au lieu de prétendre réussir.

Le workflow GitHub fourni reprend ces commandes avec Node 22. Son résultat distant devra être observé sur GitHub.

## Limites conservées

- Ces contrôles ne sont pas un audit de production ni une preuve anti-fraude GPS : des coordonnées
  annoncées comme réelles viennent toujours du client. Le serveur vérifie leur distance, pas leur origine physique.
- Les médias restent en mémoire ; les comptes et sessions restent dans une base JSON locale.
- La démo utilise toujours des contenus fictifs et des photos externes. Les tests de navigateur bloquent
  les photos externes pour rester indépendants du réseau ; ils n'attestent pas leur disponibilité.
- Gemini et l'ensemble du scénario des lots suivants ne sont pas validés par ce lot.
- Un redémarrage révoque les sessions des personas de seed et applique le mot de passe configuré.
  Les comptes ordinaires, leurs données et leurs sessions valides sont conservés.
