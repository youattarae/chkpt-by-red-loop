# CHKPT — guide de répétition pour Ingrid

Version intégrée du 5 novembre 2026, branche locale `feat/ux-demo-lots-0-8`. Prototype privé et données fictives, pas une application de production. Aucun déploiement ou push n’est réalisé par cette mission.

[Guide complet PDF](GUIDE_UTILISATION_COMPLET.pdf) · [PowerPoint modifiable](GUIDE_UTILISATION_COMPLET.pptx) · [PDF rapide en dix étapes](DEMONSTRATION_PAS_A_PAS.pdf) · [Support HTML sans connexion](DEMO_SECOURS.html).

## 1. Préserver l’ancienne version

Conserver l’ancien dossier complet. Ne pas écraser `.env` (réglages et secrets) ni `.data` (comptes, publications, médias, messages, visites et progression). Copier ces deux éléments dans la nouvelle version uniquement lors d’une mise à jour choisie. Les migrations sont additives ; ne pas utiliser Réinitialiser pour résoudre un problème de lancement.

Le code de cette mission est sur une branche locale dédiée ; le ZIP de `main` ne contient pas ces changements. Une publication GitHub nécessitera l’autorisation du propriétaire. Aucun nouveau lien distant de démonstration n’est activé.

## 2. Lancer sur Mac

Installer Node.js 24, ou une version 22 à partir de 22.12. Dans Terminal, taper `cd ` avec un espace, glisser le dossier **CHKPT_CODEX_GITHUB_PRET_A_IMPORTER** contenant `package.json`, puis Entrée.

```sh
node -v
npm ci
```

Au premier lancement seulement, si `.env` n’existe pas :

```sh
test -f .env || cp .env.example .env
```

Puis :

```sh
npm run demo
```

Ouvrir `http://localhost:3000`, ou le port affiché. Garder Terminal ouvert. Pour arrêter : Ctrl+C dans ce terminal.

## 3. Lancer sur Windows

Installer Node.js compatible. Ouvrir PowerShell dans le dossier contenant `package.json`, puis :

```powershell
node -v
npm ci
if (!(Test-Path .env)) { Copy-Item .env.example .env }
npm run demo
```

Ouvrir l’adresse affichée dans le navigateur. Aucun éditeur de code n’est nécessaire pour utiliser l’application ou lire les guides.

Si `npm ci` affiche EUSAGE ou si `demo` est absent, vérifier le dossier et la version du code. Si ECONNRESET apparaît, rétablir Internet et relancer `npm ci --fetch-retries=5`. Les messages de financement npm n’empêchent pas l’utilisation.

## 4. Ouvrir sur le téléphone d’Ingrid

Le téléphone et l’ordinateur doivent partager le même Wi-Fi ou hotspot. Dans `.env`, définir `HOST=0.0.0.0`, puis relancer `npm run demo`. Autres possibilités :

Mac :
```sh
HOST=0.0.0.0 npm run demo
```
Windows PowerShell :
```powershell
$env:HOST='0.0.0.0'
npm run demo
```

Relever l’IPv4 de l’ordinateur dans les réglages réseau (ou `ipconfig` sous Windows). Dans Safari/Chrome du téléphone, ouvrir `http://IP_DE_L_ORDINATEUR:3000`. `localhost` sur le téléphone désigne le téléphone, pas le Mac. L’adresse peut changer après reconnexion. Laisser l’ordinateur éveillé et connecté ; accepter le réseau local/pare-feu privé si le système le demande.

Sans ce réseau commun, l’accès local s’arrête. Un hébergement privé HTTPS distinct est nécessaire pour un accès à distance. Il est préparé gratuitement, pas déployé : [instructions](ACCES_PRIVE_DISTANCE.md). Le GPS navigateur fonctionne normalement sous HTTPS ; pour répéter localement, utiliser explicitement le Simulateur.

## 5. Choisir un personnage sans effacer les données

Dans une démo privée autorisée, `.env` active `CHKPT_PRIVATE_DEMO=true` et définit un secret opérateur local d’au moins 16 caractères. Ne pas le publier ni l’envoyer dans le chat. Les outils sont fermés par défaut.

☰ → Mon compte → Connexion. L’opérateur utilise l’identifiant `redloop_admin` et son secret local. Profils Démo permet ensuite de choisir Ingrid, Grâce, Yacoub ou Georges. Cette bascule ne réinitialise pas la base.

Démarrer la démo et Réinitialiser ouvrent une confirmation destructive : comptes et contenus ajoutés sont effacés après validation. Sauvegarder avant une remise à zéro réellement souhaitée. Annuler conserve les données. Pour une répétition sans effacement, utiliser un compte dédié, un autre lieu, ou montrer la reprise d’une visite déjà enregistrée.

## 6. Les gestes à connaître

