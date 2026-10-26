# À coller dans Codex — PREMIÈRE MISSION

Je te confie le dépôt CHKPT by RED LOOP, importé de Google AI Studio.

Lis d'abord `AGENTS.md`, le `README.md` et les cinq documents du dossier `docs`, notamment `docs/ETAT_CODE_ET_RISQUES.md`, `docs/FEUILLE_DE_ROUTE_CODEX.md` et `docs/PASSATION_V3_SOURCE.md`.

Notre objectif immédiat est un prototype de présentation pour Ingrid (FrancoTech Cocody) et pour des partenaires/financeurs. **Ne repars pas de zéro.** Préserve les interfaces et les fonctionnalités existantes et évite tout chantier de production non demandé.

Exécute d'abord un diagnostic de l'archive telle qu'elle existe : installation, commande de build, lint et tests réels (démarre le serveur et isole les données de test). Ne suppose pas que les « 11 tests » déclarés sont prouvés.

Réalise ensuite uniquement le **lot A** de `docs/FEUILLE_DE_ROUTE_CODEX.md` : sécurise la bascule de profil démo, l'accès au compte admin et la route reset, isole les données/identifiants de démonstration et corrige la présélection du lieu quand on lance le check-in depuis une fiche. Ajoute des tests de non-régression. S'il faut choisir entre production complète et prototype privé, garde un mode démo explicite mais sécurisé par le serveur.

Après les corrections, exécute les vérifications disponibles et présente : (1) la liste des fichiers modifiés, (2) les tests réellement lancés avec résultat, (3) ce qui reste simulé, (4) les risques encore ouverts et (5) le meilleur moyen de voir la démo. Mets à jour les fichiers de suivi pertinents.

Prépare tes modifications dans une branche ou une pull request. Ne déploie pas en public sans autorisation et sans validation de sécurité. N'entame pas les lots B, C et D sans ma demande.
