# CHKPT — MISSION GLOBALE DE DÉVELOPPEMENT — LOTS 0 À 8

Je valide le plan de reprise établi dans ton audit du 5 novembre 2026.

**Nouvelle instruction : exécute l'intégralité des lots 0 à 8 dans une seule mission de développement, sans attendre mon approbation entre les lots.**

Tu dois réaliser les modifications, corriger les problèmes identifiés, tester les fonctionnalités et assurer leur intégration dans l'application existante.

## 1. Règles fondamentales

- Ne reconstruis pas CHKPT depuis zéro.
- Conserve React, TypeScript, Vite, Express et l'architecture actuelle.
- Pars du dernier HEAD local existant, notamment `6c4652a311d180da4c6cdda084e6604ea40d4860`, après vérification.
- Préserve la messagerie déjà développée, les comptes, les publications, les stories, les check-ins, les médias, les données, les XP, les badges, les recherches, la Carte et les fonctions d'administration.
- Ne modifie pas directement `main`.
- Travaille dans une branche dédiée, en préservant toutes les modifications locales existantes.
- Ne supprime aucune donnée personnelle ni aucun contenu existant.
- Ne crée pas de nouvelle infrastructure payante.
- Ne fais aucun déploiement public, push distant ou merge automatique sans autorisation.
- Ne présente jamais une fonctionnalité simulée comme un service réel de production.

Les deux Markdown du 5 novembre constituent les références produit. Le récapitulatif UX récent prévaut sur les anciens choix contradictoires relatifs à l'interface.

**Tu es autorisé à coder, refactoriser, ajouter des composants, effectuer des commits locaux et exécuter les tests nécessaires.**

Ne demande pas de validation intermédiaire. Prends des décisions techniques raisonnables lorsque les spécifications le permettent. Documente les arbitrages qui nécessitent réellement une décision produit au lieu d'en inventer une.

## 2. LOT 0 — Sécuriser la base technique

- Vérifier la branche et le HEAD exacts.
- Préserver les modifications déjà réalisées.
- Mettre à jour `AGENTS.md` avec les nouvelles décisions sans effacer les règles toujours valides.
- Investiguer le timeout intermittent sur « Confirmer le check ».
- Corriger la cause identifiée, si elle est démontrée, sans masquer les échecs par une simple augmentation des délais.
- Vérifier les migrations, sauvegardes, données et permissions existantes.
- Exécuter les tests de non-régression pertinents.

## 3. LOT 1 — Navigation, en-têtes, profil et menu

Implémenter la navigation flottante :

**Accueil · Carte · ＋/Check · Sortir · Messages**

- Remplacer Profil par Messages dans la barre.
- Créer une capsule flottante, arrondie et détachée des bords.
- Conserver l'indicateur actif bordeaux.
- Faire ouvrir le Profil par la photo de profil ou le bloc identité du menu.
- Mettre le menu à gauche, avec ouverture par bouton ou glissement depuis le bord.
- Afficher le symbole CHKPT uniquement dans l'en-tête de l'Accueil.
- Retirer la cloche de l'en-tête.
- Placer Notifications dans le menu avec compteur sur le bouton de menu uniquement.
- Conserver un compteur distinct sur Messages.
- Sur son Profil, afficher une flèche retour au lieu du menu et de la petite photo.
- Préserver les anciens liens et le contexte de navigation.
- Ne jamais perdre la position de lecture simplement en changeant d'onglet.

## 4. LOT 2 — Accueil, recherche et localisation

- Conserver uniquement Pour toi et Amis sur l'Accueil.
- Retirer la barre de rédaction située avant le fil.
- Garder les stories déjà développées.
- Faire disparaître ensemble les deux lignes d'en-tête lors du défilement descendant.
- Les faire réapparaître dès le premier mouvement inverse significatif, sans tremblement.
- Faire remplacer toute la première ligne par la recherche lorsqu'on touche la loupe.
- Conserver le moteur de recherche, ses suggestions et ses filtres.
- Afficher seulement l'icône de localisation dans la deuxième ligne.
- Ouvrir le choix de commune par cette icône.
- Séparer clairement l'exploration d'une commune de la preuve GPS d'un check-in.
- Conserver l'état du fil, des filtres et des recherches.