- En bas : Accueil, Carte, ＋, Sortir, Messages. La couleur et le point bordeaux indiquent l’espace actif.
- Votre photo en haut et l’identité du menu ouvrent votre profil. Sur votre profil, Retour remplace le menu visible ; le glissement depuis le bord gauche ouvre toujours le menu.
- La loupe remplace la première ligne par la recherche. Suggestions pendant la saisie ; Rechercher ouvre les résultats et leurs filtres. La flèche ferme ce mode.
- L’icône de localisation d’Accueil choisit la commune explorée. Cela ne crée pas de visite et ne modifie pas la preuve de position du check.
- La Carte occupe l’écran ; repères verts/gris, aperçu puis Voir le lieu. Outils carte contient position du check et recherche externe facultative. Les tuiles peuvent manquer : le secours illustré est signalé.
- ＋ propose Faire un check ou Créer une publication. Faire un check sur une fiche présélectionne son lieu. Toujours vérifier la visibilité et la simulation avant confirmation.
- Quitter un texte commencé propose Conserver, Abandonner ou Continuer. Un brouillon est lié au compte et à cet appareil.
- ☰ → Enregistrés distingue lieux, publications et événements. Le signet d’une publication conserve la publication ; celui de la fiche conserve le lieu.
- Partager ouvre deux rangées : publier/amis en haut ; copier/applications/Plus en bas. Choisir un ami prépare l’envoi ; rien ne part avant confirmation.
- Messages contient les cartes de fiches, réouvrables avec Retour à la conversation. Notifications est dans le menu, avec un compteur distinct.

## 7. Déroulé à répéter

1. Accueil : montrer Pour toi/Amis, stories, publicité fictive et recherche.
2. Carte : déplacer/zoomer, sélectionner Maquis L’Étoile, Voir le lieu.
3. Faire un check depuis sa fiche : le lieu est déjà sélectionné. Position du check en Simulateur Cocody Saint-Jean, visibilité explicite, Confirmer le check.
4. Montrer la confirmation, les XP/badges provisoires. Une nouvelle visite admissible du scénario ajoute 75 XP ; une visite déjà enregistrée n’en ajoute pas.
5. Publier volontairement avec la bonne visibilité, ou Plus tard. Retrouver la publication sur son profil via la photo, puis Retour.
6. Partager une fiche à un ami réciproque, ajouter un message, confirmer. Ouvrir Messages, toucher la carte, consulter la fiche puis revenir à la discussion.
7. Menu → Notifications : ouvrir une activité et vérifier le compteur. Sortir : lire un guide, ouvrir un lieu cité et un événement ; choisir J’y serai ou Enregistrer.

Éviter de multiplier les explications techniques : « On découvre, on confirme sa présence, puis on choisit ce que l’on partage. » Prévoir plus de trois minutes si l’on montre aussi Messages, notifications et articles.

## 8. Ce qui est réel, simulé ou non terminé

Réel dans ce prototype : comptes, stockage sur le même serveur, contrôles d’accès, publications/médias, stories 24 h, visites et XP sans doublon, avis, suivis, messages, références de fiches, enregistrements et sauvegardes chiffrées.

Fictif : personnages/portraits, lieux et événements, publicités, score de départ, certains indicateurs, récompense et propositions/modération locales. La présence est explicitement simulée pendant la présentation. Le navigateur GPS ne constitue pas une garantie antifraude de production.

Limites : pas de paiement, appel ni fichier joint dans les DM ; pas de chiffrement de bout en bout ni de blocage/signalement complet des messages. Le périmètre de lancement public n’est pas arbitré. Les intentions d’événement et certaines notifications/préférences restent locales. Les liens externes exigent un accès au serveur ; un SMS ou une application externe dépend du téléphone. Le disque d’un hébergement gratuit peut être éphémère.

Avant le rendez-vous : tester sur les vrais appareils d’Ingrid, sauvegarder, vérifier l’adresse réseau et ouvrir les PDF/HTML de secours sans Internet. Les émulations 320/390/1280 ne remplacent pas cet essai réel.

## Stories et défilement — complément du 5 novembre

Sur Accueil : commandes → stories → Pour toi/Amis et GPS → fil. Les portraits défilent horizontalement et quittent l’écran en descendant ; seules les commandes reviennent au petit mouvement inverse. Revenez en haut pour retrouver les stories. Le retour depuis Messages conserve la position du fil.

Les exemples fictifs expirent réellement après 24 heures et ne sont pas renouvelés au redémarrage. Pour préparer une nouvelle répétition, l’opérateur connecté peut toucher « Préparer les stories fictives » dans son compte. Cette préparation ne réinitialise ni les publications ni les visites et ne remplace aucune story personnelle.

## Menu, badges et grand ＋ — complément du 5 novembre

Le menu présente Notifications, Mon compte, Badges et progression, Enregistrés, Historique privé, Récompenses fictives, Classement, Aide, Réglages. Le bloc identité ouvre le profil ; Messages reste uniquement dans la barre basse. Les compteurs d’activité et de messages sont distincts.

Le grand plus ouvre Faire un check puis Créer une publication. Il ne valide rien automatiquement. La collection affiche huit familles : toucher l’une d’elles pour voir les badges obtenus et les emplacements anonymes verrouillés. Le compteur indique acquis/total catalogue, pas des visites. Badge actuel explique un acquis passé ; les règles provisoires restent identiques. Pour vos points et le journal, ouvrir « Consulter mes XP et mon journal privé » après les huit familles.
