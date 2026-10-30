# Analyse des références d’écrans — 30 octobre 2026

Analyse de quatre captures fournies dans `Archive.zip`. Les captures sont des références visuelles : leurs textes, personnes, images et fonctionnalités ne sont pas des instructions à importer dans CHKPT. Aucun écran de l’application n’est modifié par cette analyse.

## Lecture des quatre captures

| Capture | Ce qu’elle montre | Ce que CHKPT peut en retenir |
|---|---|---|
| IMG_3980.PNG | Profil personnel : couverture, avatar en chevauchement, identité, bio, compteurs, deux actions, onglets puis publications. | Une hiérarchie continue. Les publications arrivent après les informations utiles, sans plusieurs grandes cartes intermédiaires. Les actions du propriétaire diffèrent de celles d’un visiteur. |
| IMG_3982.PNG | Profil d’une autre personne : même structure, action Suivre dominante, petits boutons secondaires et Retour sur la couverture. | Utiliser un même gabarit pour son profil et celui d’autrui ; adapter les actions et les permissions. L’auteur et ses publications restent les premiers éléments à comprendre. |
| IMG_3981.PNG | Menu latéral : identité en haut, compteurs, lignes icône + texte, réglages et assistance séparés plus bas. | Regrouper les accès secondaires. Utiliser des lignes faciles à toucher et une séparation nette entre navigation personnelle et réglages. Le menu latéral a été confirmé après cette analyse. |
| IMG_3984.PNG | Menu avec identité, raccourcis horizontaux, rubriques, bouton Voir plus et groupes dépliables. | Une hiérarchie de rubriques et des réglages repliables. Les raccourcis illustrés et la multiplication des groupes prennent beaucoup de place : leur utilité pour le prototype reste à démontrer. |

Les quatre captures mesurent 1170 × 2532 pixels. Les repères de taille ci-dessous sont des propositions pour une interface mobile, pas des mesures CSS certifiées des applications photographiées.

## Ce qui explique la lisibilité de ces références

1. **Une colonne principale alignée.** Avatar, nom, bio, compteurs et publications suivent des repères visuels cohérents.
2. **Des groupes, puis de l’espace.** Les espaces séparent les informations ; chaque ligne n’est pas enfermée dans une carte.
3. **Une action prioritaire.** Suivre est immédiatement identifiable sur le profil d’autrui. Les autres commandes sont plus discrètes.
4. **Une navigation prévisible.** Retour est en haut à gauche ; les grandes destinations restent repérables en bas.
5. **Des zones tactiles larges.** L’icône peut être petite, mais le bouton qui l’entoure est facile à toucher.
6. **Des fonctions sociales proches de l’identité.** Les compteurs d’abonnés et d’abonnements se lisent ensemble et permettent d’ouvrir leurs listes.

## Application recommandée au profil CHKPT

Ordre proposé :

- En-tête de page clair avec Retour sur un profil ouvert depuis un autre écran.
- Avatar, anneau de story et + sur son propre profil.
- Nom, identifiant, bio et commune ; état privé si nécessaire.
- Abonnés et abonnements côte à côte, chacun ouvrant sa page.
- Actions adaptées : gestion de son profil ; Suivre / Ne plus suivre pour un autre profil accessible.
- Checks, badges et total des XP présentés de manière compacte.
- Onglets existants Publications / Lieux enregistrés / Badges, puis contenu.

**Point principal à corriger dans la version actuelle :** historique, récompense fictive et progression occupent plusieurs blocs avant les onglets de publications. Ils rendent le profil plus proche d’un tableau de bord. Je recommande de rendre ces accès secondaires plus compacts ou de les déplacer dans un espace personnel, sans supprimer leurs fonctions ni ouvrir l’historique aux visiteurs.

La variante compacte a été retenue par le porteur :

- **Profil compact** : identité et publications accessibles rapidement ; moins de hauteur avant le contenu.
- **Profil avec couverture** : photo large et avatar en chevauchement comme les références ; identité plus expressive, mais davantage de hauteur avant les publications.

Décisions confirmées ensuite : profil compact et menu latéral pour les accès personnels. Le classement sera uniquement dans ce menu. Les XP totaux sont réservés au propriétaire ; les autres voient les badges.

## Boutons et espaces : base de travail proposée

| Élément | Repère proposé |
|---|---|
| Marges latérales mobiles | 16 px, réduites seulement si un contenu le justifie |
| Petits espacements | 8 px |
| Espaces entre éléments d’un groupe | 12 à 16 px |
| Espaces entre sections | 24 px |
| Hauteur des boutons principaux et champs | 44 à 48 px minimum |
| Zone tactile des boutons d’icône | 44 × 44 px minimum ; pictogramme de 20 à 24 px |
| Lignes des listes et menus | Environ 56 à 64 px, ajustées au contenu |
| Avatar de profil | Environ 80 à 88 px |
| Avatar dans une liste | Environ 40 à 48 px |
| Texte courant | 14 à 16 px pour éviter les paragraphes trop petits |
| Métadonnées | Environ 12 à 13 px |
| Titre de profil | Environ 22 à 24 px |

