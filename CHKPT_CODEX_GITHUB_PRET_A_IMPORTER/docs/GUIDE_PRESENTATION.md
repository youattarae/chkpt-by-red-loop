# CHKPT — guide pour Ingrid

Objectif : une présentation privée de trois minutes à FrancoTech Cocody ou à des financeurs.
Les lieux, personnes, statistiques, événements et points montrés sont fictifs. Les visuels sont illustrés.

## Préparer l'ordinateur

1. Récupérer la branche de la pull request, ou `main` après sa fusion.
2. Installer Node.js 22.12 ou plus récent. Ouvrir le terminal dans `CHKPT_CODEX_GITHUB_PRET_A_IMPORTER`.
3. Exécuter `npm ci`.
4. Copier `.env.example` vers `.env`. Dans ce fichier local, mettre `CHKPT_PRIVATE_DEMO=true`
   et définir `CHKPT_DEMO_ADMIN_PASSWORD` avec un mot de passe personnel d'au moins 16 caractères.
   Garder `HOST=127.0.0.1`. `.env` est ignoré par Git. Ne pas recopier ce mot de passe dans le code.
5. Exécuter `npm run dev` et ouvrir l'application locale sur le port indiqué dans le terminal.
6. Ouvrir le bouton d'avatar « Profil & Compte Démo », onglet Connexion.
   Se connecter avec `redloop_admin` et le mot de passe défini à l'étape 4.
7. Rouvrir ce panneau, aller dans « Profils Démo (opérateur) », cliquer **Démarrer la démo**.
   Cette action protégée réinitialise le jeu fictif et connecte Koffi, le personnage de la présentation.

Ce démarrage efface les comptes et contenus ajoutés dans la base de démonstration. Utiliser une base réservée
à la présentation, jamais des données réelles. Le serveur utilise `.data/` dans son dossier de lancement.

## Le parcours de trois minutes

| Temps | Geste | Phrase proposée |
|---|---|---|
| 0:00–0:25 | Montrer l'accueil, puis le fil sous l'illustration. | « CHKPT aide à découvrir les sorties autour de soi. Notre pilote se concentre sur Cocody. Tout ce que vous voyez ici est une démonstration fictive. » |
| 0:25–0:55 | Carte → repère Maquis → Détails. | « On passe d'une découverte à un lieu. Voici notre maquis de démonstration, L'Étoile d'Abidjan. » |
| 0:55–1:25 | Faire un check-in ici → Simuler ma visite. Le simulateur est déjà à Saint-Jean après démarrage. | « Pour cette présentation, la position est simulée. Le check-in et la publication sont deux actions distinctes. » |
| 1:25–1:45 | Montrer +75 XP et le badge Initié du Braisé. | « Les points illustrent la progression. Le badge de la famille Maquis Master passe de quatre à cinq visites fictives. » |
| 1:45–2:10 | Créer une publication → écrire « Une belle découverte à Cocody » → Publier le checkpoint. | « Je choisis de partager ; rien n'est publié automatiquement. » |
| 2:10–2:35 | Profil → publication et 1315 XP. | « Je retrouve mon souvenir et ma progression, même après navigation. » |
| 2:35–2:55 | Sortir → premier événement → J'y serai. | « Je prépare aussi ma prochaine sortie. Cette intention est simulée et enregistrée dans ce navigateur. » |
| 2:55–3:00 | Revenir à l'accueil ou au profil. | « CHKPT : Sors. Check. Partage. » |

Le maquis doit rester présélectionné dans la modale. Le badge attendu s'appelle **Initié du Braisé**,
dans la famille **Maquis Master** ; il ne faut pas annoncer que quarante badges sont implémentés.
Publier n'ajoute pas de XP de visite. Les 1240 XP de départ et les quatre visites du badge sont des données fictives préchargées.

## Recommencer

Se reconnecter comme `redloop_admin`, rouvrir Profils Démo (opérateur), puis Démarrer la démo.
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
- **Lieu trop éloigné** : fermer la modale, choisir Saint-Jean dans le simulateur du bandeau, rouvrir la fiche du maquis.
- **Visite déjà validée** : recommencer via l'opérateur, pas en insistant sur Confirmer.
- **Serveur indisponible** : passer au fichier de secours. Dire : « Voici des captures du parcours testé ; ce n'est pas une session en direct. »

Le fichier de secours est autonome : quatre étapes avec captures réelles, navigables sans serveur ni réseau.
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

Restent simulés ou limités : GPS de présentation, jeu de départ, compteurs, badges locaux, publications et intentions locales
au navigateur, carte illustrée. Ce n'est pas un partage synchronisé entre plusieurs utilisateurs.
Les médias importés restent en mémoire serveur. Une position annoncée comme réelle vient encore du client.
Les logos officiels et photographies de lieux validées ne sont pas fournis ; les illustrations locales servent de présentation.
Le projet reste un prototype privé, pas une application de production ni une validation d'intérêt par le marché.
