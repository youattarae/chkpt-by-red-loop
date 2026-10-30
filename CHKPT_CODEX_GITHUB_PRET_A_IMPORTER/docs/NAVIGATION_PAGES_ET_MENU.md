# CHKPT — pages, recherche et menu personnel

Mise à jour du 30 octobre 2026. Lot préparé localement sur la branche `feat/profil-social`, sans fusion ni déploiement. Le prototype existant est conservé. Le [bilan complet](BILAN_PROTOTYPE.md) récapitule aussi les lots précédents.

## Ce qui change à l’écran

| Élément | Fonctionnement retenu |
|---|---|
| Recherche | Champ, bouton **Rechercher**, bouton **Filtres** côte à côte. |
| Pendant la saisie | Quelques suggestions sous le champ ; toucher une suggestion ouvre la fiche ou le profil. Les suggestions reposent sur les données de la démo. |
| Après Rechercher | Une vraie page de résultats, avec la requête et ses filtres, puis ouverture des fiches depuis cette page. La touche Entrée fonctionne aussi. |
| Filtres | Panneau rétractable avec Appliquer, Réinitialiser et Fermer. Disponible avant la recherche et sur les résultats ; tri par pertinence ou nom. |
| Fiches | Établissement, événement et profil d’autrui s’ouvrent dans des pages. **Retour** et le retour du navigateur retrouvent le contexte précédent. |
| Abonnés / abonnements | Pages ouvertes depuis les compteurs ; chacune possède sa propre recherche. Les listes représentent les relations enregistrées, pas les centaines de compteurs fictifs initiaux. |
| Mon profil | Présentation compacte, compteurs, total XP personnel discret, puis publications. La photo conserve les stories ; un bouton distinct ouvre le menu. |
| Menu ☰ | Compte, enregistrés, historique privé, badges et progression, récompenses fictives, classement, aide et réglages/confidentialité. Il appartient toujours au compte connecté, même sur le profil de quelqu’un d’autre. |
| Classement | Accessible seulement dans le menu. Onglets **Amis / Global**, XP du mois. Amis = suivis réciproques et soi. |
| Navigation du bas | Les cinq boutons restent en place. L’onglet actif change de couleur et porte son petit point bordeaux. |

**Accueil** recherche les profils, établissements, événements et publications accessibles. **Carte** conserve catégories, distances, radar et recherche externe facultative. **Sortir** reste éditorial : sa recherche porte uniquement sur ses événements et sélections de maquis/rooftops ; aucun classement n’y reste.

Les publicités fictives et leurs emplacements, les quatre personnages, leurs vingt publications, les avis, les stories et le parcours central de check-in restent en place.

## Pour essayer sans lire de code

1. Dans Accueil, écrire **Ingrid** : les propositions apparaissent sous la barre. Appuyer sur **Rechercher** pour afficher la page de résultats.
2. Toucher **Filtres**, choisir **Profils**, puis **Appliquer les filtres**. Ouvrir Ingrid : bio, publications et badges sont visibles ; ses XP totaux et visites ne le sont pas.
3. Toucher **Abonnés** ou **Abonnements**. Rechercher un nom dans la liste. Ouvrir une personne, puis utiliser **Retour** deux fois : on retrouve la liste, puis le profil.
4. Revenir aux résultats : la requête et le filtre sont conservés. Le bouton de retour du navigateur fonctionne aussi.
5. Chercher **Étoile**, ouvrir le maquis : grande fiche, galerie, favoris, partage et avis. Le check reste uniquement au bouton central.
6. Ouvrir **☰** pendant la consultation du profil d’Ingrid : le menu affiche votre propre compte. Ouvrir Historique privé ou Enregistrés, puis revenir.
7. Ouvrir **☰ → Classement des explorateurs**, passer d’Amis à Global. Ouvrir un profil puis revenir : l’onglet choisi est conservé.
8. Ouvrir votre profil : les publications arrivent immédiatement après sa présentation, sans les anciens gros blocs de récompense et d’historique.
9. Dans Carte, appliquer une catégorie et une distance avec Filtres. Dans Sortir, rechercher un événement : ce sont deux périmètres distincts.
10. Faire défiler le fil, ouvrir un profil puis revenir : le défilement est retrouvé.

## Captures réelles du prototype

Ces captures proviennent d’une base temporaire fictive, avec les visuels générés déjà intégrés. Elles ne représentent pas des utilisateurs ou des lieux réels.

