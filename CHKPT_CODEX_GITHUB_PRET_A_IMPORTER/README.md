# CHKPT by RED LOOP — Prototype de démonstration

**Statut : prototype web en développement, non prêt pour un déploiement public.**

CHKPT est un réseau social de découverte de lieux et sorties, centré sur Cocody/Abidjan pour la démonstration. RED LOOP désigne l'écosystème et le projet porteur. L'objectif immédiat est de présenter le fonctionnement devant un jury FrancoTech et de potentiels financeurs, **pas** de commercialiser une application finie.

## Direction visuelle actualisée

Interface claire par défaut, mode sombre au choix, symbole CHKPT pour le bouton central. Voir [les choix et les captures réelles](docs/DIRECTION_VISUELLE_2026_10.md).

Le [profil compact et la navigation actualisée](docs/NAVIGATION_PAGES_ET_MENU.md) affichent rapidement les publications. Le menu personnel regroupe les enregistrés, visites privées, progression, récompenses et classement. Les recherches validées et les fiches s’ouvrent dans des pages avec Retour.

L'[accueil social actualisé](docs/ACCUEIL_SOCIAL.md) propose Pour toi et Amis, des cartes cohérentes avec le profil et des illustrations locales générées pour les publications fictives. Le bouton de validation s'intitule Confirmer le check.

Le [GPS et les fiches lieu](docs/GPS_ET_FICHE_LIEU.md) disposent d’un choix de position par liste et d’un affichage grand format, sans raccourci de check dans les fiches.

Le [partage des établissements et l’historique personnel](docs/PARTAGE_ET_HISTORIQUE.md) complètent les fiches et le profil. L’historique est réservé au propriétaire.

Voir aussi le [bilan complet du prototype](docs/BILAN_PROTOTYPE.md).

Les [compléments de démonstration](docs/EVOLUTIONS_DEMO.md) ajoutent bienvenue, recherche, filtres Carte, récompense fictive, aperçu établissement, profils suivis et avis.

L’[accès privé à distance](docs/ACCES_PRIVE_DISTANCE.md) est préparé pour Render avec un mot de passe visiteur distinct de l’opérateur. Aucun hébergement n’est créé automatiquement.

La [carte interactive et le moteur de progression](docs/CARTE_RADAR_ET_40_BADGES.md) utilisent un radar de 250 m et un barème de prototype calculé côté serveur. Seule une petite sélection de badges est affichée.

Le [questionnaire de conception](docs/QUESTIONS_CONCEPTION_PROTO_ET_VERSION_FINALE.md) peut être copié dans la conversation de conception pour préparer le prototype et la version finale.

La [synchronisation entre appareils et la sauvegarde chiffrée](docs/SYNCHRONISATION_ET_SAUVEGARDE.md) permettent de retrouver les publications, photos, favoris et visites avec le même compte. Le budget reste gratuit ; la persistance du disque de l’hébergeur n’est pas garantie.

Les [publications multimédias](docs/PUBLICATIONS_MEDIAS_ET_STORIES.md) acceptent jusqu’à quatre photos ou vidéos mélangées. Les [stories](docs/STORIES_PROTOTYPE.md) sont accessibles depuis l’accueil et les avatars, avec une durée de 24 h.

La [répartition des recherches, les relations et le classement](docs/RECHERCHE_SORTIR_ET_CLASSEMENT.md) précise Accueil général, Carte pour les lieux et Sortir éditorial avec classement mensuel.

Les [quatre profils et publicités fictives](docs/PROFILS_ET_PUBLICITES_DEMO.md) enrichissent le fil. La [revue de cohérence et sécurité](docs/AUDIT_FLUIDITE_SECURITE_2026_10_30.md) décrit les correctifs de sécurité. Le [lot suivant](docs/NAVIGATION_PAGES_ET_MENU.md) implémente les pages, le menu et le profil compact, localement en attente du dépôt privé.

## Voir la démonstration sans lire le code

Ouvrir **[la démonstration illustrée en PDF](docs/DEMONSTRATION_PAS_A_PAS.pdf)** : huit étapes avec les écrans réels et les gestes expliqués en français simple. Un navigateur suffit. Il s'agit de captures, pas d'une application interactive.

## Présentation privée — lots A à D

