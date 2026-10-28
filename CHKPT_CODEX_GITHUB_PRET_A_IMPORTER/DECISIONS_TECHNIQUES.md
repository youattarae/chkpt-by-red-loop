# Accueil, confirmation et illustrations — 27 octobre 2026

- En-tête limité au symbole, au GPS et aux notifications. Thème, commune, position et accès opérateur regroupés dans les réglages du profil ; compte accessible depuis Gérer mon compte. Le bouton central est le seul accès au check-in ; tous les raccourcis des publications, de la carte et des fiches sont supprimés. Le lieu doit être choisi explicitement à chaque ouverture.
- Accueil limité aux onglets Pour toi et Amis, avec navigation clavier. Les catégories restent disponibles via Filtrer. Les comptes visibles et leurs compteurs sont calculés à partir des publications accessibles pour ce compte et cet onglet.
- Un composant `PublicationCard` commun au fil et au profil conserve les actions réelles et les mentions de confidentialité / démonstration. Le contenu textuel précède le média, comme dans la référence visuelle.
- La confirmation reste désactivée sans sélection explicite. Le libellé devient Confirmer le check dans les deux modes GPS. Les mentions de simulation et les règles serveur restent inchangées.
- Deux nouvelles illustrations IA locales complètent le maquis. `publicationMedia.ts` adapte uniquement les anciens chemins d'illustrations fictives pour les caches existants, sans réécrire les publications ni les URL des médias importés. Une image de secours conserve une légende générique.
- La recette du fil vérifie aussi le cas sans abonnement réel (Koffi) et le cas avec relation existante (Sarah suit Koffi), sans inventer de relations à partir des compteurs fictifs.

# Disposition du profil — 27 octobre 2026

- En-tête personnel allégé avec avatar rond, identité et trois compteurs issus des données actuelles. Publications sélectionnées par défaut ; lieux enregistrés et badges disponibles par onglets. Les visites et le journal XP sont conservés dans un volet secondaire.
- La collection de badges existante accepte un affichage intégré ; sa vue complète reste accessible. Les onglets prennent en charge la navigation clavier et les attributs ARIA de sélection.
- Les cartes de publications du profil utilisent `likePost`, `addComment` et `toggleSavePlace` existants. Le signet enregistre un lieu lié. Aucun partage, sauvegarde de publication ou éditeur de profil factice n'est ajouté.
- Les mentions de confidentialité, de simulation et d'illustration restent visibles. Aucune donnée serveur ni règle de check-in n'est modifiée. Voir `docs/PROFIL_SOCIAL.md` pour les captures et les contrôles.

# Stabilité du check-in en démonstration — 27 octobre 2026

- Reproduction dans un dossier isolé sans `.gitignore` : une écriture de la base au check-in peut déclencher un `full-reload` Vite et faire disparaître la confirmation. Les tests précédents sur assets compilés ne couvraient pas ce chemin.
- Tailwind analyse explicitement `src/` et `index.html`, pas les fichiers JSON de données. Vite ignore `.data/` tout en conservant HMR pour les vraies modifications de l'interface.
- `npm run demo` compile puis utilise `scripts/present.mjs` et le chargeur tsx pour servir les assets sans Vite. Le lanceur positionne NODE_ENV de façon portable sur Mac/Windows ; il n'active aucune permission de démo privée.
- Test navigateur en mode dev, mouvements non réduits, dossier sans `.gitignore` : confirmation et badge persistants après écriture, aucune navigation/recharge CSS, publication possible et HMR source toujours actif. Test séparé du lanceur sur assets compilés et refus des outils démo par défaut.

# Direction visuelle du 27 octobre 2026

- Les décisions utilisateur les plus récentes priment sur les passages historiques : interface claire par défaut, sombre au choix, CHKPT seul, slogan en communication, symbole pour le check-in.
- Couleurs sémantiques `canvas`, `surface`, `ink`, `body`, `muted`, `line` : les anciennes classes slate sont remplacées selon leur rôle pour éviter une inversion globale des images et du texte des boutons.
- Préférence de thème appliquée avant le montage React, indépendante du système, enregistrée localement avec gestion du stockage indisponible. Aucune nouvelle dépendance.
- Un seul asset vectoriel simplifié pour le symbole fourni en référence ; fichier maître attendu pour une fidélité exacte. Une image IA locale et signalée pour le lieu fictif du scénario. Aucune dépendance réseau ajoutée.
- Aucun changement aux autorisations serveur, calculs XP, endpoints de check-in ou aux protections du Lot A. Une publication synthétique de départ ajoutée sans XP ; les contenus locaux existants sont préservés.
- Voir `docs/DIRECTION_VISUELLE_2026_10.md` et la recette visuelle à 320/390/1280 pixels.