- [Profil compact de Yacoub](captures/navigation-pages/profil-compact-yacoub-390.png)
- [Menu personnel séparé de l’avatar](captures/navigation-pages/menu-personnel-yacoub-390.png)
- [Suggestions pendant la saisie](captures/navigation-pages/suggestions-390.png)
- [Filtres rétractables](captures/navigation-pages/filtres-retractables-390.png)
- [Page de résultats](captures/navigation-pages/resultats-profils-390.png)
- [Profil d’Ingrid vu par un autre compte](captures/navigation-pages/profil-visiteur-ingrid-390.png)
- [Page des abonnés et sa recherche](captures/navigation-pages/abonnes-page-390.png)
- [Fiche établissement en page](captures/navigation-pages/fiche-lieu-page-390.png)
- [Fiche événement en page](captures/navigation-pages/fiche-evenement-page-390.png)
- [Classement mensuel en page](captures/navigation-pages/classement-page-390.png)

## Confidentialité et conservation

- Les XP totaux, le journal XP et l’historique restent personnels. Les autres profils montrent seulement leurs badges publics et contenus autorisés.
- Les droits serveur ne changent pas : profils privés/mineurs, médias, listes protégées et outils opérateur restent contrôlés.
- Le changement de compte vide les anciennes pages personnelles conservées en mémoire. Le retour vers une ancienne page personnelle d’un autre compte revient à l’accueil ; il ne réutilise pas ses données.
- Aucun jeton de session ni coordonnée GPS de preuve n’est ajouté aux liens de navigation. Le lien de partage d’une fiche reste compatible avec `#lieu=…`.
- Les pages conservées retrouvent la saisie, les filtres, le défilement et, si possible, l’élément précédemment utilisé. Les listes de relations et les profils sont relus à leur réouverture pour ne pas rester figés après un suivi modifié.
- Aucune migration de base ni remise à zéro n’est nécessaire pour ces changements de navigation. Préserver `.env` et `.data` lors d’un remplacement local du code.

## Vérifications

**Lint et build réussis ; suite complète : 43/43 groupes réussis**, dont la suite historique de 11 tests comprise dans le total. Essais de navigation à 320, 390 et 1280 px ; profil compact et thèmes, retour navigateur/défilement, changement de compte, profil personnel depuis la recherche et sortie de console opérateur vérifiés. Les essais utilisent des bases et comptes temporaires ; aucune donnée de présentation n’est effacée.

Commandes exécutées : `npm run lint`, `npm run build`, `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser`. Les tests de l’ancienne disposition ont été adaptés aux pages : leurs sélecteurs ciblent l’écran visible pour distinguer le fil du profil conservé en arrière-plan. Les contrôles métier et de confidentialité sont conservés, sans allongement des délais.

Les scénarios couvrent notamment la recherche validée et ses suggestions, les filtres rétractables, les pages sans fenêtre superposée, le retour navigateur et le défilement, le menu personnel sur le profil d’autrui, les recherches des relations, le classement mensuel, le profil compact, les interactions, les stories et les refus d’accès.

## Limites explicites

- La conservation détaillée concerne les quarante dernières pages de la session. Après rechargement, la page et les filtres présents dans le lien sont retrouvés ; les brouillons de recherche interne aux listes ne sont pas une sauvegarde serveur.
- Les écrans d’action (connexion, confirmation du check, réglages, ajout/lecture de story) restent temporaires ; les écrans de consultation demandés deviennent des pages.
- La recherche est celle du catalogue fictif et des contenus accessibles. Elle n’est pas un moteur exhaustif des lieux réels d’Abidjan.
- Le GPS navigateur peut être simulé ; le prototype ne constitue pas une preuve antifraude de production. Les récompenses et intentions d’événement restent des démonstrations sans avantage ni réservation réels.
- Le dépôt a été constaté **Public** ; le nouveau lot reste local jusqu’à confirmation de son passage en privé. Aucun hébergement gratuit persistant n’a été créé et aucun abonnement n’a été souscrit.

## Repères techniques pour la reprise

`src/navigation/Navigation.tsx` gère les routes, l’historique et le défilement sans nouvelle dépendance. Les routes restent dans le fragment du lien, avec compatibilité des anciens liens de lieux. Les écrans visités sont conservés sous des conteneurs masqués, bornés en nombre, puis invalidés au changement de session.

`SearchExperience.tsx` partage la barre, les suggestions et la page de résultats entre les trois périmètres. Les appels de profils sont authentifiés, différés brièvement, annulés à la nouvelle requête et associés à la session. Les distances attendent une position disponible et ne deviennent jamais des itinéraires.

`SideMenu.tsx`, `PageLayout.tsx` et `PersonalPage.tsx` complètent les composants existants. Les noms historiques de fichiers `PlaceDetailModal`, `EventDialog` ou `ConnectionsDialog` sont conservés pour limiter les changements ; leur rendu de consultation est bien celui d’une page, pas d’un dialogue fixe.