Le parcours complet, les visuels locaux et le support de présentation sont préparés.
Lire **[GUIDE_PRESENTATION.md](docs/GUIDE_PRESENTATION.md)** pour le démarrage opérateur,
le scénario de trois minutes, la checklist et les limites.
Le bouton **Démarrer la démo**, accessible après connexion opérateur, prépare le personnage et réinitialise le scénario.

- [Captures mobile et ordinateur](docs/captures)
- [Support de secours hors connexion](docs/DEMO_SECOURS.html) : télécharger le fichier HTML puis l'ouvrir dans le navigateur.
- [Visuels et droits](docs/VISUELS_ET_DROITS.md)

## Pour commencer sans coder

**Lis d'abord : [GUIDE_GITHUB_ET_CODEX_PAS_A_PAS.md](GUIDE_GITHUB_ET_CODEX_PAS_A_PAS.md).**

1. Déposer les **fichiers décompressés** dans un dépôt GitHub **privé** (ne pas envoyer un ZIP seul).
2. Connecter ce dépôt à **Codex Cloud**.
3. Donner à Codex le texte de `docs/PROMPT_01_CODEX.md`.
4. Vérifier ses changements puis valider une *pull request* avant d'essayer la démo.

Le fichier `AGENTS.md` est la notice de travail que Codex doit respecter. `docs/PASSATION_V3_SOURCE.md` contient l'historique du projet et l'audit V3.

## Composition du projet

- `src/` : écrans React, interactions, simulation des publications et de la carte
- `server.ts`, `server/` : serveur Express, comptes, check-ins, données de démonstration
- `tests/` : tests de code fournis dans l'export Google AI Studio ; résultats à revérifier
- `docs/` : besoins du produit, feuille de route, scénario de présentation, état des risques
- `.github/workflows/verification.yml` : tests automatiques GitHub (à exécuter, échec possible tant que le code n'est pas corrigé)

## Lancer sur son ordinateur (optionnel)

Prérequis : Node.js 22.12+ et npm (vérification locale effectuée avec Node 24.19.0).
Dans `CHKPT_CODEX_GITHUB_PRET_A_IMPORTER` :

```bash
npm ci
npm run demo
```

Le serveur écoute uniquement sur la machine locale par défaut (`HOST=127.0.0.1`, port 3000).
`npm run demo` prépare l'interface puis la sert sans surveillance des fichiers ni rechargements de développement. Cette commande fonctionne sur Mac et Windows. Pour modifier le code, `npm run dev` reste disponible ; les données `.data/` sont exclues de sa surveillance.
Il reconstitue un jeu de données **fictives** dans `.data/`, ignoré par Git.
Les outils de présentation sont désactivés par défaut. Un visiteur peut créer un compte
ordinaire depuis l'onglet Inscription ; aucun ancien jeton ou mot de passe de seed ne fonctionne.

Pour une présentation privée, lire [le guide du Lot A](docs/LOT_A_VERIFICATION.md).
La démo nécessite `CHKPT_PRIVATE_DEMO=true`, un mot de passe opérateur personnel
`CHKPT_DEMO_ADMIN_PASSWORD` d'au moins 16 caractères et une connexion à `redloop_admin`.
Ne jamais partager ce mot de passe ni versionner `.env`.

Vérifications :

```bash
npm run lint
npm run build
npm test
# Facultatif pour installer le navigateur utilisé par la recette :
npx playwright install chromium
npm run test:browser
```

`npm test` démarre lui-même ses serveurs et bases temporaires, puis les supprime.
Il ne faut plus lancer un serveur ni lui fournir `TEST_URL` pour cette commande.
Les tests de navigateur nécessitent d'abord `npm run build`.
Voir le guide pour utiliser un Chromium déjà installé.

## Attention avant tout partage de lien public

Le Lot A protège les outils de démonstration et neutralise les anciens accès prévisibles. Cela ne transforme pas ce prototype en application de production : conserver un accès privé pour la présentation. Les contrôles de rôle, de simulation et de reset sont définis par le serveur, jamais par le sélecteur du navigateur.

**GitHub conserve le code, mais n'héberge pas automatiquement cette application Express.** Un hébergement ou un environnement de prévisualisation sera à configurer dans une étape ultérieure.