## 5. LOT 3 — Carte immersive et fiches

Faire de la Carte un véritable deuxième pilier de CHKPT.

- Carte bord à bord, derrière les commandes flottantes.
- Aucun grand bandeau opaque.
- Aucun symbole CHKPT au sommet de la Carte.
- Aucune publicité sur la Carte.
- Conserver Leaflet, radar, recherche, zoom, déplacements et recentrage.
- Repères verts pour les lieux validés et gris pour les lieux non validés.
- Filtres présentés en capsules flottantes.
- Premier appui sur un repère : aperçu compact en bas.
- Appui sur « Voir le lieu » : fiche complète.
- Conserver la sélection, la position et le zoom après consultation.
- Préserver les secours en cas d'indisponibilité des tuiles.
- Faire fonctionner l'expérience sur téléphone et ordinateur.

## 6. LOT 4 — Bouton ＋, check-in et publications

Au toucher du bouton central, ouvrir un panneau avec deux actions :

1. Faire un check.
2. Créer une publication.

Développer ensuite :

- Check-in depuis le bouton central.
- Check-in depuis une fiche lieu avec lieu présélectionné.
- Confirmation de présence avec visibilité explicite.
- Simulation clairement identifiée.
- XP attribués uniquement aux visites admissibles.
- Aucune double attribution.
- Après check : proposer facultativement photo, vidéo ou avis.
- Possibilité de choisir « Plus tard ».
- Un éditeur de publication commun, réutilisable depuis le bouton ＋, le check et le partage.
- Publication libre sans check préalable.
- Quatre médias maximum, conformément aux règles existantes.
- Gestion de brouillons par compte, sans exposition entre utilisateurs.
- Publications visibles dans le fil et le Profil.
- États des J'aime, commentaires et enregistrements conservés.
- Aucun partage ni publication libre ne doit créer automatiquement de présence ou de XP.

Conserver les protections des mineurs et la confidentialité des médias.

## 7. LOT 5 — Messages

Partir de la messagerie privée textuelle déjà développée localement.

- Ajouter Messages dans la navigation principale.
- Afficher la liste de conversations.
- Permettre l'envoi et la réception de messages.
- Ajouter les cartes de lieux et d'événements dans les conversations.
- Permettre d'ouvrir la fiche complète depuis une carte.
- Retrouver la même conversation, à la même position, après retour.
- Ajouter le compteur global de messages non lus.
- Séparer les compteurs Messages et Notifications.
- Prévoir des conversations fictives crédibles pour la démonstration.
- Préserver les conversations et messages existants.
- Protéger les contenus privés et les utilisateurs mineurs.
- Vérifier la compatibilité des anciennes données et sauvegardes.

Il ne faut pas reconstruire un serveur de messagerie si celui qui existe peut être étendu.

## 8. LOT 6 — Partage interne et externe

Créer un seul panneau de partage arrondi montant depuis le bas.

Il comporte **deux rangées horizontales défilantes**.

**Première rangée : dans CHKPT**

- Publier dans mon fil.
- Avatars et prénoms des amis.
- Choisir un ami pour préparer l'envoi de la fiche dans Messages.
- Possibilité d'ajouter un message avant confirmation.

**Deuxième rangée : hors de CHKPT**

- Copier le lien.
- Applications réellement prises en charge, notamment WhatsApp, Messenger ou SMS lorsque disponibles.
- Plus, ouvrant les possibilités natives du système.

Règles :

- Le partage ne constitue jamais une preuve de visite.
- Les liens ne doivent contenir aucun secret ou historique personnel.
- Ne pas simuler un partage externe réussi.
- Permettre le partage des lieux et événements.
- Gérer les fiches indisponibles, privées ou supprimées.
- Conserver les protections serveur et le contrôle des destinataires.

## 9. LOT 7 — Sortir, notifications, enregistrés et continuité

**Sortir**

- Conserver une grande mise en avant.
- Organiser les rubriques éditoriales et événements.
- Ne pas ajouter d'onglets inutiles.
- Permettre la lecture d'articles fictifs pertinents pour Abidjan.
- Rendre les lieux cités dans les articles cliquables.
- Conserver Ça m'intéresse, J'y serai et Enregistrer.

