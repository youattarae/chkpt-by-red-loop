# Mission intégrée — lots 0 à 8

Branche : `feat/ux-demo-lots-0-8`, base `de87f2f` (audit) et `6c4652a` (dernier code).
Aucun push, merge, déploiement ou reset de données personnelles autorisé/effectué.

## Lot 0

Branche dédiée créée sans perte de modifications ; AGENTS annoté avec les substitutions précises du 5 novembre. Timeout historique : clic de confirmation 1280 px ; réexécution isolée 390/1280 réussie à l'audit. Cause non démontrée ; aucun simple relèvement du délai. Les nouvelles recettes conserveront trace/erreurs et vérifieront la confirmation après modification des transitions. Migrations/sauvegardes et permissions restent des critères de non-régression, sans réinitialisation de la vraie base.

## Arbitrages de prototype

- Messages : majeurs publics, texte et référence de fiche ; pas de chiffrement de bout en bout, pas d'ouverture publique décidée.
- Partage : amis = relations réciproques admissibles pour cette démo ; pas de contacts privés/mineurs exposés.
- Barre basse conservée sur principaux et fiches ; masquée en conversation et éditeur pour le clavier.
- Brouillons par compte, conservés sur cet appareil avec références privées, sans médias en clair dans le stockage ; suppression explicite ou publication.
- Cadence Accueil cinq provisoire, pas de cadence Sortir ajoutée ; badges et XP inchangés.

## Socle additif et première intégration

Contrats d'entités lieu/événement ajoutés aux messages/posts ; collections distinctes de contenus enregistrés et d'activité, anciennes collections conservées. Migrations optionnelles compatibles avec anciennes sauvegardes. Jeux de conversations synthétiques ajoutés une seule fois en mode démo, sans remplacement des messages personnels. Contacts de partage filtrés serveur sur relations réciproques majeures publiques.

Vérification intermédiaire : `npm test` **25/25 groupes réussis**, suite historique de 11 comprise ; lint et build réussis. Nouvelle recette navigateur 320/390/1280 : navigation/profil, recherche, exploration, carte, partage, carte en DM et retour, brouillon/publication, article réussis. Les anciens scénarios navigateur sont en cours d'adaptation aux décisions explicites (aucun abaissement des droits serveur).

## Lots 1 à 7 — intégration fonctionnelle

Navigation flottante et en-têtes contextuels, profil par identité et retour, menu tactile gauche, compteurs distincts ; recherche remplaçant la ligne et localisation d'exploration séparée de la position de check. Carte pleine largeur, repères vert/gris, aperçu « Voir le lieu », caméra conservée et secours illustré à cibles espacées.

Éditeur commun depuis ＋, après check et partage ; conservation explicite des brouillons par compte. Check prérempli depuis fiche sans modifier le moteur d'admissibilité. Messages : cartes de lieux/événements, retours sans forcer la lecture en bas, non-lus partagés, conversation conservée. Partage en deux rangées et confirmation avant envoi. Articles fictifs, événements enregistrables/partageables, notifications ouvrant leur cible, trois catégories d'enregistrés.

Garde de navigation ajoutée : aucune restauration différée de scroll/focus en arrière-plan pendant un dialogue ouvert. Cela évite une interférence possible ; la cause du timeout historique n'est pas affirmée démontrée. Le parcours de check ciblé réussit en 390 et 1280 px avec les nouveaux accès, sans hausse du délai.

Tests intermédiaires : nouvelle recette intégrée 320/390/1280 réussie, scénario de présentation complet et répété 390/1280 réussi, GPS en attente/fil Amis/changement de connexion réussis. Adaptation et exécution du reste de la suite en cours. Aucun des succès intermédiaires ne vaut résultat global final.
