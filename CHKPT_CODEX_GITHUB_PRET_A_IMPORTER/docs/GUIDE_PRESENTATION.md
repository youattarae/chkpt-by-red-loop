> Guide complet de la version actuelle : [PDF de 41 pages](GUIDE_UTILISATION_COMPLET.pdf) et [PowerPoint modifiable](GUIDE_UTILISATION_COMPLET.pptx). Le présent document reste la fiche de répétition courte d’Ingrid.

# CHKPT — guide pour Ingrid

Objectif : une présentation privée de trois minutes à FrancoTech Cocody ou à des financeurs.
Les lieux, personnes, statistiques, événements et points montrés sont fictifs. Les visuels sont illustrés.

## Préparer l'ordinateur

1. Utiliser la version effectivement transmise pour la répétition. Les derniers lots locaux ne sont pas encore synchronisés sur GitHub ; ne pas supposer qu’un ZIP de `main` les contient. Le passage du dépôt en privé est reporté à la fin du travail, selon la décision du porteur.
2. Installer Node.js 22.12 ou plus récent. Ouvrir le terminal dans `CHKPT_CODEX_GITHUB_PRET_A_IMPORTER`.
3. Exécuter `npm ci`.
4. Copier `.env.example` vers `.env`. Dans ce fichier local, mettre `CHKPT_PRIVATE_DEMO=true`
   et définir `CHKPT_DEMO_ADMIN_PASSWORD` avec un mot de passe personnel d'au moins 16 caractères.
   Garder `HOST=127.0.0.1`. `.env` est ignoré par Git. Ne pas recopier ce mot de passe dans le code.
5. Exécuter `npm run demo` et ouvrir l'application locale sur le port indiqué dans le terminal.
6. Ouvrir **Profil → Gérer mon compte**, puis l’onglet Connexion.
   Se connecter avec `redloop_admin` et le mot de passe défini à l'étape 4.
7. Rouvrir ce panneau, aller dans « Profils Démo (opérateur) », cliquer **Démarrer la démo**, lire les suppressions annoncées puis confirmer seulement si cette base peut être remise à zéro.
   Cette action protégée réinitialise le jeu fictif et connecte Yacoub Ouattara, le personnage de la présentation.

Ce démarrage efface les comptes et contenus ajoutés dans la base de démonstration. Utiliser une base réservée
à la présentation, jamais des données réelles. Le serveur utilise `.data/` dans son dossier de lancement.

## Le parcours de trois minutes

| Temps | Geste | Phrase proposée |
|---|---|---|
| 0:00–0:25 | Montrer l’accueil, les onglets Pour toi / Amis et les publications illustrées. | « CHKPT aide à découvrir les sorties autour de soi. Notre pilote se concentre sur Cocody. Tout ce que vous voyez ici est une démonstration fictive. » |
| 0:25–0:55 | Carte → repère Maquis → Détails. | « On passe d'une découverte à un lieu. Voici notre maquis de démonstration, L'Étoile d'Abidjan. » |
| 0:55–1:25 | Retour → bouton central Check-in → choisir Maquis L’Étoile → Confirmer le check. Le simulateur est déjà à Saint-Jean après démarrage. | « Pour cette présentation, la position est simulée. Le check-in et la publication sont deux actions distinctes. » |
| 1:25–1:45 | Montrer +75 XP et le badge Initié du Braisé. | « Les points illustrent la progression. Le badge de la famille Maquis Master passe de quatre à cinq visites fictives. » |
| 1:45–2:10 | Créer une publication → écrire « Une belle découverte à Cocody » → vérifier la visibilité de la publication → Publier le checkpoint. | « Je choisis de partager ; rien n'est publié automatiquement. » |
| 2:10–2:35 | Profil → publication et 1315 XP. | « Je retrouve mon souvenir et ma progression, même après navigation. » |
| 2:35–2:55 | Sortir → premier événement → J'y serai. | « Je prépare aussi ma prochaine sortie. Cette intention est simulée et enregistrée dans ce navigateur. » |
| 2:55–3:00 | Revenir à l'accueil ou au profil. | « CHKPT : Sors. Check. Partage. » |

Le maquis doit être sélectionné explicitement dans la fenêtre ouverte par le bouton central Check-in. Le badge attendu s'appelle **Initié du Braisé**,
dans la famille **Maquis Master** ; le moteur comporte davantage de paliers provisoires, mais seule une petite sélection est présentée dans le prototype. Ne pas annoncer un catalogue définitif validé.
Publier n'ajoute pas de XP de visite. Les 1240 XP de départ et les quatre visites du badge sont des données fictives préchargées.

## Recommencer

Se reconnecter comme `redloop_admin`, rouvrir Profils Démo (opérateur), puis Démarrer la démo et confirmer la remise à zéro après sauvegarde si nécessaire.
Le scénario revient au maquis Saint-Jean, badge à 4/5, aucune publication ajoutée et aucune intention d'événement.
Une deuxième visite au même lieu sans redémarrage ne donne pas de XP supplémentaires dans la même journée : c'est normal.
Un rechargement conserve publications, badge et intentions dans le même navigateur.

