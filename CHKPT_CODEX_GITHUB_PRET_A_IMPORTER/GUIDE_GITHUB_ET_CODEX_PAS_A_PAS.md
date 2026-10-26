# Guide ultra-simple : faire travailler Codex sur CHKPT grâce à GitHub

## D'abord, imagine trois objets

- **Ton ordinateur** : là où tu décompresses le carton ZIP.
- **GitHub** : une armoire fermée à clé où tu ranges les **fichiers du code**. Ce n'est pas automatiquement un site web qui fait tourner CHKPT.
- **Codex** : l'ouvrier qui lit les fichiers dans cette armoire, les corrige, les teste et te propose une nouvelle version.

Tu n'as pas besoin de programmer pour les premières étapes. Prévois seulement tes comptes GitHub et ChatGPT/Codex.

## 1. Récupérer les fichiers

1. Télécharge `CHKPT_CODEX_GITHUB_PRET_A_IMPORTER.zip` depuis ChatGPT.
2. Ouvre le dossier `Téléchargements` sur ton ordinateur.
3. **Double-clique sur le ZIP** pour le décompresser.
4. Ouvre le dossier extrait : tu dois voir `README.md`, `AGENTS.md`, `package.json`, `server.ts`, les dossiers `src`, `server`, `tests`, `docs`.
5. **Ne téléverse pas seulement le ZIP dans GitHub** : Codex doit voir les fichiers séparément.

Sur Mac, pour afficher les fichiers qui commencent par un point (`.gitignore`, `.env.example`, `.github`), presse **Cmd + Maj + . (point)** dans le Finder.

## 2. Créer la maison GitHub du projet

1. Va sur **https://github.com/** et connecte-toi.
2. Clique sur le `+` en haut à droite, puis **New repository** (Nouveau dépôt).
3. Nom conseillé : **`chkpt-by-red-loop`**.
4. Choisis **Private** (Privé). C'est important : le prototype contient encore des fonctions de démonstration à sécuriser.
5. Laisse **Add a README file**, **Add .gitignore** et **Choose a license** non sélectionnés : ces fichiers sont déjà dans notre ZIP (pas besoin de les dupliquer).
6. Clique sur **Create repository**.

**Si tu possèdes déjà un dépôt CHKPT**, ne recrée pas de dépôt par-dessus. Garde celui que tu utilises et sauvegarde sa version avant tout remplacement ; importe d'abord sur une nouvelle branche si le dépôt contient déjà du code plus récent.

## 3. Mettre les fichiers dans GitHub

1. Sur la page du nouveau dépôt vide, clique sur le lien **uploading an existing file**. Si ton dépôt n'est pas vide, cherche **Add file → Upload files**.
2. Retourne dans le dossier **décompressé** de CHKPT sur ton ordinateur.
3. Sélectionne **tous les fichiers et sous-dossiers à l'intérieur** du dossier (pas le ZIP, et idéalement pas le dossier parent).
4. Glisse-les sur la zone de dépôt du navigateur ; si des sous-dossiers ne se téléchargent pas correctement, utilise la méthode GitHub Desktop donnée plus bas.
5. Vérifie que les dossiers `src/`, `server/`, `tests/`, `docs/`, `.github/` et le fichier `AGENTS.md` figurent dans la liste.
6. En bas, pour le message, mets **`Import initial du prototype CHKPT pour Codex`**.
7. Clique sur **Commit changes** (Enregistrer les changements).
8. Sur la page principale du dépôt, vérifie que tu vois `package.json`, `AGENTS.md`, `README.md`, `server.ts` et `src/`.

**Important :** ne dépose jamais `.data/chkpt_db.json`, une vraie clé API, `.env` ou une archive ZIP imbriquée. Ils ont été retirés/ignorés dans le paquet.