# Décisions des lots B, C et D

- `/api/demo/start` reprend les protections de reset (démo privée + opérateur). Il réinitialise les données fictives
  et ouvre une session aléatoire Koffi. Une session ordinaire ne peut pas relancer ou administrer la démo.
- Le déblocage du badge est calculé avant la mise à jour d'état React, sans effet de bord dans un updater.
- Une publication n'accorde pas de XP de visite. Les points affichés après rechargement correspondent au serveur.
- Publication et intention d'événement persistent localement, sans promesse de réseau social multiutilisateur synchronisé.
- Le profil présente les publications ; les visites simulées conservent leur étiquette de démonstration.
- Les dates d'événements de départ sont relatives au jour du chargement, affichées à l'heure d'Abidjan.
- Illustrations SVG originales et police embarquées ; images importées conservées avec secours local si indisponibles.
- Le support de secours est un HTML autonome avec captures de la recette. Aucune vidéo ni application autonome hors ligne n'est annoncée.

# Décisions du Lot A — 26 octobre 2026

Ces décisions remplacent les affirmations historiques incompatibles ci-dessous :

- Le seul interrupteur d'autorisation démo est `CHKPT_PRIVATE_DEMO=true` côté serveur.
  La préférence du navigateur n'accorde aucun droit ni ne certifie une position réelle.
- Bascule de persona et reset : activation privée + session opérateur ; un modérateur ne peut pas
  utiliser la bascule pour devenir administrateur. Les cibles sont limitées aux trois personas fictifs.
- Le mot de passe administrateur vient de `CHKPT_DEMO_ADMIN_PASSWORD` (16 caractères minimum),
  sans valeur par défaut. Koffi/Sarah n'ont pas de mot de passe connu ; un opérateur utilise la bascule.
  Aucun jeton de session n'est préchargé. Les anciens accès de seed sont révoqués au chargement.
- Un reset autorisé efface toute la base de démonstration et les médias en mémoire,
  invalide les sessions et exige une reconnexion. Un refus serveur ne purge pas le navigateur.
- La modale est remontée à chaque ouverture/changement de lieu : aucun résultat ou choix précédent conservé.
- Les coordonnées non finies/hors plage sont rejetées. La simulation annoncée est refusée hors démo privée.
  Un client malveillant peut encore envoyer de fausses coordonnées en les déclarant réelles :
  ce prototype ne prouve pas physiquement la présence et ne vérifie pas la fraîcheur du GPS.
- L'historique respecte l'audience de chaque check-in, même sur un profil public.
- `package-lock.json` et `npm ci` fixent les dépendances. esbuild 0.28 satisfait le pair optionnel de Vite 8.
- Voir [le guide de vérification](docs/LOT_A_VERIFICATION.md). La cible de ce travail reste le prototype web privé ;
  les choix de stack future mentionnés dans l'historique ne sont pas engagés par ce lot.

---

## Historique de l'export (affirmations non revérifiées hors Lot A)

# DECISIONS_TECHNIQUES — Architecture & Arbitrages RED LOOP / CHKPT

**Dernière mise à jour :** 26 octobre 2026  
**Environnement actuel :** Web React SPA Fullstack (React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + Node Express)  
**Cible future :** React Native / Expo pour builds mobiles natifs Android/iOS + API backend modulaire Node.js / PostgreSQL (PostGIS)

---

## 1. Séparation des identités et des responsabilités
- **RED LOOP :** Structure mère propriétaire, régie publicitaire, back-office d'exploitation (surfaces M01 à M14), gouvernance des données et relations professionnelles.
- **CHKPT (« Checkpoint ») :** Marque et expérience de l'application grand public mobile (« Sors. Check. Partage. »).
- **Conséquence technique :** L'interface utilisateur applique la charte CHKPT (bleu nuit, bleu clair lumineux, bordeaux, monochrome, zéro-pill, typographie élégante *classy street*). Les outils d'exploitation opérateur sont intégrés dans une vue d'administration séparée sous la marque RED LOOP, protégée par le rôle `admin` et le middleware `requireOperator`.

