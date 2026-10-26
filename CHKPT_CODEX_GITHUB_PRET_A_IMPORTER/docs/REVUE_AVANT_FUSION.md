# Revue avant fusion — 26 octobre 2026

Périmètre : changements des lots A à D, accès de démonstration, persistance locale, sessions,
cycle connexion → démarrage → carte → fiche → check-in → badge → publication → profil → événement → répétition.
Cette revue ne vaut pas audit de production ni validation du marché.

La première recette était passée sur son parcours principal. Une seconde lecture a identifié et corrigé :

- **Connexion lente :** annulation et rejet des réponses d'une session précédente, pour éviter qu'un ancien profil remplace le nouveau.
  Test avec une réponse administrateur volontairement retenue pendant la bascule vers Sarah.
- **Points après connexion lente :** une réponse de profil antérieure à un check-in ne peut plus effacer le nouveau gain.
  Le test retient un profil à 1240 XP, valide la visite, puis libère cette réponse et vérifie que 1315 XP restent affichés.
- **GPS en attente :** aucun envoi de coordonnées simulées comme si elles venaient du téléphone. Le message demande d'attendre
  ou de choisir explicitement le simulateur. Test de position volontairement non fournie, sans appel de check-in au serveur.
- **Petit écran :** panneau de compte défilant, boutons accessibles à 320 × 568 pixels.
- **Fil Amis :** filtrage sur les comptes réellement suivis dans la base fictive, transmis par le serveur.
- **Base illisible :** arrêt du démarrage et préservation du fichier existant, au lieu d'un remplacement silencieux.
  Essais avec JSON cassé et tables manquantes ; contenu du fichier inchangé après échec.
- **Session mal formée :** date d'expiration invalide désormais refusée et session révoquée.

Résultats locaux : typage, compilation et 18 groupes de contrôles réussis, incluant les 11 tests historiques.
Le scénario complet a été rejoué à 390 et 1280 pixels, deux fois après démarrage opérateur,
avec appels externes bloqués et une illustration manquante remplacée. La base de présentation n'a pas été utilisée par les tests.
La recette produit également les captures carte, fiche et rédaction de publication pour la démonstration en PDF.
Le rendu du PDF de huit pages est contrôlé ; il ne nécessite pas de lire du code pour suivre les étapes.

Restent des limites explicites : publications/badges/intentions locaux au navigateur, carte et GPS de présentation simulés,
données fictives, médias importés en mémoire, Gemini externe non validé. Aucun hébergement public ni programme de production.
Le sous-ensemble montré est utilisable pour une répétition privée ; une répétition humaine sur l'appareil du présentateur reste nécessaire.

La fusion doit porter sur le dernier commit relu après réussite des contrôles GitHub correspondants.
