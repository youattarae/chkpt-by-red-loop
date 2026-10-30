# Recherche, Sortir, relations et classement

Décisions utilisateur du 30 octobre 2026, après clarification. Ces choix remplacent l’ancienne recherche détaillée de lieux dans Sortir.

## Accueil : rechercher dans CHKPT

Le champ, **Rechercher** et **Filtres** sont côte à côte. Les suggestions apparaissent pendant la saisie ; Rechercher ou Entrée ouvre une page de résultats. Ses filtres permettent aussi de trier par pertinence ou nom. Retour conserve le contexte. La barre de recherche réunit les profils, établissements, événements et publications accessibles. Les filtres **Tout / Profils / Établissements / Événements / Publications** permettent ensuite de séparer les résultats.

- Toucher un profil ouvre son profil ; toucher un établissement ouvre sa fiche.
- Toucher un événement ouvre sa fiche avec description, date, lieu et intentions « Ça m’intéresse » / « J’y serai ».
- Les publications sont celles que le compte est déjà autorisé à consulter ; la recherche ne rend aucun contenu privé public.
- La recherche de profils nécessite une connexion. Les profils privés et mineurs des autres sont exclus. Un propriétaire peut retrouver son propre profil.
- La recherche ignore les accents et la casse. Elle concerne les données du prototype, pas l’ensemble des établissements ou événements réels d’Abidjan.

## Carte : rechercher des lieux

La recherche locale, les puces de catégories et la carte sont conservées. Le bouton **Filtres** ouvre un panneau qui regroupe les filtres de catégorie et distance déplacés depuis Sortir : bars, restaurants, clubs, maquis, cafés et culture ; rayons de 1, 5, 10 et 20 km.

Les distances sont à vol d’oiseau. En simulation, elles utilisent la position choisie ; en GPS réel, un rayon attend une position réellement disponible. Il n’y a pas de club fictif ajouté pour remplir artificiellement ce résultat.

**Recherche intelligente de lieux** est un volet facultatif sur Carte. Il utilise le service externe déjà prévu dans le code. Sans configuration ou sans réseau, un message l’indique et la recherche locale reste utilisable. Aucun abonnement ni service payant n’est créé par cette modification. Aucun résultat externe n’est présenté comme lieu certifié CHKPT.

## Sortir : éditorial et événements

Sortir conserve l’agenda, les sélections de rooftops/cocktails et de maquis/braisé. Sa petite barre cherche **dans ce contenu uniquement** : titres, descriptions, lieux, communes et rubriques. Elle ne lance pas la recherche externe.

Le classement a été retiré de Sortir : il se trouve uniquement dans le menu personnel ☰.

## Classement mensuel uniquement

Après **☰ → Classement des explorateurs** : deux onglets **Amis** et **Global**. La dernière décision retire les deux colonnes mois/total : la liste montre uniquement les **XP du mois**.

- Amis = vous + les suivis réciproques accessibles. Un abonnement à sens unique ne suffit pas.
- Global = profils adultes publics accessibles + votre propre compte. Les autres profils privés/mineurs et les comptes opérateurs ne sont pas exposés.
- Les XP mensuels sont calculés côté serveur à partir des entrées positives `CHECKIN_VERIFIED` du PointsLedger du mois courant, selon le mois calendaire d’Abidjan. Les autres mois, les dates futures et les paliers de badge sans XP ne comptent pas. Une entrée identique n’est pas comptée deux fois.
- Tri décroissant des XP mensuels ; en cas d’égalité, identifiants par ordre alphabétique. Limite de 100 profils pour le prototype.
- Aucun lieu visité, trajet, preuve GPS ni détail du registre n’est envoyé avec le classement.
- Le **total des XP** reste visible uniquement par le propriétaire du compte. Les autres personnes peuvent voir les badges, pas ce total. Le profil privé d’autrui ne dévoile pas ce total.
- Les anciens totaux fictifs de départ ne sont pas artificiellement répartis dans le mois : seules les visites figurant dans le registre du mois donnent le score mensuel. Le classement reste une démonstration, pas une compétition avec des utilisateurs réels.

## Abonnés et abonnements

Sur votre profil et les profils publics accessibles, toucher le compteur **Abonnés** ou **Abonnements** ouvre une page de liste avec sa propre barre de recherche. Toucher une personne ouvre son profil ; Retour retrouve la liste.

La liste repose sur les relations effectivement enregistrées. Les centaines d’abonnés fictifs indiqués dans certains compteurs initiaux ne sont pas transformés en faux profils. Les profils privés/mineurs d’autrui restent masqués et les listes d’un profil privé sont réservées à leur propriétaire.

## Navigation active

Accueil, Carte, Sortir et Profil gardent leur changement de couleur et affichent un petit **point bordeaux sous l’icône** lorsque l’onglet est actif. Check-in reste une action centrale et ne devient pas un onglet de navigation supplémentaire.

## Pour essayer

1. Accueil → écrire « Ingrid », puis Rechercher ; Filtres → Profils → Appliquer. Recommencer avec « Étoile » ou « Nuit Urbaine » pour ouvrir les fiches.
2. Carte → Filtres → catégorie et distance → Appliquer. Ouvrir aussi Recherche intelligente : l’absence du service externe doit être indiquée sans bloquer la carte.
3. Sortir → chercher un titre de rubrique ou d’événement, puis Rechercher. ☰ → Classement des explorateurs → Amis ou Global.
4. Profil → toucher Abonnés ou Abonnements ; ouvrir un autre profil depuis la liste.

Les essais automatisés utilisent des comptes fictifs, des bases temporaires et des positions explicitement simulées.

## Captures et vérification

Voir [le lot pages et menu](NAVIGATION_PAGES_ET_MENU.md) pour les captures et la validation actualisée. L’ancienne recette de recherche instantanée a été adaptée aux pages et panneaux retenus. Les contrôles serveur de confidentialité, de mois et de suivi réciproque restent en place.
