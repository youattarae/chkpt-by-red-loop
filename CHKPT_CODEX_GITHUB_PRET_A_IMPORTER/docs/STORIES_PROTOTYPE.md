# Stories CHKPT — prototype

Décision utilisateur du 30 octobre 2026. Les stories sont désormais intégrées ; l’ancienne exclusion de cette fonction dans la passation est remplacée par cette décision.

## Essayer sans lire le code

1. Se connecter à son compte.
2. Dans l’accueil ou sur son profil, appuyer sur le petit **+** de sa photo.
3. Importer **une image ou une vidéo**, ajouter un texte facultatif, choisir la visibilité, puis **Publier la story**.
4. Un anneau coloré apparaît sur la photo. Appuyer dessus pour lire la story depuis l’accueil, le profil ou une publication. Le nom de l’auteur dans une publication ouvre toujours son profil.
5. Les flèches passent d’une story à l’autre pour cet auteur ; la croix et Échap ferment la lecture.
6. L’auteur peut choisir **Supprimer cette story**. Les autres personnes ne disposent pas de cette action.

Quand une personne n’a pas de story active, son avatar de publication continue d’ouvrir son profil. Sur son propre profil, le + reste disponible. L’anneau indique la présence d’une story active, pas un état « déjà vu » : ce prototype ne conserve pas d’historique de lecture.

## Règles et confidentialité

- Une story dure **24 heures à partir de son enregistrement serveur**. L’heure du téléphone ne prolonge pas cette durée côté serveur.
- Une story contient un seul média ; une publication ordinaire peut toujours en contenir jusqu’à quatre.
- Les stories demandent un compte connecté, même pour la lecture. Public, Abonnés ou Moi seul ; les profils privés et les 13–17 ans restent privés dans cette démo. Aucune demande d’abonnement privée n’est simulée.
- Aucun historique de lieux, preuve GPS, compteur de vues inventé, message privé, paiement ou live n’est ajouté. Une story ne donne ni XP ni validation de visite.
- Le même compte sur un autre appareil retrouve les stories du même serveur, avec actualisation périodique lorsqu’il est visible.
- Après expiration ou suppression, le lien du média est aussi refusé par le serveur. Les fichiers expirés sont nettoyés dans la minute si le serveur tourne, ou lors de la lecture de la liste / d’un nouvel import. Une copie déjà téléchargée par un lecteur ne peut pas être effacée de son appareil à distance.
- Les médias de story sont distincts des médias de publication : leur expiration ne supprime pas de photo d’une publication.

## Limites du prototype gratuit

15 Mo par fichier, JPEG/PNG/WebP ou MP4/WebM ; 50 Mo de stockage total et 20 stories actives par compte. Les images sont réencodées pour retirer leurs métadonnées. Les vidéos sont conservées telles quelles, sans conversion, compression ni purge de métadonnées ; MP4 H.264 conseillé pour Safari. La lecture n’est pas automatique.

Les imports annulés avant publication peuvent encore occuper du stockage, comme les autres brouillons de médias du prototype. Le disque gratuit de l’hébergement peut disparaître ; la sauvegarde chiffrée inclut les stories, mais une restauration ne renouvelle pas leurs 24 heures.

L’expiration est réelle côté serveur ; une interface laissée ouverte sans réseau peut afficher son dernier état jusqu’à son rafraîchissement. Aucun accès privé distant n’est créé par cet ajout : l’hébergement doit encore être activé séparément.

## Vérifications

Les tests serveur utilisent une base temporaire : accès connecté, propriétaire, profils mineurs, visibilité des abonnés, refus de réutiliser un média de publication, nouvelle tentative sans doublon, expiration du lien direct, nettoyage et persistance après redémarrage.

La recette navigateur teste l’ajout depuis le profil, la lecture dans l’accueil, depuis l’avatar de publication et le profil d’un autre compte, un second appareil, Échap et la suppression. Elle utilise une personne fictive et un visuel généré, sans données personnelles.

Résultats locaux : lint et build réussis, 38/38 groupes avec navigateur. Les derniers contrôles ciblés confirment également 22/22 groupes serveur et le parcours stories sur la version finale. [Capture de lecture](captures/story-lecture-390.png).
