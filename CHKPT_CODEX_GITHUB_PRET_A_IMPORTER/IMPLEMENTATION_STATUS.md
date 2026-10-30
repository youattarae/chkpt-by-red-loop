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

Validation locale : lint et build réussis ; 21/21 groupes serveur et 36/36 groupes avec navigateur (les 21 sont compris dans les 36). Import réel de trois images et une vidéo H.264, lecture mobile, rechargement ; refus du cinquième média, doublons et accès tiers ; vidéo privée persistante après redémarrage.

Jusqu’à quatre images/vidéos par publication, contrôles serveur et lecture protégée ; anciennes publications conservées. Voir [fonctionnement, limites et proposition de stories](docs/PUBLICATIONS_MEDIAS_ET_STORIES.md). Historique : stories intégrées ensuite, voir `docs/STORIES_PROTOTYPE.md`.

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
Le lanceur exécute 35 groupes de contrôles, dont la suite historique de 11 tests.
Les tests utilisent leurs propres serveurs et bases temporaires, sans toucher aux données de présentation.

Les publications, photos, favoris, réactions, commentaires, visites et progressions sont conservés côté serveur et partagés selon les permissions. Les intentions et certaines préférences de démonstration restent locales.
La distance, les sessions et les XP de check-in sont vérifiés côté serveur, sans preuve de l'origine physique du GPS.
Le jeu de départ, les compteurs et la progression préchargée restent fictifs. Les nouveaux médias restent disponibles après redémarrage si le dossier de données est conservé. Le disque d’un hébergement gratuit peut être perdu.
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

## GPS avec commune et fiche lieu agrandie

Le bouton GPS affiche la commune sélectionnée. Son menu conserve Simulateur / GPS Réel et propose six positions de démonstration. La fiche lieu remplit l’écran mobile et s’élargit sur ordinateur : couverture, galerie disponible, adresse, horaires et favoris. Aucun raccourci de check-in n’y est ajouté.

Vérification : `npm run lint`, `npm run build`, recette navigateur **24/24 groupes**, incluant les 11 tests historiques. Contrôles à 320/390/1280 pixels dans les deux thèmes : sélection GPS, dimensions, défilement, retour toujours accessible, galerie, favoris et absence de bouton de check. Captures réelles dans [GPS_ET_FICHE_LIEU.md](docs/GPS_ET_FICHE_LIEU.md). Tests sous Chromium Linux ; répétition physique Mac et Windows à prévoir après installation.

## Publicité bancaire fictive dans l’accueil

L’emplacement initial de publicité utilise un visuel local généré pour Banque Boucle, banque imaginaire. L’encart indique explicitement sa nature fictive, la génération par IA, l’absence de partenariat et reste non cliquable. Aucun produit financier ni taux n’est proposé. Le contrôle du fil vérifie le chargement local de l’image et l’absence de lien ou commande interactive.

Validation de cet ajout : `npm run lint`, `npm run build` et recette navigateur **24/24 groupes**, incluant les 11 tests historiques, réussis sous Chromium Linux. La publicité charge sans service externe et ne provoque pas de navigation au clic. Captures de l’accueil et supports de présentation actualisés.

## Partage des établissements et historique personnel — 28 octobre 2026

Ajout du partage natif ou, en secours, du lien de fiche à copier, WhatsApp et e-mail. Les liens ouvrent la fiche, sans déclencher de check, et excluent toute session, visite ou coordonnée de preuve. Le destinataire doit avoir accès au serveur privé.

Le profil propose un accès explicite aux lieux visités, regroupés par établissement et triés par dernière visite validée, sans refus ni visites d’un autre compte. L’historique est réservé au propriétaire côté interface et API, même pour les profils/checks publics et les opérateurs. Les données affichées restent celles du navigateur. Voir [PARTAGE_ET_HISTORIQUE.md](docs/PARTAGE_ET_HISTORIQUE.md).

Validation de cette version : `npm run lint`, `npm run build`, puis **25/25 groupes** de la recette navigateur réussis, incluant les 11 tests historiques. Le contrôle API vérifie les refus anonymes, tiers et opérateurs ainsi que l’accès du propriétaire, même après un check public. Le nouveau contrôle navigateur couvre partage natif/annulation, copie/secours, lien direct, regroupement, confidentialité et persistance dans les deux thèmes à 320/390/1280 pixels. PDF et support HTML régénérés ; secours revérifié hors connexion. Le [bilan complet](docs/BILAN_PROTOTYPE.md) récapitule les lots, fonctionnalités et limites.

## Compléments, carte interactive et badges serveur — 28 octobre 2026

- Bienvenue en trois étapes, rejouable ; recherche Carte et filtres Sortir par catégorie, texte et distance. GPS réel en attente distinct du simulateur. Le filtre Clubs peut être vide car aucun club n’est fourni dans le seed.
- Récompense explicitement fictive après le check du maquis, sans débit de points ; aperçu établissement avec statistiques inventées et sans données privées.
- Profils consultables et suivi authentifié, idempotent et persistant. Profils privés/mineurs masqués et historique exclusivement réservé au propriétaire. Publications encore locales au navigateur.
- `ReviewSection` : note entière 1–5 et commentaire de 3–1 000 caractères, exemple fictif non comptabilisé, un avis modifiable par compte et lieu, validation et persistance serveur. Migration additive de la table reviews.
- Leaflet/OpenStreetMap, recentrage sur cinq zones, cercle de 250 m et filtres existants. Carte illustrée de secours si les tuiles échouent. Aucun check lancé depuis les repères. Le test géométrique utilise une tuile neutre ; la disponibilité réelle d’OSM reste à vérifier sur les appareils. Licence conservée et attribution visible.
- 40 paliers dans huit familles, barème provisoire autorisé. Visites créditées et preuves événement/photo évaluées côté serveur ; journalisation `BADGE_UNLOCKED` unique sans bonus XP supplémentaire. Le départ fictif de Koffi est explicite. Les images de décor et les intentions d’événement ne constituent pas une preuve de badge.
- Préparation Render Node.js 22 avec barrière privée avant fichiers et API, deux secrets distincts, HTTPS, cookie sécurisé, fermeture et limitation de tentatives. Test navigateur derrière un proxy TLS temporaire, y compris ouverture d’une fiche partagée après accès. **Aucun compte Render ni service distant créé : pas encore de lien Internet prêt à utiliser.**

