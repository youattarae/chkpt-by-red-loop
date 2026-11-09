# Référentiel des lieux et vérification — 9 novembre 2026

CHKPT conserve sa base JSON et ses identifiants propres. Le fond cartographique ne crée pas les fiches. Aucune donnée personnelle de démonstration n’a été réinitialisée pour ces travaux : tous les essais utilisent des dossiers temporaires.

## Carte et limites externes

MapLibre GL 6.17.0 remplace progressivement le fond Leaflet. Le module historique reste dans le dépôt. Le worker est compilé localement ; le style par défaut est Liberty d’OpenFreeMap. `VITE_CHKPT_MAP_STYLE` permet de changer de style autorisé au prochain build, sans secret. Seules les couches symboliques géographiques connues restent affichées : les POI commerciaux et couches symboliques inconnues sont masqués. Vérifier le schéma de tout nouveau fournisseur.

Sept pictogrammes, gris/non vérifié ou vert/vérifié, avec un halo rouge sponsorisé indépendant. Hôtel et événement sont des variantes d’affichage, rattachées à la catégorie existante « autre ». Deux lieux fictifs supplémentaires illustrent ces variantes en démo privée. Ils ne constituent ni import réel ni partenariat. La sélection utilise un contour bleu distinct. Le panneau Outils carte garde le radar de 250 m, les catégories et une liste accessible des lieux. Le secours illustré reste schématique.

L’accès externe aux sites OpenFreeMap/OSM/Overpass a renvoyé une erreur de tunnel HTTP 403 dans cet environnement. Les tests graphiques utilisent donc un style synthétique local, avec rendu MapLibre effectif, et un test de panne. **Le fournisseur réel, ses conditions actuelles et un extrait réel de Cocody restent à vérifier.** La licence BSD du paquet MapLibre installé est archivée dans `public/licenses/maplibre.txt`. L’interface contient les crédits OSM/OpenFreeMap et chaque fiche importée expose sa provenance. Les obligations ODbL concernant la base dérivée, sa diffusion et son attribution demandent une validation avant exploitation publique.

## Import reproductible

Source prévue : extrait JSON Overpass autorisé de Cocody, objets node/way/relation avec coordonnées/centre, nom et catégorie reconnue. Limite indicative : longitude −4,04 à −3,90, latitude 5,33 à 5,43 ; ce rectangle technique ne prétend pas décrire exactement les limites administratives. L’API opérateur accepte une autre emprise. Pas de scraping Google Maps ni de collecte répétitive sur les services OSM publics. Aucun téléchargement automatique massif.

Le fichier `tests/fixtures/cocody-osm-synthetic.json` est **entièrement synthétique**. Son fournisseur est `fixture`, ses identifiants ont un espace séparé et sa licence indique `CC0-test-fixture`. Il sert à tester le format, jamais à revendiquer une couverture réelle.

Depuis le dossier du projet, serveur arrêté pour la commande CLI :

```sh
npm run places:import -- --file extrait-autorise.json --data-dir /chemin/absolu/.data
```

Sans `--apply`, aucun fichier n’est écrit, même si le dossier de données n’existe pas. Après examen du résultat :

```sh
npm run places:import -- --file extrait-autorise.json --data-dir /chemin/absolu/.data --apply
```

Ajouter `--fixture` seulement pour un jeu synthétique. L’application sauvegarde la base existante dans le même dossier privé avant l’import CLI. Conserver également sa sauvegarde habituelle avec les médias, hors Git. Restaurer uniquement serveur arrêté. Une seule instance écrit dans cette base : pas d’import CLI pendant que le serveur fonctionne. Le panneau opérateur évite ce problème en réutilisant le processus serveur.

Le panneau Réglages → Console opérateur → Lieux propose aperçu/import, association explicite des correspondances et fusion manuelle. Les clés fournisseur/type/identifiant évitent les doublons au rerun ; les versions antérieures sont exclues. Une proximité et un nom semblable suggèrent une correspondance sans fusion automatique. Une correction locale validée reste prioritaire sur une mise à jour source. Provenance : type/ID/version/date source/licence/date d’import. Les prix, notes et horaires inconnus restent inconnus.

