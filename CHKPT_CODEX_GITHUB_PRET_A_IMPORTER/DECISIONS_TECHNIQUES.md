## Dix corrections et guide complet — 30 octobre 2026

Les dix défauts de la revue sont corrigés : séparation des comptes, audience explicite, confirmation destructive, cache défensif, reprise du check sans double XP, filtres cohérents, favoris et erreurs fiables, clavier/focus. Lint/build réussis et **44/44 groupes complets réussis**, dont les contrôles de cas limites ajoutés. [Détails et limites](docs/CORRECTIONS_CAS_LIMITES_ET_GUIDE.md).

Guide d’utilisation complet de la version actuelle : [PDF](docs/GUIDE_UTILISATION_COMPLET.pdf) et [PowerPoint modifiable](docs/GUIDE_UTILISATION_COMPLET.pptx), 41 pages/diapositives, chacun sous 3 Mo. Synchronisation de la branche GitHub explicitement demandée pour fournir le nouveau code ; passage en privé reporté à la fin du travail. Aucune fusion ni mise en ligne de la démo.

## Audit des cas limites — 30 octobre 2026

Dix comportements problématiques reproduits sur serveur/base temporaires sous Chromium, sans modification fonctionnelle : états personnels traversant le changement de compte, audience publique implicite après check privé, remise à zéro destructive trop peu explicite, écran blanc sur cache invalide, réponse de check perdue sans reprise, incohérences recherche/filtres, catégorie effacée, favori non confirmé, erreur de profil persistante et fermeture Échap absente. **Correctifs à réaliser** ; les 43 groupes précédemment réussis ne couvrent pas tous ces cas. Voir [reproductions, preuves et ordre de correction](docs/AUDIT_ANGLES_MORTS_ET_FLUIDITE.md). Cette revue n’annonce pas une nouvelle exécution de la suite complète ni une certification de sécurité.

## Supports de présentation actualisés — 30 octobre 2026

Le passage du dépôt en privé est reporté à la fin du travail selon la demande du porteur ; cela ne bloque pas le développement local. Les supports de secours sont régénérés depuis la navigation actuelle : HTML autonome de quatre étapes et PDF de dix pages (environ 1,3 Mo). Le guide Ingrid et le pitch corrigent les anciens noms, la synchronisation et le point d’entrée central du check-in ; ils expliquent menu, profils, classement et lancement Mac/Windows.

Vérification de ce lot : lint réussi ; scénario complet 390/1280 px avec deux répétitions après remise à zéro autorisée, support HTML sans réseau à 320/1280 px, images intégrées et PDF sous 40 Mo. PDF contrôlé : dix pages A4, contenu sans débordement, page du menu relue visuellement. La suite globale 43/43 du lot de navigation reste la dernière exécution complète ; elle n’est pas annoncée comme réexécutée pour ce lot documentaire. Essai sur le Windows d’Ingrid et activation d’un hébergement distant encore nécessaires.

## Navigation actualisée — 30 octobre 2026

Les pages de consultation, le retour navigateur, les suggestions suivies d’une page de résultats, les filtres rétractables, le menu personnel et le profil compact sont maintenant implémentés localement. Le classement quitte Sortir et se trouve seulement dans le menu. XP totaux et historique restent personnels. Voir [les changements et la recette](docs/NAVIGATION_PAGES_ET_MENU.md). Validation : lint, build et **43/43 groupes de tests réussis** ; essais de navigation sur 320, 390 et 1280 px, retour navigateur/défilement, changement de compte et sortie de console inclus. Aucun push public, déploiement ni fusion.

Les notes suivantes décrivent les étapes précédentes et leurs validations historiques.

## Revue, quatre profils et publicités diversifiées — 30 octobre 2026

Préparé localement : quatre profils fictifs aux noms fournis (Ingrid N’Goan, Grâce Agbomi, Yacoub Ouattara, Georges Armand), portraits IA WebP, bios et cinq publications chacun ; conservation des données et migration idempotente. Publicité avant le fil puis toutes les cinq publications : banque, téléphonie, bière réservée aux majeurs côté serveur, vêtements, mobilité ; marques/slogans sur le visuel, fictifs et non cliquables.

Corrections de revue : XP totaux propriétaire uniquement et badges publics minimaux ; suppression du classement obsolète chiffré en dur ; sources/maps bloquées en production, minification explicite, démo distante en développement refusée ; retrait des jetons en URL et détails techniques superflus ; brouillons privés jusqu’à confirmation, nettoyage des imports non utilisés, fichiers publiés protégés et réinitialisation du brouillon lors du changement de compte.

Vérifications : lint/build réussis, 43/43 groupes complets ; après les derniers contrôles, 25/25 groupes serveur et recette dédiée quatre profils/publicités réussis (mineurs inclus). Les 11 tests historiques font partie du compte, pas un ajout. Navigation par pages, recherche validée/suggestions, menu latéral et profil compact encore à implémenter : ne pas déclarer ces décisions terminées.