Validation exécutée : `npm run lint`, `npm run build` et **33/33 groupes** de la recette complète sous Chromium Linux, incluant les 11 tests historiques. Les nouveaux tests vérifient les 40 paliers atteignables dans un jeu isolé, les doublons, les preuves, les comptes privés, les filtres et le radar. PDF et HTML de secours régénérés et HTML revérifié sans réseau. Tests physiques Mac/Safari/Windows et hébergement réel à compléter après installation.

Le [bilan](docs/BILAN_PROTOTYPE.md), les [évolutions](docs/EVOLUTIONS_DEMO.md), les [règles carte/badges](docs/CARTE_RADAR_ET_40_BADGES.md) et le [guide d’accès distant](docs/ACCES_PRIVE_DISTANCE.md) décrivent les fonctions et limites. Le [questionnaire de conception](docs/QUESTIONS_CONCEPTION_PROTO_ET_VERSION_FINALE.md) est prêt à copier dans la conversation de conception.

Complément de compatibilité : sous Node.js 22 en conteneur local sans réseau, vérification TypeScript, compilation Vite et **20/20 groupes serveur** réussis (suite historique comprise). Les dépendances déjà installées ont été montées en lecture seule ; cela ne revendique pas une installation ou un déploiement Render réussis. Le chargement de configuration Vite `runner` a été utilisé pour compiler vers un répertoire temporaire avec les sources en lecture seule.

Accès externe : une requête de tuile OpenStreetMap réelle depuis cet environnement renvoie HTTP 403. Le fond réel n’est donc pas validé ici ; géométrie, interaction et secours sont testés avec des tuiles contrôlées. L’accès à l’API GitHub pour modifier la description de la PR renvoie également Forbidden ; le code et les documents sont publiés par Git sur la branche existante.

## Synchronisation et prototype simplifié — suite du 28 octobre 2026

Décisions explicites : avancer sur le partage des données entre appareils ; budget strictement gratuit ; ne pas dérouler tous les badges dans le prototype. Le document de réponses fourni est archivé comme version de travail, sans appliquer automatiquement ses propositions ou ses références à un autre code 0.3.

- Publications, médias, réactions, commentaires et favoris persistés dans la base JSON existante, avec migration additive. Historique et journal propres au compte chargés depuis le serveur, sans données GPS de preuve dans cet état partagé. Actualisation régulière et au retour sur la fenêtre.
- Auteur, audience, lieu et lien de visite contrôlés côté serveur. Photos privées lues avec authentification et objets temporaires du navigateur, sans jeton dans l’URL. Le contenu d’un profil privé ou mineur ne devient pas public. Les accès par ancien jeton de média ne contournent plus les permissions.
- Création de publication et commentaire idempotente ; texte gardé lors d’un échec. Les mutations en cours et anciennes réponses ne doivent pas annuler une action récente ou réafficher les données du compte précédent. Le cache personnel ancien n’est pas présenté comme une preuve et une copie locale appartenant au compte peut être exportée après authentification.
- Photographe n’est crédité qu’après enregistrement d’une publication avec média admissible lié à une visite, pas après un simple import abandonné.
- Sauvegarde compressée et chiffrée AES-256-GCM avec clé dérivée par scrypt, export/restauration administrateur en démo privée. Aucune session active exportée. Restauration explicitement confirmée, validation avant remplacement et copie de sécurité chiffrée ; toutes les sessions sont fermées après restauration.
- Page Badges limitée à six cartes au maximum. Catalogue technique conservé pour la suite ; aucun arbitrage sur les 40 badges distincts et leurs degrés n’est appliqué.
- Configuration gratuite conservée, pas de service ou disque payant créé. `CHKPT_DATA_DIR` permet de choisir le dossier local mais ne transforme pas le disque gratuit Render en stockage permanent. Aucun compte Render ou lien distant n’a été créé.

Validation : `npm run lint`, `npm run build`, **35/35 groupes** navigateur et serveur sous Chromium Linux (suite historique de 11 tests incluse). Deux contextes de navigateur sans cache commun retrouvent une publication, un favori, une visite, les XP et une photo privée. Une réponse perdue est reprise sans doublon ; un compte changé ignore l’ancienne réponse ; l’export chiffré est téléchargé depuis l’interface. Tests serveur de redémarrage, de refus d’accès et de restauration avec mot de passe erroné, puis correcte.

Compatibilité Node.js 22 : TypeScript, compilation et **21/21 groupes serveur** réussis avec données temporaires isolées, y compris lorsqu’un dossier de données est défini dans l’environnement parent. Installation sur Mac/Windows, essais Safari et hébergement réel restent à répéter. Voir [SYNCHRONISATION_ET_SAUVEGARDE.md](docs/SYNCHRONISATION_ET_SAUVEGARDE.md).