## Checklist avant de présenter

- [ ] Ne pas utiliser une base contenant de vraies personnes ou des photos privées.
- [ ] Lancer le serveur, vérifier l'accueil, la carte et les illustrations.
- [ ] Vérifier la connexion opérateur puis Démarrer la démo.
- [ ] Confirmer le maquis exact et le simulateur Saint-Jean ; garder la mention de simulation visible.
- [ ] Répéter une fois tout le parcours avec publication, profil et événement.
- [ ] Redémarrer la démo avant de passer devant le jury.
- [ ] Fermer les autres onglets et notifications de l'ordinateur, tester l'affichage sur le projecteur.
- [ ] Ouvrir `docs/DEMO_SECOURS.html` dans un deuxième onglet et le tester hors connexion.
- [ ] Garder l'ordinateur chargé. Le prototype local ne dépend pas de Gemini ni d'un service d'images.

## Si quelque chose bloque

- **Connexion refusée** : vérifier l'activation privée et le mot de passe local ; les anciens identifiants de seed sont désactivés.
- **Lieu trop éloigné** : fermer la modale, choisir Saint-Jean dans ☰ → Réglages et confidentialité → Position, rouvrir la fiche du maquis.
- **Visite déjà validée** : retrouver la confirmation existante et reprendre la publication si souhaité, sans nouveau XP. Ne pas effacer toute la base pour ce motif.
- **Serveur indisponible** : passer au fichier de secours. Dire : « Voici des captures du parcours testé ; ce n'est pas une session en direct. »

Le fichier de secours est autonome : quatre étapes avec captures réelles actualisées, navigables sans serveur ni réseau.
Il ne s'agit pas d'une vidéo ni d'un prototype interactif hors ligne. Aucune vidéo n'a été produite dans ce lot.

## Pour les financeurs

« Notre hypothèse est qu'un réseau social ancré dans les sorties locales facilite la découverte et le passage à l'action.
Ce prototype permet de tester cette boucle à Cocody. Nous voulons maintenant recueillir des retours, mesurer l'intérêt
et valider les modalités d'un pilote. Les statistiques présentées ne sont pas de la traction réelle. Les publicités montrent
un emplacement possible, sans annonceur ni partenariat acquis. Les abonnements établissements et partenariats sont des pistes
à valider ; aucun paiement ni billetterie ne sont intégrés. »

## Ce qui est vérifié et ce qui reste une démonstration

Vérifiés : protections opérateur, distance et XP côté serveur, refus de doublon, sélection du lieu,
publication facultative dans le fil/profil, conservation après rechargement, événement et répétition après reset.
Recette navigateur à 390 et 1280 pixels, accès externes bloqués, image indisponible remplacée.

Restent simulés ou limités : GPS de présentation, jeu de départ, compteurs, petite sélection de badges, intentions locales au navigateur et carte illustrée de secours. Les publications, médias, favoris et visites sont désormais partagés via le serveur selon les permissions ; certaines intentions et notifications restent locales.
Les médias importés sont conservés dans la base serveur tant que son stockage est conservé. Une position annoncée comme réelle vient encore du client.
Le symbole est une adaptation vectorielle simplifiée de la planche fournie ; le fichier maître reste attendu. Les illustrations locales, dont une image générée par IA explicitement signalée, représentent des lieux fictifs.
Le projet reste un prototype privé, pas une application de production ni une validation d'intérêt par le marché.

## Habillage CHKPT actualisé

L’interface s’ouvre sur fond blanc. ☰ → Réglages et confidentialité permet de choisir le mode sombre ; le choix reste après rechargement et après le redémarrage du scénario. Le bouton central de check-in porte le symbole CHKPT et conserve le texte « Check-in ». Le slogan reste réservé aux supports de communication.

Voir les [captures réelles et les choix visuels](DIRECTION_VISUELLE_2026_10.md). Les affichages sont contrôlés à 320, 390 et 1280 pixels, dans les deux thèmes. Une répétition reste nécessaire sur le Windows d’Ingrid ; aucun essai sur une machine Windows physique n’est revendiqué.

## Lancement stable pour présenter

Dans le dossier du prototype, après l'installation et la configuration privée, utiliser **`npm run demo`**, sur Mac comme sur Windows. Cette commande compile les écrans puis démarre le serveur avec les fichiers préparés, sans rechargement à chaud. Garder le Terminal ouvert et accéder à `http://localhost:3000`. Ce mode ne change ni le mot de passe, ni les autorisations, ni le caractère privé du prototype.

Sur une version déjà téléchargée qui ne possède pas encore la commande `demo`, arrêter le serveur avec Ctrl+C puis, sur Mac, lancer :

```bash
npm run build
NODE_ENV=production npm run dev
```

Il s'agit seulement du mode de service des fichiers compilés : le prototype ne devient pas une application de production. Après redémarrage, les comptes de seed doivent se reconnecter. Une visite déjà comptée reste comptée ; seul l'opérateur peut relancer le scénario fictif avec Démarrer la démo.