Les propositions des utilisateurs sont persistantes, limitées et examinées par un opérateur. Une fusion conserve les anciens liens en alias et réaffecte les relations ; les avis concurrents d’un même auteur sont archivés sans perte et le plus récent reste actif. Les checks en attente issus d’une fusion nécessitent un examen manuel. Aucun crédit XP ne découle de la fusion.

## Checks et XP différés

Un lieu non vérifié admissible accepte un check `pending_validation` avec **0 XP**. La vérification opérateur réévalue les preuves historiques : rayon, précision, identité, date, coordonnées du lieu, doublon quotidien, éventuelle décision de rejet. Les preuves anciennes insuffisantes, lieux déplacés ou fusionnés restent à examiner. L’approbation manuelle ne contourne pas les critères de présence. Un rejet n’attribue aucun XP.

Le crédit garde le barème existant : première visite 75 XP, suivantes 50 XP. Un registre unique par check, une transaction serveur et l’évaluation des badges empêchent les doubles crédits. Une notification privée informe l’utilisateur, sans lui demander de revenir. Les paliers de badges et leurs seuils restent inchangés.

**Classement mensuel :** le registre existant comptabilise le crédit au mois où il est effectivement attribué. Ces travaux ne réécrivent pas les classements passés. Attribuer rétroactivement les XP au mois de la visite constituerait une autre règle à décider.

## Partages et profil

Les réponses aux stories empruntent les DM existants. La carte Story est résolue selon les permissions actuelles ; à expiration, le texte privé reste et le média devient indisponible. Les cartes de publication et les reposts gardent une référence et l’attribution : pas de duplication de fichiers ni de réactions. Sources privées, supprimées ou bloquées sont masquées.

Le profil affiche au maximum trois badges acquis à droite du lieu. Le choix automatique privilégie le grade puis l’ordre du catalogue. Badges et progression → Choisir mes badges permet une sélection ordonnée persistante ou un retour au choix automatique. Les XP totaux restent réservés au propriétaire.

Les publications à plusieurs médias utilisent le même carrousel sur l’accueil et le profil : un média visible, points de position, glissement/clavier, vidéos muettes au départ. Le partage externe utilise les fonctions natives ou une copie de lien valide ; aucune intégration privée à un réseau social n’est simulée.

## Vérifications matérielles restantes

Les vues 320/390/1280 px sont des émulations Chromium sous Linux, avec glissement tactile synthétique. Elles ne remplacent pas Safari iPhone, Chrome Android, le GPS réel et un réseau de présentation. Effectuer la répétition sur le téléphone d’Ingrid après récupération du code autorisée. Le navigateur télécharge toujours du JavaScript inspectable ; permissions serveur, absence de secrets et confidentialité restent la protection, pas une promesse d’impossibilité de rétro-ingénierie.

La commande CLI `--apply` exige une base déjà initialisée par l’application et ne charge pas le module d’authentification. Elle modifie uniquement les tables de lieux/provenance et leur révision ; comptes, sessions, messages et médias restent identiques. Les écritures se font par fichier temporaire puis renommage. Les tests comparent aussi ces tables avant/après. Pour une installation neuve, démarrer puis arrêter l’application une fois avant application d’un import.

Après une fusion manuelle, l’identité retenue (nom, catégorie, position, adresse et variante de pictogramme) est protégée comme choix local. Une seconde source importée ne peut donc pas déplacer la fiche conservée. Les événements résolvent les anciens identifiants vers cette fiche ; leur présence reste soumise aux contrôles habituels. Une nouvelle correction opérateur reste possible.

Une [requête Overpass proposée](references/2026-11-09/cocody-extraction-proposee.overpassql) décrit les catégories et le rectangle initial avec `out center meta` pour conserver coordonnées, identifiants et versions. Elle n’a pas été exécutée ni validée auprès d’un service réel. Vérifier ses règles d’usage avant une extraction ponctuelle autorisée, conserver le fichier et sa date, puis passer par le dry-run. Ne pas relancer périodiquement cette requête sur un service public depuis l’application.