Le dépôt GitHub a été constaté Public et l’accès API répond Forbidden. Le nouveau lot ne doit pas être poussé publiquement : passage en privé à effectuer par le propriétaire. Aucun déploiement ni fusion. Voir [audit et limites](docs/AUDIT_FLUIDITE_SECURITE_2026_10_30.md), [contenus](docs/PROFILS_ET_PUBLICITES_DEMO.md).

## Recherche, éditorial et classement mensuel — 30 octobre 2026

Décisions clarifiées : Accueil général avec filtres (profils, établissements, événements, publications), recherche intelligente et filtres de lieux sur Carte, Sortir éditorial avec petite recherche interne. Point bordeaux sous l’icône active. Listes réelles d’abonnés/abonnements au toucher des compteurs sur les profils accessibles. Rubrique classement en bas de Sortir, ouverte sur Amis/Global ; XP mensuels uniquement ; Amis = suivis réciproques + soi. Totaux publics sur les profils accessibles, sans historique, preuves ni registre.

Validation locale : lint/build réussis ; suite complète 40/40 groupes (23 groupes serveur inclus) ; après ajustements de lisibilité, recette dédiée réussie de 320 à 1280 px. Les tests d’ancien emplacement ont été adaptés à Carte ; le test de secours image cible maintenant le PNG effectivement affiché dans Sortir. Aucun test de confidentialité ou parcours check-in supprimé. Les données existantes et la pile technique sont conservées. Voir [guide, calculs, limites et captures](docs/RECHERCHE_SORTIR_ET_CLASSEMENT.md). Aucun déploiement ni fusion.

## Stories intégrées et vérification — 30 octobre 2026

Demande explicite : stories et vérification complète. Accueil, profil et avatar des publications ; ajout + ; un média, texte facultatif, visibilité, durée serveur de 24 h, lecture plein écran et suppression propriétaire. Métadonnées persistantes ajoutées sans effacer les données existantes ; anciens backups compatibles. Médias dédiés, expiration de leur accès et nettoyage ; aucune récompense ni preuve de visite.

Validation locale : lint/build réussis, suite complète 38/38 groupes ; après les derniers ajustements, 22/22 groupes serveur et recette stories ciblée réussis. Tests : mineurs, abonnés, propriétaire, expiration du lien, nettoyage, redémarrage, vidéo, deux appareils, accès depuis accueil/profil/publication et suppression. Capture `docs/captures/story-lecture-390.png`. Aucune fusion ni mise en ligne. Voir [le guide et les limites](docs/STORIES_PROTOTYPE.md).

## Album illustré de quatre images — 30 octobre 2026

La publication fictive du maquis montre quatre vues en grille 2 × 2, dont trois nouvelles images générées (braisé, boissons, soirée). Mention IA/fictive commune à l’album. Mise à jour des seuls exemples intacts au chargement de la base, sans changer commentaires/réactions ni publications personnelles. Lint, build, 21/21 groupes serveur et recette ciblée Accueil sur 390/1280 px en clair/sombre réussis. Voir `docs/PUBLICATIONS_MEDIAS_ET_STORIES.md` et `docs/VISUELS_ET_DROITS.md`.

## Correction GitHub Actions — 30 octobre 2026

