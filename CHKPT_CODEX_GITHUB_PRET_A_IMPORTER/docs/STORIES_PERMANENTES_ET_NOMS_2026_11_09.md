# Présentation : stories permanentes et noms des profils

Décision utilisateur du 9 novembre, postérieure au correctif Stories/DM du même jour.

## Ce qui change

Les trois exemples de stories fictives sont permanents dans la démo privée. Ils sont disponibles automatiquement au lancement et à la consultation, y compris lorsque leur ancienne date d’expiration est passée. Un exemple absent est rétabli sans cliquer sur Préparer ni Démarrer la démo. Les identifiants et médias existants sont réutilisés : pas de renouvellement artificiel de date, pas de duplication à chaque consultation.

L’interface et les cartes de partage indiquent « Exemple permanent · démo privée ». Les exemples restent identifiés comme fictifs ; ils ne rapportent ni visite ni XP. Leur suppression est désactivée dans cette présentation. Le bouton Préparer reste un outil de réparation facultatif.

Cette exception est limitée aux exemples créés par le serveur, portant leurs trois identifiants réservés. Les stories personnelles gardent leur durée de 24 h et leur suppression habituelle. Envoyer `isDemo` ou `persistentDemo` depuis le navigateur ne rend pas une story personnelle permanente. Hors démo privée, les exemples sont masqués et leurs médias protégés. Les permissions, blocages et profils privés/mineurs restent contrôlés. Les limites de stockage et la confidentialité d’un auteur continuent de s’appliquer.

## Noms confirmés

- Compte superviseur `usr_admin` : **Ingrid N’Goan**.
- Ancien profil fictif Ingrid, `usr_sarah` : **Bintou Essehi**.

Les identifiants de connexion, mots de passe, rôles, identifiants des comptes, médias, abonnements, publications, XP et badges restent conservés. Les noms d’auteur dans les publications et les stories suivent les comptes renommés ; les textes personnels des publications/messages ne sont pas réécrits. Les anciens identifiants de connexion restent utilisables. Aucune remise à zéro n’est nécessaire.

## Vérification

La nouvelle suite `tests/permanent_demo_stories.test.ts` simule une ancienne base : exemples dont l’échéance est dépassée de sept jours, noms historiques, story personnelle et publication à conserver. Elle vérifie la migration, l’accès aux médias et cartes permanentes, l’expiration personnelle, le refus d’un indicateur permanent envoyé par le client, la réparation d’un exemple manquant, l’idempotence et le refus hors démo privée.

Le test navigateur du superviseur vérifie l’apparition des photos sans préparation manuelle et avance l’horloge du navigateur de trois jours avec une story ouverte. Les tests historiques sont conservés, avec les noms et la durée des seuls exemples adaptés à cette nouvelle décision.

Après installation de ce code, laisser la démo privée activée et ouvrir l’Accueil : les exemples sont prêts. Il n’est pas nécessaire de réinitialiser la base avant la présentation.

Résultat : **55/55 groupes réussis**, TypeScript et build réussis. [Recette complète](verification-2026-11-09/recette-55-stories-permanentes.txt). [Capture après trois jours simulés](captures/2026-11-09/story-permanente-apres-trois-jours-390.png). Tests exclusivement sur bases temporaires, aucune base personnelle réinitialisée.
