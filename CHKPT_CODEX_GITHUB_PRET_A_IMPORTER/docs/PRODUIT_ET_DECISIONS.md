# CHKPT — le projet raconté simplement

> Mise à jour visuelle du 27 octobre 2026 : interface blanche par défaut, mode sombre facultatif, nom CHKPT seul dans l'interface, slogan réservé à la communication et symbole comme bouton central de check-in. Cette décision utilisateur remplace les indications historiques incompatibles. Voir [la direction visuelle](DIRECTION_VISUELLE_2026_10.md).

## C'est quoi ?
CHKPT (prononcé « checkpoint ») est une application de sorties et de découverte qui mélange réseau social, carte de lieux et progression ludique. Une personne à Abidjan trouve une bonne adresse, la visite, confirme un check-in, peut partager son expérience et débloquer des badges.

**CHKPT** est la marque visible par le grand public. **RED LOOP** est le projet/écosystème porteur et constitue l'héritage de la conception initiale. Ne pas remplacer automatiquement les écrans CHKPT par l'ancien branding bordeaux de RED LOOP.

**Signature CHKPT :** « Sors. Check. Partage. » ; référence commerciale RED LOOP historique : « Djo dans la boucle ».

## Pourquoi le prototype ?
- Présentation par Ingrid au programme FrancoTech de Cocody : montrer l'innovation locale et les adresses/événements de Cocody.
- Présentation à des partenaires ou investisseurs : expliquer le potentiel du réseau, la découverte d'établissements et le modèle économique envisagé.
- **Ne pas faire passer les comptes, visites, chiffres, lieux fictifs ou récompenses de démonstration pour des données réellement acquises.**

## Parcours de check-in actualisé

Le bouton central est le seul point d’entrée. La personne sélectionne un lieu, appuie sur Confirmer le check, puis peut créer une publication. Les publications, la carte et les fiches ne comportent pas de raccourci Check.

## Les cinq écrans-clés
1. **Accueil** : publications et découvertes ; onglets « Pour toi » et « Amis ».
2. **Carte** : lieux et événements, recherche et filtres, repères de lieux vérifiés (vert) / non vérifiés (gris) ; pas de publicité.
3. **Check-in** : vérifier la présence sur place, ou **simuler la visite avec une mention visible en présentation** ; seulement ensuite proposer une publication facultative.
4. **Sortir** : sélections, événements, rubriques et intentions « Ça m'intéresse » / « J'y serai ».
5. **Profil** : publications au cœur du profil, listes enregistrées, historiques choisis, badges et progression.

## Réseau social et progression
- Publications de texte, photos et vidéos courtes ; likes, commentaires, suivi, confidentialité.
- Check-in vérifié = XP ; publication seule ≠ preuve de visite.
- 8 familles de badges ; vision de 40 badges V1. Le prototype peut n'en montrer qu'une partie, ne pas prétendre le contraire.
- Mineurs 13–17 ans : profil privé par défaut.

## Publicité et économie future
- Bannières **non cliquables**, clairement étiquetées « Publicité ».
- Accueil : 1 bannière avant le fil puis toutes les 10 publications.
- Sortir : 1 bannière au début puis toutes les 3 rubriques, et au sein de chaque rubrique toutes les 3 cartes.
- Carte : aucune bannière.
- Pas de paiements, billetterie ou wallet in-app.
- Revenus futurs possibles : annonceurs, partenariats et abonnements établissements hors app ; ne pas promettre des contrats existants.

## Identité cible
- Ambiance « classy street / street chic premium » : jeune, urbaine, élégante.
- Palette : bleu nuit + bleu clair lumineux + bordeaux + noir + blanc ; symbolique passage/mouvement, sans épingle de carte comme logo.
- Conserver les logos officiels lorsqu'ils seront fournis et leurs proportions ; ne pas en réinventer un sans validation.

## Périmètre immédiat
Un prototype **web responsive**, utilisable sur ordinateur et téléphone, avec scénario réinitialisable, données fictives et parcours fluide. Ce n'est ni un produit à grande échelle ni une application native installable via les stores.

## Hors de cette phase
React Native, PostgreSQL, architecture de production, paiements, moteur complet de 40 badges, 130 écrans finis, messagerie, check-ins collaboratifs, annonces cliquables, pages de villes, couche bancaire/services publics.

## Règle de priorité
Si deux documents divergent, donner priorité aux décisions CHKPT les plus récentes et au `AGENTS.md`, puis utiliser `docs/PASSATION_V3_SOURCE.md` comme référence historique ; **le code joint est à inspecter, pas à supposer correct**.
