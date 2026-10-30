# Revue de cohérence, sécurité et fluidité — 30 octobre 2026

Cette revue confronte le code aux dernières décisions du porteur, pas seulement aux anciens tests. Elle distingue les corrections réalisées, les décisions encore non implémentées et les limites du prototype. Ce n’est pas une certification de sécurité ni un constat de préparation à la production.

## Résultat principal

Les fonctionnalités existantes sont testées, mais plusieurs choix de navigation validés ne sont pas encore codés. Un lot de navigation reste nécessaire avant de considérer l’expérience finale comme conforme. En parallèle, les écarts de confidentialité et de protection du code repérés ci-dessous ont été corrigés localement.

## Priorité externe : dépôt GitHub public

Le dépôt `youattarae/chkpt-by-red-loop` affiche **Public** lors de cette revue. Un accès privé à la démo n’empêche donc pas la lecture du code source sur GitHub.

L’API GitHub de cet environnement répond **Forbidden** pour ce dépôt ; le changement de visibilité ne peut pas être exécuté depuis cet accès. Le propriétaire doit ouvrir Settings → General → Danger Zone → Change repository visibility → Make private.

La publication de ce nouveau lot est suspendue tant que cette visibilité reste publique. Les changements sont préparés et vérifiés localement. Passer en privé ne permet pas d’effacer des copies éventuellement déjà faites.

## Corrections effectuées

| Constat | Correction et limite |
|---|---|
| Les XP totaux étaient encore envoyés au visiteur d’un profil public. | Retrait de la réponse destinée aux autres comptes et de l’écran du profil d’autrui. Le propriétaire conserve son total ; le classement autorisé expose uniquement les XP du mois. |
| Les badges n’avaient pas leur présentation publique propre. | Résumés limités aux badges débloqués : identifiant, nom, famille, palier et pictogramme ; pas de XP, seuil, compteur, preuve ni lieu. Lecture sans déblocage ni écriture à la simple consultation du profil. |
| Un ancien classement chiffré en dur subsistait dans Badges, avec XP totaux et positions inventées. | Suppression de cet ancien bloc. Le moteur mensuel existant reste la seule source du classement. Son déplacement de Sortir vers le menu reste à réaliser. |
| L’authentification acceptait encore un jeton dans l’URL. | Retrait de ce mécanisme historique. Les appels de l’application utilisent l’en-tête Authorization. |
| Un serveur de développement pourrait exposer davantage de code. | Démarrage distant refusé sans mode production. `npm start` utilise l’entrée de présentation compilée, comme la démo. |
| La confidentialité du build reposait sur des valeurs par défaut. | Minification explicite, cartes de débogage désactivées, chemins de sources/fichiers privés refusés en production. Les fichiers compilés nécessaires à l’interface restent forcément téléchargeables par un utilisateur autorisé. |
| Certaines réponses donnaient trop de détails techniques. | Suppression de l’identification du framework, des en-têtes propriétaires de médias et des identifiants d’auteur dans les refus de médias ; erreurs JSON génériques, y compris les requêtes malformées ; erreur fournisseur de recherche non renvoyée telle quelle. |
| Un import pouvait être public avant la confirmation de publication. | Les imports sont privés au départ. Seule la publication/story validée applique la visibilité finale. Les anciens imports non liés sont aussi rendus privés au chargement de la base. |
| Réutiliser un média dans un autre contexte pouvait modifier la visibilité de son ancienne publication. | La réutilisation dans une audience différente est refusée ; il faut un nouvel import, sans casser les médias déjà publiés. |
| Un brouillon abandonné pouvait occuper inutilement le stockage. | Suppression propriétaire des médias non utilisés, nettoyage à la fermeture/retrait et refus de supprimer un média encore publié. C’est un nettoyage de meilleur effort : une coupure réseau peut encore laisser un import privé inutilisé. |
| Des réponses d’import tardives et brouillons pouvaient traverser un changement de compte. | Ignorer les retours d’import de l’ancienne session ; vider le brouillon d’accueil et fermer l’ancien check-in au changement de compte. |
| La limite de transport JSON était trop juste pour un fichier de 15 Mo encodé en base64. | Petite marge de transport ajoutée ; la vraie limite du fichier reste contrôlée sur les octets décodés côté serveur. |
| Une publicité d’alcool pourrait atteindre un mineur si le filtre était seulement visuel. | Filtre d’affichage et contrôle serveur sur l’image, conservée hors du répertoire public. Âge déclaré, sans prétendre à une vérification d’âge de production. |

## Écarts de navigation encore ouverts — prioritaires

