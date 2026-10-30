# Quatre profils et cinq publicités fictives

Mise à jour du 30 octobre 2026. Les noms ont été fournis par le porteur. **Les portraits, biographies et publications sont fictifs** : ils ne décrivent pas la vie réelle de ces personnes et les portraits générés ne reproduisent pas leurs véritables visages.

## Profils de démonstration

| Nom | Identifiant de départ | Univers de la bio et des publications |
|---|---|---|
| Ingrid N’Goan | ingrid_ngoan | Cafés, bonnes tables et couchers de soleil |
| Grâce Agbomi | grace_agbomi | Rooftops, terrasses et week-ends entre amis |
| Yacoub Ouattara | yacoub_ouattara | Maquis, braisé et découvertes à Cocody |
| Georges Armand | georges_armand | Art, musique et découvertes culturelles |

Chaque profil dispose de **cinq publications de départ**, soit vingt publications alternant les quatre auteurs. L’album de quatre images du maquis est conservé. Les nouvelles publications n’inventent pas de preuve de visite ni de points.

Les anciens personnages de démonstration utilisent leurs identifiants techniques existants afin de préserver leurs visites, relations, commentaires et progression. Seuls les personnages de départ sont enrichis ; les comptes personnels restent conservés. Si un identifiant public est déjà pris par un compte personnel, un suffixe de démonstration évite d’écraser ce compte. Une nouvelle ouverture n’ajoute pas de doublons.

Si vous aviez déjà publié avec ces personnages, vos publications supplémentaires sont conservées : vous pouvez donc en voir plus de cinq sur un profil après une mise à jour.

## Essayer les quatre profils

1. Se connecter avec un compte ordinaire, ou démarrer le personnage de présentation depuis l’accès opérateur autorisé.
2. Dans Accueil, ouvrir **Explorer les 4 profils de démonstration**.
3. Toucher le nom ou la photo d’un personnage. Les noms et avatars des publications, ainsi que la recherche, permettent aussi d’ouvrir ces profils.
4. Vérifier la photo, la bio, les cinq publications et les badges publics. **Les XP totaux ne sont pas affichés pour les visiteurs**, ni envoyés dans leur réponse API.

Depuis le personnage Yacoub, son propre profil conserve naturellement ses XP privés. Un compte ordinaire distinct permet de voir les quatre profils comme un visiteur.

Les outils pour changer de personnage restent réservés à l’opérateur d’une démo privée. Aucun mot de passe partagé de personnage ni accès administrateur automatique n’est introduit.

## Rotation publicitaire convenue

**Une publicité en ouverture**, puis une publicité après chaque groupe de cinq publications visibles. Pour vingt publications de départ : cinq bannières, y compris celle d’ouverture.

| Position | Marque fictive | Secteur | Slogan affiché sur le visuel |
|---|---|---|---|
| Avant la première publication | Banque Boucle | Banque | Vos projets prennent de l’élan. |
| Après la 5e | Onde Mobile | Téléphonie / internet | Gardez le lien, partout dans la boucle. |
| Après la 10e, pour un compte majeur | Brise Lagune | Bière | Saveur de soirée. |
| Après la 15e | Atelier Boucle | Vêtements | Le style en mouvement. |
| Après la 20e | Mobi Lagune | Mobilité | La ville, à votre rythme. |

La restauration et la culture restent des thèmes de publications, **pas des secteurs publicitaires de cette rotation**.

Chaque bannière affiche sa marque et son slogan directement sur le visuel, une mention Publicité / Exemple fictif, Marque fictive et Non cliquable. Les textes sont superposés par l’interface pour rester nets et accessibles. Aucun achat, lien, prix, réservation ou partenariat réel n’est proposé. Après la cinquième marque, la rotation recommence si le fil est plus long.

Le calcul des insertions utilise les publications effectivement affichées après filtrage : on n’ajoute pas une publicité tous les cinq emplacements en comptant d’autres publicités.

## Publicité d’alcool

- La bannière Brise Lagune ne s’affiche que si le serveur a authentifié un compte dont l’âge déclaré est au moins 18 ans.
- Un mineur ou un visiteur à l’âge inconnu reçoit une autre bannière à sa place.
- Le visuel d’alcool est stocké hors des fichiers publics ; son endpoint exige aussi un compte majeur. Modifier l’interface ne suffit donc pas à récupérer l’image avec un compte mineur.
- La bannière affiche une mention de modération et le risque pour la santé.
- Le prototype utilise l’âge déclaré à l’inscription ; ce n’est pas un dispositif de vérification d’âge destiné à une application publique en production.

## Médias et performance

Quatre portraits et quatre nouveaux visuels publicitaires ont été générés par IA. Les nouveaux fichiers sont encodés en WebP, sans modification de la composition, pour éviter de livrer les lourds originaux PNG. Les fichiers de génération restent à part de l’application.

## Captures

Les captures sont préparées localement et ne seront publiées qu’après le passage du dépôt en privé.

- [Accueil](captures/profils-publicites/accueil-quatre-profils-390.png)
- [Ingrid](captures/profils-publicites/profil-demo-usr_sarah-390.png), [Grâce](captures/profils-publicites/profil-demo-usr_nadia-390.png), [Yacoub](captures/profils-publicites/profil-demo-usr_01-390.png), [Georges](captures/profils-publicites/profil-demo-usr_02-390.png)
- [Banque](captures/profils-publicites/publicite-demo-0.png), [téléphonie](captures/profils-publicites/publicite-demo-1.png), [bière](captures/profils-publicites/publicite-demo-2.png), [vêtements](captures/profils-publicites/publicite-demo-3.png), [mobilité](captures/profils-publicites/publicite-demo-4.png)

## État des autres demandes

Le lot suivant implémente les pages dédiées, les suggestions puis résultats validés, le menu personnel et le profil compact. Le classement mensuel est désormais accessible seulement dans le menu. Voir [la navigation actualisée](NAVIGATION_PAGES_ET_MENU.md) pour sa validation et ses limites.