Un rechargement de développement a été reproduit pendant l'écriture du check-in dans un dossier isolé sans `.gitignore`. Le résultat disparaissait alors que la visite était enregistrée. Le correctif limite l'analyse des styles aux fichiers de l'interface et exclut `.data/` du watcher. La nouvelle recette vérifie la confirmation, le badge, la publication sans navigation inattendue et le maintien du rechargement à chaud pour une vraie modification de code. Cette reproduction sous Chromium Linux ne prouve pas que tout clignotement propre à Safari soit éliminé : le réessai sur le Mac reste nécessaire.

Les réglages de thème, commune et position sont regroupés dans **☰ → Réglages et confidentialité**. L’en-tête conserve le symbole, le bouton GPS, la cloche de notifications et le bouton ☰. Le bouton central est l’unique accès au check-in : choisir le lieu, appuyer sur **Confirmer le check**, puis **Créer une publication** si souhaité. Les cartes et les fiches restent consultables sans bouton de check.

## Deux appareils et sauvegarde gratuite

Voir [SYNCHRONISATION_ET_SAUVEGARDE.md](SYNCHRONISATION_ET_SAUVEGARDE.md) pour retrouver les mêmes données sur téléphone et ordinateur, télécharger une sauvegarde chiffrée et la restaurer. Le budget reste gratuit : la configuration Render ne garantit pas la conservation du disque. Aucun hébergement n’est créé automatiquement. Pour conserver une démo existante, se connecter sans lancer Démarrer la démo, qui remet les données fictives à zéro.

## Visite complémentaire si le jury pose des questions

- **Accueil** : écrire Ingrid → Rechercher → Filtres → Profils → Appliquer → ouvrir Ingrid. Les suggestions restent temporaires ; les résultats et le profil sont des pages.
- Montrer ses publications et badges publics, puis Abonnés ou Abonnements : liste réelle avec recherche. Ses visites et XP totaux ne sont pas consultables.
- Ouvrir **☰** : le menu porte toujours le nom du compte connecté, même sur le profil d’Ingrid.
- **☰ → Classement des explorateurs** : Amis (suivis réciproques + soi) ou Global, XP du mois. Le total fictif préchargé de 1240 XP n’est pas un score du mois.
- Montrer **Historique privé**, **Enregistrés** et **Badges et progression** depuis le menu. Retour retrouve le contexte.
- Les quatre personnages ont cinq publications initiales chacun. Publicité fictive avant le fil et après chaque cinq publications visibles ; aucune bannière ne donne accès à une offre réelle. L’alcool est réservé aux comptes majeurs déclarés avec contrôle serveur.
- Les stories se lisent depuis l’accueil ou la photo de profil ; elles expirent après 24 h. Le + sert à en ajouter une.

## Mac, Windows et téléphone

Sur Mac, ouvrir Terminal ; sur Windows, ouvrir PowerShell dans le dossier contenant `package.json`. Dans les deux cas :

```text
npm ci
npm run demo
```

Pour créer le fichier de configuration au premier lancement seulement : `cp .env.example .env` sur Mac ; `Copy-Item .env.example .env` dans PowerShell. Ne pas écraser un `.env` ou un dossier `.data` existants : conserver la sauvegarde complète, ou utiliser les fonctions de sauvegarde chiffrée autorisées.

Si le téléphone doit accéder au serveur de l’ordinateur, définir `HOST=0.0.0.0` dans le `.env` local, relancer le serveur et utiliser `http://ADRESSE_IP_DE_L_ORDINATEUR:3000` sur le même Wi-Fi ou hotspot. L’ordinateur doit rester allumé et le terminal ouvert ; l’adresse IP peut changer. Sur ce lien HTTP local, employer le Simulateur pour la présentation. Ne pas exposer directement le port de l’ordinateur sur Internet.

Pour montrer le prototype à distance sans le même réseau, voir [la préparation de l’accès privé](ACCES_PRIVE_DISTANCE.md). Aucun lien hébergé n’a encore été créé. L’offre gratuite peut perdre son stockage : exporter une sauvegarde privée avant toute manipulation du scénario.

## Supports à garder sous la main

- `DEMO_SECOURS.html` : quatre écrans intégrés, utilisables sans serveur ni Internet. Ouvrir le fichier dans Edge, Chrome ou Safari. C’est un support de captures, pas une application hors connexion.
- `DEMONSTRATION_PAS_A_PAS.pdf` : dix étapes illustrées actualisées, avec profils et menu. Ouvrir le PDF dans le navigateur ; aucun logiciel de programmation n’est nécessaire.
- [Pages, recherche et menu](NAVIGATION_PAGES_ET_MENU.md) : recette détaillée avec dix captures supplémentaires.

Avant de partir, Ingrid doit ouvrir ces deux fichiers sur son propre ordinateur. Les essais automatisés sous Chromium Linux ne remplacent pas ce contrôle sur Windows et Safari.
