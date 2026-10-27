# CHKPT — état vérifié des lots A à D

Prototype privé pour FrancoTech Cocody et les financeurs ; non prêt pour la production.

| Lot | Résultat concret | Vérification |
|---|---|---|
| A | Accès démo désactivés par défaut, opérateur requis, anciens accès neutralisés, check-in synchronisé | Refus anonymes/utilisateur ordinaire, migrations, coordonnées, XP, confidentialité et 11 tests historiques |
| B | Démarrer la démo, Maquis → badge → publication facultative → profil → événement → répétition | Parcours navigateur 390/1280 pixels, rechargement et deuxième répétition ; 1240 → 1315 XP |
| C | Interface claire/sombre, symbole CHKPT central, fil social, médaillon et visuels locaux, secours d’image et simulation signalée | Même parcours avec tout accès externe bloqué et une image locale volontairement indisponible ; captures dans docs/captures |
| D | Guide Ingrid, pitch trois minutes, checklist et support autonome de quatre captures | Contenu HTML rendu sans réseau et navigation entre ses étapes vérifiée |

Commandes : `npm ci`, `npm run lint`, `npm run build`,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` (ou Chromium Playwright installé).
Le lanceur exécute 23 groupes de contrôles, dont la suite historique de 11 tests.
Les tests utilisent leurs propres serveurs et bases temporaires, sans toucher aux données de présentation.

Les publications, badges et intentions sont des états de démonstration locaux au navigateur.
La distance, les sessions et les XP de check-in sont vérifiés côté serveur, sans preuve de l'origine physique du GPS.
Le jeu de départ, les compteurs et la progression préchargée restent fictifs. Les médias importés ne survivent pas au redémarrage serveur.
Le reset efface la base fictive ; le bouton Démarrer la démo repart avec Koffi après autorisation opérateur.
Gemini reste facultatif et son service externe n'a pas été validé. Une planche du symbole CHKPT a été fournie ; son adaptation vectorielle simplifiée est utilisée, le fichier maître reste attendu. Aucune photographie de lieu validée ni vidéo n’a été fournie/créée.
Aucun pilote réel, résultat de marché, partenariat, déploiement public ou synchronisation multiutilisateur des publications n'est revendiqué.

Voir [GUIDE_PRESENTATION.md](docs/GUIDE_PRESENTATION.md) pour lancer et répéter la démonstration.

## Direction visuelle — 27 octobre 2026

Décisions et captures : [DIRECTION_VISUELLE_2026_10.md](docs/DIRECTION_VISUELLE_2026_10.md).
Le contrôle à 320 pixels a révélé un débordement des compteurs du profil, corrigé par retour à la ligne. Les vérifications 320/390/1280 pixels passent dans les deux thèmes, avec contraste des principales couleurs de texte et des boutons au moins 4,5:1. Le scénario complet est exécuté en clair sur mobile et sombre sur ordinateur ; la remise à zéro conserve le thème.

`npm run lint`, `npm run build` et la recette navigateur de 19 groupes ont été exécutés avec succès sous Node 24.19 / Chromium Linux. La suite historique de 11 tests fait partie des 19 groupes. Les captures, le PDF de huit étapes et le support autonome sont régénérés depuis l’application, et ne représentent pas la maquette générée initiale. Les essais sur Mac et Windows physiques restent à faire lors de la répétition.

## Stabilité du check-in — mode de lancement

Un rechargement Vite a été reproduit sur l’ancienne configuration, dans une copie sans `.gitignore`, pendant l’écriture de la base : la fenêtre de résultat pouvait disparaître. Le correctif limite l’analyse Tailwind aux sources de l’interface et exclut `.data/` du watcher. `npm run demo` sert désormais les fichiers compilés sans Vite, avec le même serveur et les mêmes permissions.

Vérification : `npm run lint`, `npm run build` et recette complète **21/21 groupes**, dont la suite historique de 11 tests. Le nouveau test en mode développement avec mouvements non réduits confirme que le badge reste lisible, que la page ne recharge pas, que la publication est possible et que les vraies modifications de code déclenchent toujours HMR. Le lanceur de présentation sert les assets compilés et maintient les outils démo fermés par défaut. Ces résultats concernent Chromium Linux ; le réessai sur le Mac de l’utilisateur reste nécessaire pour son symptôme précis.

## Profil social — disposition demandée

Le profil reprend la structure de la référence fournie : avatar rond, identité, bio, compteurs Checks / Badges / Abonnés, gestion du compte et onglets Publications / Lieux enregistrés / Badges. Le niveau et le total XP restent visibles ; historique et journal XP sont accessibles dans un volet secondaire. Les actions de réaction, commentaire et enregistrement d’un lieu utilisent les mêmes données que l’accueil. Aucune donnée serveur n’est modifiée.

Vérification exécutée : `npm run lint`, `npm run build`, puis **22/22 groupes** de la recette navigateur, dont les 11 tests historiques. La nouvelle recette du profil couvre les deux thèmes à 320/390/1280 pixels, les onglets et leur navigation clavier, les interactions et leur conservation après rechargement, les badges, le compte et le volet d’activité. Un check-in réel de démonstration vérifie aussi l’historique rempli et le journal XP à 320 pixels. Le parcours complet et le test de stabilité du serveur dev passent toujours. Voir [PROFIL_SOCIAL.md](docs/PROFIL_SOCIAL.md) pour les captures réelles et les limites.

## Accueil, en-tête et nouveaux visuels

Le dernier modèle fourni guide les cartes : image arrondie et ligne du lieu avec vignette. Le bouton central est désormais l’unique accès au check-in. L’accueil garde seulement Pour toi et Amis ; les filtres sont regroupés. L’en-tête conserve le symbole, le GPS et les notifications. Les lettres et la commune sont retirées de cette barre. Le thème passe dans Profil → Réglages, et le compte reste accessible dans Profil → Gérer mon compte.

Le bouton de confirmation porte Confirmer le check. La simulation reste identifiée et les contrôles serveur ne changent pas. Deux illustrations IA locales supplémentaires enrichissent les publications de terrasse et de culture, avec adaptation des anciens chemins fictifs à l’affichage et conservation des médias importés.

Exécutés avec succès : `npm run lint`, `npm run build`, et **23/23 groupes** de la recette complète, dont les 11 tests historiques. Le parcours central avec choix explicite transmet le bon lieu ; les XP restent uniques, le thème reste mémorisé dans les réglages, le GPS fonctionne depuis l’en-tête, les anciens caches affichent les nouvelles images, et les relations réelles de la base servent au filtre Amis. Les captures et les supports de présentation sont actualisés. Voir [ACCUEIL_SOCIAL.md](docs/ACCUEIL_SOCIAL.md). Les tests sont réalisés sous Chromium Linux ; la répétition sur les ordinateurs de présentation reste à refaire après mise à jour.

## Entrée unique du check-in

Sur demande du porteur, les boutons de check sont retirés des publications, de la carte, des fiches et de l’état vide du fil. Le seul point d’ouverture est le bouton central Check-in. Aucun lieu n’est choisi automatiquement : Confirmer le check reste désactivé jusqu’à la sélection, puis la publication reste proposée séparément.

Exécutés avec succès : lint, build et recette complète **23/23 groupes**, incluant le choix obligatoire, l’absence de raccourcis, l’identifiant exact transmis après sélection, le refus hors rayon et du doublon, les points, le badge, la publication et la répétition. Aucune autorisation ou règle serveur n’est modifiée.