## 2. Géolocalisation & Vérification de Check-in (Moteur anti-fraude côté serveur)
- **Arbitrage :** Le check-in nécessite une preuve calculée sur le serveur, pas un simple tap sur le client.
- **Implémentation :**
  - Utilise l'API Geolocation native du navigateur (`navigator.geolocation`) lorsque la permission est accordée.
  - Comprend un **simulateur de position contextuel d'Abidjan** (Cocody Saint-Jean, Plateau, Riviera Palmeraie, Marcory Zone 4) pour permettre les tests et la recette fonctionnelle même si l'évaluateur ou le développeur se trouve hors d'Abidjan.
  - Calcul de distance géodésique côté serveur (formule de Haversine via `POST /api/checkins`).
  - Rayon de validation : seuil standard strict de 250 mètres autour du lieu (tolérance urbaine d'Abidjan).
  - Fraîcheur de signal : timestamp GPS vérifié.
  - Clé d'idempotence journalière (`idempotencyKey = userId + placeId + dateString`) interdisant le double-comptage et le farming d'XP.
  - Pas de publication forcée : après validation, une modale facultative propose de partager une photo ou un avis, avec un bouton « Plus tard ».
  - Enregistrement des preuves isolées dans la table `checkin_proofs` inaccessible publiquement.

## 3. Unification Canonique des Lieux (Front-end & Back-end)
- **Arbitrage :** Les identifiants, catégories et coordonnées géographiques doivent être strictement identiques entre le serveur (`server/db.ts`), le client (`src/data/mockData.ts`), la carte (`MapView.tsx`) et la modale de check-in (`CheckinModal.tsx`).
- **Lieux certifiés de référence :**
  1. `plc_cocody_lounge` : Lagon Bleu Rooftop Lounge (Cocody Danga)
  2. `plc_maquis_etoile` : Maquis L'Étoile d'Abidjan (Cocody Saint-Jean)
  3. `plc_cafe_atelier` : L'Atelier Café & Bakery (Cocody Riviera 3)
  4. `plc_galerie_ceci` : Centre d'Art Urbain & Céramique Babi (Cocody Vallons)
  5. `plc_chez_ambroise` : Chez Ambroise Maquis VIP (Marcory Zone 4)
  6. `plc_toit_plateau` : Le Toit des Affaires (Plateau)
- Synchronisation dynamique : le client interroge `GET /api/places` au montage pour hydrater les données certifiées du serveur tout en préservant les compteurs temps réel.

## 4. Gamification Dynamique & Déblocage des Badges en Temps Réel
- **Arbitrage :** Un check-in vérifié doit avoir un impact visible immédiat sur la progression et le déblocage des badges dans le cadre du pitch de démonstration.
- **Implémentation :**
  - L'action `submitCheckIn` évalue immédiatement les familles concernées :
    - *Maquis Master* (incrémenté sur la catégorie `maquis`, seuil 5/5 atteint au Maquis L'Étoile).
    - *Foodie* (incrémenté sur `restaurants` et `cafes_boulangeries`).
    - *Explorateur* (incrémenté sur tout check-in vérifié).
    - *Culture Hunter* (incrémenté sur `culture_art`).
  - Déclenchement automatique d'un toast d'accomplissement avec icône trophée et notification in-app (`progression`).
  - Mise à jour atomique du journal `PointsLedger` et de la jauge de niveau (1 niveau tous les 300 XP).

## 5. Réinitialisation Instantanée du Scénario Pitch (`/api/demo/reset`)
- **Problématique résolue :** La protection d'idempotence journalière bloquait toute répétition du scénario de démonstration dans la même journée.
- **Implémentation :**
  - Route backend `POST /api/demo/reset` remettant les entités `checkins`, `checkin_proofs` et `points_ledger` dans leur état de départ certifié.
  - Fonction client `resetDemoPitchState()` purgeant le `localStorage` et réinjectant l'utilisateur de départ (`koffi_urbex`).
  - Bouton accessible dans l'écran de profil/compte permettant au présentateur de repartir d'une démo vierge en un clic avant chaque passage devant un jury.

## 6. Confidentialité, Protection des Mineurs & Permissions
- Tout compte déclaré entre 13 et 17 ans a son profil basculé en mode `privé` (`visibility: 'private'`) dès l'inscription.
- L'historique des check-ins d'un utilisateur possède son propre sélecteur d'audience (`Moi uniquement`, `Abonnés autorisés`, `Public`).
- Les coordonnées GPS brutes de preuve ne sont jamais exposées publiquement dans l'API ni dans les DTO partagés.
- La console d'exploitation RED LOOP est réservée aux utilisateurs porteurs d'un rôle `admin`, `superadmin` ou `moderator` et filtrée par `requireOperator`.

## 7. Cadence & Règles Publicitaires (Régie RED LOOP)
- Conformément à la section 11 du document maître :
  - **Accueil :** Bannière initiale + 1 bannière toutes les 10 publications organiques.
  - **Sortir :** Bannière initiale + 1 bannière toutes les 3 rubriques ; dans le détail rubrique, 1 bannière toutes les 3 cartes.
  - **Carte, Check-in, Profil :** AUCUNE publicité.
  - **Comportement :** Bannières strictement **non cliquables**, mention discrète « Publicité » obligatoire.

## 8. Traitement Médias Asynchrone, Purge EXIF GPS & Sécurité
- Image décodée en mémoire et projetée sur `HTML5 Canvas 2D` pour éradiquer tous les en-têtes binaires EXIF (tags GPSLatitude, GPSLongitude, modèle d'appareil).
- Compression lossy HD (1920px max, qualité 0.82) réduisant de 75 % à 90 % le poids des photographies.
- Déduction du propriétaire du média **exclusivement depuis le token de session** côté serveur (`POST /api/media/upload`).
- Route de lecture `GET /api/media/:assetId` appliquant un contrôle d'accès strict selon l'audience : 403 Forbidden immédiat pour les tiers sur un média `private`, et vérification de la table `follows` pour l'audience `followers`.

## 9. Grounding Google Maps Côté Serveur (Gemini 3.8 Flash)
- Route `POST /api/places/grounding` orchestrant les requêtes géolocalisées via `@google/genai` (modèle `gemini-3.8-flash` avec l'outil natif `googleMaps` et coordonnées d'Abidjan).
- Restitution obligatoire des URLs Google Maps (`groundingChunks.maps.uri`) avec liens ouvrables.

## GPS et fiche lieu — ajustement du 27 octobre 2026

La commune apparaît dans le bouton GPS, sans sélecteur de commune séparé. Le menu réutilise les modes existants et six positions simulées ; choisir une position synchronise sa commune. La fiche utilise les données et favoris existants, en plein écran mobile et grand format sur ordinateur. Les illustrations locales remplacent les anciens chemins fictifs ; la galerie ne compte que les images distinctes disponibles et les horaires absents restent signalés comme non renseignés. Le check-in reste exclusivement accessible depuis le bouton central.

## Publicité fictive de banque

Réutilisation de la campagne initiale existante, sans régie ni dépendance ajoutée. Visuel local `banque-demo.png` et textes HTML lisibles, avec banque imaginaire, absence de service financier et de partenariat. L’encart est une section informative sans gestionnaire de clic ni lien.

## Partage de fiche et historique réservé au propriétaire — 28 octobre 2026

Web Share API sans dépendance, avec volet de secours (copie/manuelle, WhatsApp, e-mail). Le lien est reconstruit depuis l’origine et le chemin uniquement, avec un fragment `lieu` validé contre les établissements existants. Aucune query, session ou donnée de visite transmise. Le partage n’ouvre pas le serveur au public.

Réutilisation des check-ins locaux pour le résumé des lieux visités, sans altérer l’ancien journal XP ni les trois onglets du profil. Filtre propriétaire + statut vérifié, regroupement par lieu et tri par dernière date. L’API historique refuse dorénavant toute cible différente de la session, avant consultation des données. Cette décision utilisateur remplace l’ancienne exposition d’historiques de checks publics/abonnés.