**Plan B si le glisser-déposer ne garde pas les dossiers :** installer [GitHub Desktop](https://desktop.github.com/), utiliser **File → Add local repository** si le dossier est déjà un repo Git, ou **File → New repository** en sélectionnant le dossier local comme racine, puis **Publish repository** en mode Private. Pour un dépôt créé sur le site avant cela, utiliser GitHub Desktop pour le cloner d'abord, puis copier les fichiers à l'intérieur et créer un commit. L'assistant de Github Desktop guide ces étapes.

## 4. Relier GitHub à Codex

1. Ouvre **https://chatgpt.com/codex** (ou la section Codex de ChatGPT).
2. Si Codex demande **Connect to GitHub**, clique dessus.
3. Autorise la connexion dans GitHub et donne accès au dépôt **`chkpt-by-red-loop`**. Tu peux limiter l'accès à ce dépôt uniquement.
4. Choisis le dépôt comme projet/environnement Codex Cloud ; crée et publie l'environnement si l'interface le demande.
5. Si la préparation technique te demande une commande d'installation, utilise **`npm install`** (Node.js 22 conseillé). Ne colle aucune véritable clé dans un fichier versionné.
6. Ouvre une tâche Codex dans ce dépôt ; copie le message du fichier **`docs/PROMPT_01_CODEX.md`**.

**À savoir :** tu n'as pas besoin de renvoyer le ZIP à Codex ; il lit les fichiers GitHub. L'apparence des boutons peut varier selon la version de l'interface. Si ton dépôt n'apparaît pas, vérifie les autorisations de GitHub et de Codex pour ce dépôt.

## 5. Première mission de Codex : réparer avant d'embellir

Envoie **le prompt 01** sans ajouter d'autres gros objectifs. Il doit :
- lire `AGENTS.md` et l'historique,
- vérifier si le projet s'installe et se construit,
- réparer les accès administrateurs et la fonction reset,
- réparer le passage de la fiche d'un lieu vers son check-in,
- produire des tests et une liste claire de ce qui reste simulé.

**Ne lui demande pas encore d'ajouter toutes les fonctionnalités de Red Loop.** Nous voulons d'abord une démonstration de trois minutes fiable.

## 6. Récupérer les corrections de Codex

1. Codex présente les fichiers modifiés et éventuellement une **pull request** (demande de modification).
2. Lis son résumé : ce qu'il a corrigé et quels tests il a réellement lancés.
3. Clique sur la pull request dans GitHub ; consulte la rubrique **Files changed** (Fichiers modifiés).
4. Si les résultats sont satisfaisants, clique sur **Merge pull request**, puis confirme.
5. Ta branche principale GitHub contient alors le nouveau code. Si Codex n'a pas proposé de pull request, demande-lui d'en créer une à partir de sa branche de travail ; ne suppose pas que son travail est déjà sauvegardé.
6. Pour la prochaine mission, retourne dans Codex et ouvre une tâche sur le dépôt **mis à jour** avec `docs/PROMPT_02_CODEX.md`.

## 7. Voir CHKPT fonctionner

- **Sur ton propre ordinateur (le plus direct)** : ouvre le dépôt téléchargé/cloné, exécute `npm install` puis `npm run dev` avec Node 22, ouvre `http://localhost:3000`.
- **Dans un environnement Codex** : si une fonction de prévisualisation est disponible, Codex peut t'aider à la configurer après que le serveur se lance correctement.
- **Pour partager un lien avec Ingrid, le jury ou un investisseur** : il faudra **ensuite** déployer le site ET son serveur sur un hébergeur compatible. **GitHub seul n'héberge pas l'application complète.** GitHub Pages ne suffit pas ici, car l'application utilise Express.
- Ne rends pas le serveur accessible publiquement avant les corrections de sécurité du lot A.

## 8. Ta petite checklist

- [ ] Le ZIP est décompressé sur mon ordinateur.
- [ ] J'ai créé un dépôt GitHub **Private**.
- [ ] Je vois `AGENTS.md`, `server.ts`, `src/` et `docs/` sur GitHub.
- [ ] Le dépôt est connecté à Codex.
- [ ] J'ai envoyé le prompt 01 à Codex.
- [ ] J'ai vérifié le résumé et les tests réels.
- [ ] J'ai validé une pull request pour enregistrer les changements.
- [ ] Je peux ouvrir CHKPT et répéter le scénario du pitch.

**Rappel :** tu peux m'envoyer le lien **privé** du dépôt dans une conversation où GitHub est connecté, ou un nouveau ZIP exporté après les corrections, pour que je t'aide à vérifier la suite.
