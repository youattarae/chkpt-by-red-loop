# Carte interactive, radar et 40 paliers

## Carte d’Abidjan

La Carte utilise Leaflet et les tuiles standard OpenStreetMap : zoom, déplacement, choix d’un repère et aperçu de l’établissement. Les boutons permettent de se recentrer sur Cocody, Marcory, Plateau, Yopougon et Riviera, ainsi que sur sa position.

Le cercle bleu représente un rayon de **250 mètres** autour de la position active. Son libellé distingue le simulateur du GPS réel ; il est masqué pendant l’attente d’une position réelle. Le serveur conserve l’autorité sur le rayon, la distance et la validation : être dans le cercle ne déclenche aucune visite automatiquement.

Les filtres de catégories et la recherche sont conservés. Les lieux restent fictifs. En cas de tuiles indisponibles, la carte illustrée fonctionne comme secours. Elle peut aussi être sélectionnée manuellement. Le fond OSM nécessite Internet et envoie au fournisseur les coordonnées de tuiles visibles et l’origine du site, pas les jetons ou preuves GPS du compte. Aucune ville ni personne n’est suivie en temps réel par ce composant.

L’attribution OpenStreetMap reste visible ; Leaflet est sous licence BSD-2-Clause, conservée dans `public/licenses/leaflet.txt`. Pas de téléchargement massif ou de cache hors connexion des tuiles.

La capture automatisée `radar-test-390.png` utilise une tuile neutre de test : elle vérifie la géométrie et l’interaction, pas la disponibilité réelle du fournisseur. La carte en ligne doit être répétée sur les appareils de présentation.

## Catalogue de 40 badges

Huit familles, cinq paliers chacune : **Bronze, Argent, Or, Platine, Diamant**. Les familles sont celles de la conception ; les noms supplémentaires et les seuils ci-dessous sont **provisoires**, autorisés pour le prototype, pas un barème officiel déjà validé.

| Famille | Seuils des cinq paliers | Preuve comptabilisée |
|---|---|---|
| Explorateur | 10, 25, 50, 100, 200 | Lieux distincts à Cocody avec check crédité |
| Foodie | 5, 10, 25, 50, 100 | Restaurants et cafés distincts avec check crédité |
| Maquis Master | 5, 10, 25, 50, 100 | Maquis distincts avec check crédité |
| Culture Hunter | 3, 10, 25, 50, 100 | Lieux culturels distincts avec check crédité |
| Event Hunter | 3, 5, 10, 25, 50 | Événements distincts associés à un check au bon lieu pendant les horaires validés par le serveur |
| Pionnier | 1, 3, 5, 10, 20 | Lieux où le compte figure parmi les cinq premiers visiteurs distincts enregistrés |
| Photographe | 5, 10, 25, 50, 100 | Images importées distinctes appartenant au compte, associées à un check validé dans un lieu vérifié |
| Multi-Explorer | 3, 4, 5, 7, 10 | Communes distinctes de lieux visités et crédités |

Un lieu revu plusieurs fois ne fait pas progresser artificiellement le nombre de lieux distincts. Un refus ou un check absent du journal de points ne compte pas. Les communes et catégories proviennent du référentiel serveur.

Chaque déblocage est enregistré une seule fois dans PointsLedger, sous `BADGE_UNLOCKED`. Ces entrées ont **0 XP** : les bonus de badges restent à valider ; la règle existante de visite conserve 75 XP en première découverte et 50 pour un retour admissible. Aucun bonus fictif annoncé n’est crédité en silence.

La progression et les déblocages viennent du serveur, sont conservés après rechargement et restent propres au compte. Les notifications in-app sont émises pour les nouveaux déblocages renvoyés après validation, pas à chaque rechargement. Les badges acquis restent conservés ; le retrait automatique pour fraude n’est pas une fonction de ce prototype.

## Départ fictif du scénario

Le personnage Koffi conserve des valeurs de départ **explicitement fictives**, côté serveur en démo privée : Explorateur 8, Foodie 5, Maquis 4, Culture 2, Événements 2, Pionnier 1, Photos 3 et deux communes (Cocody et Plateau). Foodie Bronze et Pionnier Bronze sont déjà acquis dans cette présentation.

Le check suivant au Maquis L’Étoile fait passer Maquis à 5 et débloque **Initié du Braisé**. Les nouveaux comptes ne reçoivent pas cette avance. Une remise à zéro opérateur rétablit ce scénario, sans fabriquer de nouvelles visites dans l’historique personnel.

Les paliers élevés sont disponibles dans le moteur, mais ne sont pas tous atteignables avec les seuls six établissements de départ. Leur couverture est vérifiée avec un jeu de tests isolé plus large, pas avec des résultats de marché inventés.

## Événements et photos

Le serveur fournit le catalogue des événements et leurs lieux/horaires. Un événement actif du même lieu peut être choisi **facultativement** dans le parcours central de check-in. « J’y serai » reste une intention et ne débloque rien. Une session fictive du jour au maquis est fournie uniquement en démo privée pour essayer Event Hunter ; elle ne représente pas un événement réel.

Pour Photographe, une image SVG de décor, une URL externe, une image de couverture ou un simple compteur local ne suffit pas. Le serveur vérifie le compte, le check et la propriété du média importé ; les doublons de contenu sont comptés une fois. Le fichier doit présenter une signature PNG/JPEG/WebP admissible. Le client transmet la demande lors d’une publication liée à un check. Les photos sont redessinées par le composant d’import existant ; ce mécanisme n’est pas une expertise antifraude ou une certification EXIF côté serveur. Les médias restent en mémoire serveur jusqu’à son redémarrage, tandis que l’événement de progression est conservé dans le journal.

## Vérifications

Tests des 40 paliers atteignables, absence de double attribution, preuves de compte/événement/photo, stabilité des XP, persistance et isolation entre comptes. Tests de la carte interactive avec tuile de test, zoom du radar, recentrage, recherche et secours hors connexion. Voir IMPLEMENTATION_STATUS.md pour le dernier résultat exact et les limites du déploiement.
