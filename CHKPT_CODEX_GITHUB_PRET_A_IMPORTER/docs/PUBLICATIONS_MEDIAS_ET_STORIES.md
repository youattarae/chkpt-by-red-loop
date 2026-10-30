# Publications : jusqu’à quatre images ou vidéos

Mise à jour du 30 octobre 2026.

## Ce qui est ajouté

Dans Accueil → créer une publication, ou après un check-in validé :

1. Écrire le texte.
2. Ajouter jusqu’à quatre fichiers, ensemble ou en plusieurs sélections. Photos et vidéos peuvent être mélangées.
3. Retirer un média si besoin, puis publier lorsque les imports sont terminés.

Formats : JPEG, PNG, WebP, MP4 et WebM. Chaque fichier est limité à 15 Mo ; le stockage total du prototype reste limité à 50 Mo. Un fichier trop lourd doit être réduit avant import. Les vidéos ne sont pas converties : leur lecture dépend aussi du codec accepté par le navigateur. MP4 H.264 est recommandé pour Safari et Windows.

Les images sont redimensionnées et réencodées pour retirer leurs métadonnées, notamment GPS. Les vidéos sont conservées telles quelles : aucune suppression de métadonnées ni compression vidéo n’est annoncée. Lecture avec commandes, sans démarrage automatique. Les médias privés utilisent la session en en-tête, sans jeton dans les liens.

Le serveur impose quatre médias au maximum, refuse les doublons et les médias importés par un autre compte, et déduit leur type à partir du fichier enregistré. Les anciennes publications à une image restent compatibles. La publication facultative après un check conserve le lien avec la visite ; publier seul ne valide aucune visite.

## Exemple visuel dans l’accueil

La publication fictive de Koffi « Une belle découverte à Cocody » montre quatre vues : terrasse, braisé, boissons et soirée. Les trois dernières sont de nouvelles illustrations générées par IA. L’album apparaît aussi sur son profil. Les autres publications à une image sont conservées.

Au démarrage, les anciennes publications de démonstration intactes reçoivent cet album ; leurs réactions et commentaires sont conservés. Aucun album n’est ajouté aux publications personnelles. Il n’est pas nécessaire de réinitialiser la démo pour voir cet exemple.

## Stories intégrées

Les stories convenues sont maintenant disponibles depuis l’accueil, la photo de profil et l’avatar des publications, avec ajout par + et expiration serveur après 24 h. Voir [le guide des stories](STORIES_PROTOTYPE.md).

## Résultats

Lint et build réussis. Suite serveur : 22/22 groupes ; suite complète avec navigateur : 38/38 groupes, incluant les groupes serveur. Test de lecture effectué sur Chromium mobile simulé ; Safari et Windows restent à essayer sur les appareils de présentation.

## Vérification reproductible

`npm run lint`, `npm run build`, `npm test`, puis `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` dans l’environnement de test.

Le test serveur contrôle notamment quatre médias acceptés, cinq refusés, doublons refusés, propriété et confidentialité. Le test navigateur importe trois images et une vidéo, vérifie la limite, publie, lit réellement la vidéo et recharge la page. `tests/fixtures/blue-demo.mp4` est une mire bleue synthétique d’une seconde créée avec FFmpeg, sans son ni données personnelles.
