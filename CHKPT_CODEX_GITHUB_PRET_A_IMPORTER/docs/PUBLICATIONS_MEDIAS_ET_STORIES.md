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

## Stories : proposition, pas encore intégrée

Oui, ce mécanisme peut être ajouté sans refaire l’application. Proposition pour le prototype :

- Une rangée de stories au-dessus du fil Accueil.
- Une photo ou une vidéo par story, avec texte facultatif.
- Consultation plein écran, fermeture et passage à la suivante.
- Visibilité pendant 24 heures, expiration contrôlée par le serveur, y compris pour l’accès au média.
- Respect du profil privé et des mineurs ; aucune exposition de l’historique des lieux.
- Suppression possible par l’auteur avant expiration.

Pas de messagerie, de live ni de compteur d’audience inventé. Le stockage et le nettoyage des médias expirés devront être traités avant activation, surtout avec le budget gratuit. Cette proposition remplace l’ancienne exclusion des stories uniquement si leur intégration est retenue ; aucune fonction story n’est livrée dans ce changement.

## Résultats

Lint et build réussis. Suite serveur : 21/21 groupes ; suite complète avec navigateur : 36/36 groupes, incluant les groupes serveur. Test de lecture effectué sur Chromium mobile simulé ; Safari et Windows restent à essayer sur les appareils de présentation.

## Vérification reproductible

`npm run lint`, `npm run build`, `npm test`, puis `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` dans l’environnement de test.

Le test serveur contrôle notamment quatre médias acceptés, cinq refusés, doublons refusés, propriété et confidentialité. Le test navigateur importe trois images et une vidéo, vérifie la limite, publie, lit réellement la vidéo et recharge la page. `tests/fixtures/blue-demo.mp4` est une mire bleue synthétique d’une seconde créée avec FFmpeg, sans son ni données personnelles.