**Notifications**

- Accès exclusivement depuis le menu.
- Compteur chiffré sur le menu.
- Ouverture du contenu concerné.
- Marquage lu cohérent.
- Mise à jour du compteur.
- Aucun marquage automatique à la simple ouverture du menu.

**Enregistrés**

- Distinguer publications, lieux et événements.
- Préserver les favoris existants.
- Assurer la conservation par compte et la confidentialité.

**Gamification et publicité**

- Garder le moteur de badges existant et leur apparition progressive.
- Ne pas modifier les seuils et grades provisoires sans arbitrage documenté.
- Conserver la cadence publicitaire actuelle de l'Accueil à titre provisoire, en signalant le conflit documentaire.
- Ne pas introduire une nouvelle cadence arbitraire dans Sortir.
- Ne placer aucune publicité dans la Carte.

## 10. LOT 8 — Recette complète et démonstration finale

Exécuter tous les tests pertinents et créer les nouveaux tests correspondant aux décisions UX du 5 novembre.

Tester le scénario intégral :

Accueil → recherche → Carte → aperçu d'un lieu → fiche → check-in → XP/badge → publication → Profil → partage à un ami → Messages → carte reçue → fiche → retour à la conversation → Notifications → Sortir.

Vérifier :

- Navigation et transitions.
- Conservation des états, des positions et des contenus.
- Check-ins sans doublons.
- Sécurité et confidentialité.
- Mineurs et profils privés.
- Compatibilité des données.
- Rechargement et redémarrage.
- Recherche et cas sans résultats.
- Réseaux instables et tuiles indisponibles.
- Clavier et accessibilité.
- Affichages 320, 390 et 1280 pixels.
- Modes clair et sombre.
- Régression des anciennes fonctionnalités.
- Séparation entre fonctions réelles et simulées.

Relancer la suite complète après les dernières modifications.

Actualiser les captures, le guide Ingrid, les supports PDF/PPTX et la démonstration de secours seulement après stabilisation de l'interface.

Préparer les instructions d'accès privé gratuit, sans déployer automatiquement et sans annoncer une mise en production.

## 11. Méthode d'exécution

Exécute les lots successivement dans l'ordre de leurs dépendances, au sein de cette même mission.

Après chaque lot :
- Exécuter les tests ciblés.
- Corriger les régressions.
- Effectuer si approprié un commit local identifiable.
- Documenter les modifications et les risques.
- Continuer automatiquement vers le lot suivant.

Ne reviens pas me demander d'autorisation entre les lots.

Si un problème technique survient, recherche sa cause, effectue les corrections raisonnables et poursuis les parties indépendantes. N'annonce pas un test réussi s'il a échoué ou n'a pas été exécuté.

Si une limite technique empêche de terminer une fonctionnalité, documente précisément le blocage et conserve le reste du travail.

Ne compense pas une fonction absente par un simple bouton décoratif. Chaque interaction présentée comme opérationnelle doit avoir un résultat cohérent et vérifiable.

## 12. Livrable final attendu

À la fin de la mission, fournis :

1. La branche et le dernier commit exacts.
2. Le bilan des lots 0 à 8 : terminé, partiel ou bloqué.
3. La liste des fonctionnalités réellement opérationnelles.
4. La liste des simulations et des fonctionnalités reportées.
5. Les tests exécutés, leurs résultats et les éventuels échecs.
6. Les risques résiduels, notamment sécurité, GPS, données et messagerie.
7. La confirmation que les données et fonctionnalités antérieures ont été préservées.
8. Les liens vers les documents, captures et supports actualisés disponibles.
9. Les instructions simples pour lancer et essayer CHKPT sur mon ordinateur et sur le téléphone d'Ingrid.
10. Les décisions produit qui nécessitent encore mon arbitrage.

**Objectif final : une version intégrée et testée du prototype CHKPT, conforme aux décisions UX validées, fonctionnelle pour une démonstration privée à FrancoTech Cocody et devant des investisseurs.**

Ne t'arrête pas après l'audit ou le premier lot. Exécute autant que possible l'ensemble de cette mission avant de produire ton compte rendu final.