1. **Menu latéral absent.** Il doit accueillir les accès personnels convenus : compte, enregistrés, historique privé, progression, récompenses, réglages, aide et classement. Il doit toujours représenter le compte connecté, même lorsqu’on consulte quelqu’un d’autre.
2. **Classement encore présent dans Sortir.** Le retirer une fois son nouvel accès opérationnel ; ne pas supprimer l’unique accès sans remplacement.
3. **Pages dédiées non réalisées.** Établissements, événements, profils d’autrui, abonnés, abonnements, classement et résultats ne sont pas encore tous gérés comme de vraies pages avec historique. Les agrandir ne remplace pas cette transformation.
4. **Retour incomplet.** Le navigateur ne possède pas encore une pile cohérente Résultats → fiche → Retour. La saisie, les filtres, le défilement et le bouton Retour du navigateur doivent être restaurés ensemble.
5. **Recherche encore instantanée dans la page d’accueil.** Séparer les suggestions de saisie de la validation par Rechercher, qui doit ouvrir la page de résultats. Boutons Rechercher et Filtres à côté du champ, filtres rétractables aussi accessibles sur les résultats.
6. **Listes de relations sans recherche propre.** Ajouter leur recherche interne lors du passage aux pages.
7. **Profil encore chargé.** Historique, récompense et progression repoussent les publications. La variante compacte a été choisie ; ces détails doivent rejoindre les accès personnels secondaires. La photo garde son rôle de story, le menu a son bouton distinct.

Ces éléments ne sont pas déclarés terminés, même si la suite des fonctionnalités actuelles passe.

## Autres limites et zones d’ombre à garder visibles

- Les compteurs initiaux de démonstration peuvent être supérieurs au nombre de relations effectivement enregistrées. Les listes n’inventent pas des centaines de faux comptes pour les remplir ; l’interface indique leur caractère fictif.
- Les publications, médias, favoris et visites sont synchronisés sur le même serveur. Certaines intentions d’événements et actions de récompense restent locales à l’appareil : ne pas les présenter comme un système complet multiappareil.
- Les anciens totaux fictifs ne sont pas artificiellement répartis dans les XP mensuels. Le classement reprend les entrées de visites du registre du mois, sans exposer les lieux visités.
- Le GPS d’un navigateur est une déclaration cliente : une personne technique peut simuler des coordonnées. Le contrôle de distance n’est pas une preuve antifraude certifiée. Aucun paiement ni vraie récompense ne doit dépendre de cette démonstration.
- Stockage des imports : 50 Mo partagés, 15 Mo par fichier. Quatre fichiers proches du maximum ne pourront pas tous entrer dans ce stockage. Le nettoyage de brouillons n’est pas une garantie de purge en cas de coupure réseau.
- Les vidéos ne sont pas converties ou débarrassées de leurs métadonnées. MP4 H.264 reste conseillé pour les appareils de présentation.
- Le disque d’un hébergement gratuit peut disparaître. La sauvegarde chiffrée reste manuelle et aucun hébergement distant n’est activé par ce lot.
- Le support PDF/HTML historique et les anciens guides illustrés ne représentent pas encore tous les nouveaux profils ni la future navigation par pages. Les nouvelles captures sont distinguées de ces supports.
- L’authentification actuelle utilise identifiant et mot de passe, pas un dispositif complet de récupération par e-mail.

## Protection contre la copie et le reverse engineering

Le code du navigateur et les visuels qu’il affiche ne peuvent pas être rendus impossibles à inspecter ou copier. La minification réduit la lisibilité ; elle ne remplace ni la confidentialité du dépôt ni les contrôles serveur.

Les mots de passe, clés, vérifications de rôles, écritures de points, permissions de médias, expiration des stories et sauvegardes doivent rester contrôlés côté serveur. Modifier le navigateur ne doit pas accorder un rôle opérateur ou permettre la lecture d’un historique tiers ; les tests de refus sont conservés.

Aucun blocage du clic droit, piège anti-outils développeur ni chiffrement cosmétique du JavaScript n’est ajouté : cela gênerait les utilisateurs et donnerait une fausse impression de protection.

## Vérifications réalisées

- TypeScript et compilation réussis.
- Audit npm des dépendances de runtime : 0 vulnérabilité signalée au moment du contrôle ; cela ne certifie pas la sécurité du code applicatif.
- Suite complète locale : **43/43 groupes**, dont 25 groupes serveur et la suite historique de 11 tests incluse, pas ajoutée deux fois.
- Après les dernières précisions, nouvelle exécution serveur : 25/25 groupes, et recette dédiée des quatre profils/publicités réussie.
- Contrôles positifs et négatifs : total de XP propriétaire uniquement, badges publics minimaux, historiques tiers refusés, imports privés, suppression d’imports non utilisés et refus pour les fichiers publiés, source/maps indisponibles, absence de secrets serveur dans les bundles, refus de démo distante en mode développement, média alcool refusé aux mineurs/visiteurs.
- Quatre profils visités comme un autre compte : cinq publications chacun, portraits décodés, absence de XP totaux, vingt publications conservées après migration et absence de doublons.
- Publicité en tête et après chaque cinq publications, cinq marques distinctes pour un majeur, absence d’actions cliquables et remplacement de l’alcool pour les mineurs.

Ces résultats portent sur l’environnement de test local. Aucun nouveau résultat GitHub n’est annoncé tant que le lot n’y est pas publié. Safari, Windows et la connexion de présentation demandent encore une répétition sur les appareils réels.
