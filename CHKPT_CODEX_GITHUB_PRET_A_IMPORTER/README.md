# CHKPT by RED LOOP — Prototype de démonstration

**Statut : prototype web en développement, non prêt pour un déploiement public.**

CHKPT est un réseau social de découverte de lieux et sorties, centré sur Cocody/Abidjan pour la démonstration. RED LOOP désigne l'écosystème et le projet porteur. L'objectif immédiat est de présenter le fonctionnement devant un jury FrancoTech et de potentiels financeurs, **pas** de commercialiser une application finie.

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

Prérequis : Node.js 22 et npm, puis dans le dossier du projet :

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:3000` dans le navigateur. Le serveur reconstitue **un jeu de données fictives** dans `.data/` au premier démarrage. Ce dossier doit rester privé et est ignoré par Git.

Autres commandes : `npm run lint`, `npm run build`. Pour `npm test`, il faut **d'abord lancer le serveur** et prévoir une base de test isolée : les tests modifient/réinitialisent les données de démonstration.

L'installation et les tests **n'ont pas été exécutés avec succès pendant la préparation de cette archive** (dépendances non installées dans cet environnement). Codex devra les exécuter et consigner le résultat réel.

## Attention avant tout partage de lien public

L'export source contient des fonctionnalités de démonstration historiquement non protégées (`/api/auth/switch-demo`, `/api/demo/reset`) et des données/identifiants de démonstration prévisibles. Ne pas publier ce serveur sur Internet avant d'avoir demandé à Codex de corriger ces points et de confirmer les contrôles d'accès.

**GitHub conserve le code, mais n'héberge pas automatiquement cette application Express.** Un hébergement ou un environnement de prévisualisation sera à configurer dans une étape ultérieure.