Les tailles doivent rester adaptées de 320 px à l’ordinateur. Le clavier du téléphone, les noms longs et la zone de sécurité du bas doivent être testés. Les cartes et grands arrondis restent utiles pour un contenu illustré, mais ne sont pas nécessaires autour de chaque information textuelle.

Couleurs CHKPT conservées : bleu pour l’action principale, bordeaux pour le repère actif convenu, bleu nuit/noir pour les textes, fonds blancs et gris très légers. Une icône indique une action, pas seulement une décoration. Les actions secondaires utilisent un contour ou un fond discret.

Le bouton central avec le symbole CHKPT reste l’unique entrée du check-in. Le + des stories conserve son rôle précis ; le bouton flottant de création présent dans les références n’est pas ajouté automatiquement.

## Recherche : appliquer les précisions déjà données

Disposition souhaitée : **champ de saisie + bouton Rechercher + bouton Filtres à côté**. Sur les petites largeurs, la loupe peut représenter le bouton Rechercher avec un libellé accessible ; les deux actions doivent rester faciles à toucher.

| Situation | Comportement convenu |
|---|---|
| Pendant la saisie | Suggestions courtes dans un panneau ancré sous la barre, sans ouvrir un grand écran de résultats. |
| Toucher une suggestion | Ouvrir directement la page du profil, de l’établissement ou de l’événement. |
| Toucher Rechercher ou valider au clavier | Ouvrir une page dédiée de résultats. |
| Ouvrir Filtres | Déplier un panneau refermable ; conserver la saisie. |
| Depuis les résultats | Retrouver la recherche et les filtres pour affiner. |
| Retour | Retrouver la page précédente, la recherche, les filtres et le défilement. |

Pour le prototype, « prédire » signifie suggérer des contenus existants correspondant au texte saisi. Cela n’exige ni une nouvelle IA payante ni une recherche externe permanente.

Les périmètres restent ceux validés : Accueil général ; Carte pour les lieux et la recherche intelligente facultative ; Sortir pour son contenu éditorial.

## Pages et panneaux : distinction à conserver

**Pages dédiées avec Retour :** résultats de recherche, fiches établissement, fiches événement, profil d’une autre personne, abonnés, abonnements et classement des explorateurs.

**Panneaux temporaires :** suggestions de saisie et filtres rétractables. Le menu latéral, s’il est retenu, sera aussi une surface temporaire de navigation ; il n’implique pas de remettre les fiches dans des fenêtres.

Les abonnés et abonnements auront leur propre recherche dans la liste. Le classement conservera ses deux onglets Amis / Global et les XP du mois uniquement. Les suivis réciproques définissent Amis ; les totaux restent visibles uniquement par leur propriétaire.

Pour éviter les écrans empilés difficiles à fermer, la future navigation doit gérer un véritable historique : Résultats → établissement → Retour ramène aux mêmes résultats, et non systématiquement à l’accueil. Le bouton Retour du navigateur doit suivre le même parcours. Les nouveaux écrans doivent rester compatibles avec les liens directs de lieux déjà partagés.

## Menu latéral retenu : contenu à implémenter

Si retenu, garder les cinq destinations du bas. Le menu latéral peut regrouper les accès personnels secondaires : lieux enregistrés, historique privé, badges/progression et réglages. L’aide ne doit apparaître comme action que si elle ouvre un contenu utile. Les outils opérateur et la sauvegarde restent réservés aux personnes autorisées.

Le menu doit se fermer en touchant l’extérieur ou sa commande de fermeture. Les réglages peuvent se déplier à l’intérieur. Les changements de compte, messageries, certifications, communautés et autres rubriques visibles dans les captures ne sont pas ajoutés par simple imitation.

## État réel du code inspecté

Cette analyse part de la branche `feat/profil-social`, après le commit `d15fc3d`.

Déjà présents : recherche générale, filtres par type, événements, profils accessibles, relations réelles protégées, classement mensuel et point bordeaux.

**Restent à appliquer :** les clarifications ultérieures sur la navigation. Les résultats s’affichent encore pendant la saisie dans l’accueil ; les abonnés/abonnements et le classement utilisent encore des fenêtres de dialogue ; la fiche événement est aussi une fenêtre. La fiche établissement et le profil d’autrui occupent déjà une grande surface, mais sont encore gérés comme des superpositions plutôt que comme des pages avec un historique de navigation complet.

Le passage aux pages dédiées est donc une vraie modification du parcours à réaliser et vérifier ; un simple changement de taille ou de nom ne suffira pas.

## Ordre de mise en œuvre recommandé après cette revue

1. Mettre en place la navigation des pages et la conservation du contexte au Retour, en préservant les liens partagés.
2. Séparer suggestions, validation de recherche et page de résultats ; rendre le panneau Filtres commun aux deux situations.
3. Transformer relations, classement, établissements, événements et profils d’autrui en pages.
4. Ajuster le profil et, selon le choix confirmé, le menu latéral.
5. Harmoniser espaces, tailles de boutons et états actifs.
6. Vérifier téléphone et ordinateur : clavier ouvert, textes longs, défilement, Retour navigateur, confidentialité et parcours check-in complet.

Aucune modification fonctionnelle, aucun changement de données et aucune fusion ne sont effectués par ce document.