L’exécution [41049586164](https://github.com/youattarae/chkpt-by-red-loop/actions/runs/41049586164) échouait dans `next_features_browser.ts:39` : le message de recherche sans résultat existait uniquement sur la carte illustrée. La carte interactive avec des tuiles disponibles ne l’affichait pas. Le problème a été reproduit localement avec des tuiles neutres simulant une réponse réussie, puis corrigé dans `MapView.tsx` par un état vide commun aux deux modes. Le test radar vérifie désormais recherche vide, absence de repères/fiche et remise à zéro dans chaque mode. Aucun contrôle supprimé ni délai artificiellement allongé. Lint, build et test ciblé réussis ; validation complète et GitHub à suivre.

# Publications multimédias — 30 octobre 2026

Jusqu’à quatre images/vidéos par publication, contrôles serveur et lecture protégée ; anciennes publications conservées. Voir [fonctionnement, limites et proposition de stories](docs/PUBLICATIONS_MEDIAS_ET_STORIES.md). Historique : stories intégrées ensuite, voir `docs/STORIES_PROTOTYPE.md`.

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

## Compléments de présentation et accès distant — 28 octobre 2026

- Bienvenue proposée sans bloquer l’accueil, trois étapes rejouables depuis les réglages. Préférence mémorisée hors du reset de scénario.
- Recherche Carte insensible aux accents et filtres Sortir combinant catégorie, texte et rayon. Distances à vol d’oiseau depuis la position active ; en attente du GPS réel, aucun rayon simulé n’est présenté comme réel. Les événements restent hors de ces filtres. Aucun club n’est inventé dans le jeu actuel.
- Récompense liée à un check local validé au maquis, usage fictif mémorisé par utilisateur et visite, sans débit de points ou avantage commercial. Aperçu établissement strictement statique et fictif, sans interrogation d’historiques privés.
- Consultation d’un profil depuis l’auteur d’une publication. DTO serveur minimal, profils privés/mineurs masqués ; demandes de suivi privé non implémentées. Suivre et ne plus suivre sont authentifiés, idempotents et persistés ; une réponse de profil ancienne ne doit pas annuler une modification récente des abonnements. Ajout du personnage Amara dans le seed et migration additive sans écraser un utilisateur existant.
- `ReviewSection` dans la fiche. Note entière 1–5, commentaire de 3–1 000 caractères ; auteur imposé par la session, un avis modifiable par utilisateur et lieu. Nouvelle table `reviews` migrée sans remise à zéro ; avis de profils privés ou mineurs non exposés. L’exemple statique est identifié et n’est pas une vraie entrée, les notes fictives historiques restent séparées.
- Préparation Node 22 et Blueprint Render gratuit, sans achat ou création de service. Barrière HTTPS avant les parsers, API et fichiers : secret visiteur distinct du secret opérateur, hash scrypt, cookie sécurisé HttpOnly/SameSite Strict, sessions de huit heures en mémoire, révocation à la fermeture et limites de tentatives. Confiance limitée au proxy Render ; pas de publication HTTP directe. Cette protection ne remplace pas les permissions métier.

Une offre gratuite peut dormir et perdre sa base locale après redémarrage. La persistance et la synchronisation des publications ne sont pas ajoutées par cet hébergement. Le guide décrit le compte à créer et les vérifications sur un vrai lien HTTPS avant utilisation.

## Leaflet, radar et 40 paliers — barème provisoire autorisé

Leaflet 1.9.4, chargé séparément, réutilise la sélection de lieu et ses filtres. Tuiles OpenStreetMap avec attribution, sans cache massif ; secours SVG lors d’un échec. Rayon visuel de 250 m seulement avec position disponible, position simulée identifiée. Le rayon métier reste contrôlé côté serveur.

Catalogue partagé de huit familles × cinq paliers. Les noms et seuils supplémentaires sont provisoires, les noms de bronze existants sont conservés. Évaluation serveur à partir des visites présentes dans PointsLedger, lieux/communes distincts, preuves d’événement actif au bon lieu et images importées appartenant au compte, liées à une visite valide. Une empreinte de contenu évite le comptage répété d’une photo. L’évaluation crée des entrées BADGE_UNLOCKED idempotentes à zéro XP afin de préserver les 75/50 XP existants. Notifications après les nouveaux déblocages ; le client ne décide plus des seuils atteints. L’avance fictive du personnage de présentation reste déclarée côté serveur.

Un catalogue d’événements serveur et une session fictive du jour permettent d’essayer une présence événementielle, facultative dans le check central. Une intention J’y serai n’est pas une preuve. La vérification d’une image n’est pas une certification antifraude ou EXIF : propriété, liaison et signature de format sont vérifiées ; la transformation des pixels reste dans l’import client existant.

## Données partagées sans nouvelle stack — 28 octobre 2026

Réutilisation du moteur de fichiers atomiques existant ; ajout de tables posts, saved_places et media sans supprimer les comptes ou visites déjà valides. Écritures de ces tables préparées avant remplacement de l’état mémoire. Pas de PostgreSQL, service de paiement ou nouvelle dépendance. Les médias base64 sont désormais persistés dans cette base avec quota de démonstration ; un stockage de fichiers/objets adapté à la production reste un futur chantier.

Les routes publiques ne renvoient que les publications accessibles ; l’état personnel est lié exclusivement à la session. Aucun auteur, privilège ou preuve de visite du client n’est pris pour autorité. Les mutations explicites de favoris/réactions et les identifiants de requête évitent les doublons. Les snapshots de synchronisation sont ignorés en cas de changement de session, d’action récente ou de modification des abonnements ; les caches privés ne sont pas utilisés avant authentification pour afficher le profil. Les anciennes données locales ne sont pas importées comme visites ou XP.

Les images privées sont chargées en Blob avec en-tête d’authentification, révoqué à la sortie du composant. Les URLs ne contiennent pas de secret de session. La visibilité du profil et l’audience du média sont vérifiées côté serveur, sans cache public permanent.

La sauvegarde chiffrée est une mesure de reprise manuelle cohérente avec le budget gratuit ; elle ne garantit pas la conservation du disque Render. Aucun fournisseur supplémentaire ni dépense engagée. Sessions exclues des exports et révoquées à la restauration. Source de données configurable par CHKPT_DATA_DIR ; les tests forcent leurs répertoires temporaires pour éviter toute modification du dossier réel de l’utilisateur.

L’écran des badges est volontairement réduit. Le moteur de catalogue existant n’est pas réécrit avant l’arbitrage de conception sur badges distincts et degrés.
