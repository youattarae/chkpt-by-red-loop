# Corrections des cas limites et guide complet

30 octobre 2026. Correctifs sur la base existante, branche `feat/profil-social`. La demande de fournir le lien du nouveau code autorise la synchronisation de cette branche sur GitHub ; le passage du dépôt en privé est reporté à la fin du travail. Aucune fusion de `main` ni activation d’hébergement n’est effectuée par ce lot.

## Résultat des dix corrections

| Défaut de la revue | Comportement corrigé |
|---|---|
| État personnel visible après changement de compte | Notifications, préférences et intentions locales sont séparées par compte ; changement de session et déconnexion vident les états transitoires. Les notifications sont aussi filtrées par destinataire. Les autres onglets suivent le changement de session. |
| Check privé suivi d’un post public implicite | Choix d’audience visible dans les deux formulaires de publication. Après un check, l’audience reprend celle de la visite ; le serveur l’utilise aussi si un ancien client l’omet. Un partage public reste possible sur choix explicite d’un adulte public ; les restrictions des profils privés/mineurs sont conservées. |
| Démarrage destructif insuffisamment expliqué | Confirmation explicite annonçant les comptes et contenus supprimés. Annuler ne déclenche aucune remise à zéro. Le changement de personnage reste disponible sans reset. Les permissions serveur restent requises. |
| Cache abîmé et écran blanc | Données canoniques relues depuis le serveur ; lecture contrôlée des caches personnels, propositions et modération, repli si JSON/type invalide. Les écritures de cache n’interrompent plus le rendu si le stockage est plein. |
| Réponse de check perdue | Recherche de la visite du propriétaire enregistrée aujourd’hui sur le lieu. Reprise de la confirmation et de la publication avec zéro nouveau point ; si résultat inconnu, bouton Vérifier l’enregistrement. L’anti-doublon serveur reste actif. |
| Ancienne requête conservée après Appliquer | Le panneau de filtres valide la saisie courante avec ses filtres. Champ, statut et résultats portent sur la même recherche. |
| Puces effacées par un changement de distance | Conservation des catégories lors d’un changement de distance/tri ; choix explicite d’une nouvelle catégorie remplace les anciennes. État sélectionné accessible sur les puces. |
| Favori affiché après échec d’écriture | État en cours, blocage des doubles clics et retour à l’état précédent sur échec ; une resynchronisation peut réconcilier un résultat réseau inconnu. |
| Profil valide avec erreur périmée | Ancienne erreur effacée lors d’une nouvelle lecture et après réussite. |
| Échap et focus du check-in | Dialogue natif, navigation clavier contenue et restauration du focus. Un brouillon de publication rédigé demande confirmation avant abandon. |

La reprise d’un check lit uniquement l’historique authentifié du propriétaire. Elle ne crée pas de visite supplémentaire, ne rejoue pas un gain de XP et ne transforme pas une tentative hors rayon en validation.

Deux améliorations liées : l’écran attend la vérification de la session avant de proposer une recherche qui serait effacée par la fin de connexion ; la restauration du défilement s’arrête aussi lors d’une interaction clavier. Les références aux pages retirées du cache de navigation sont libérées.

## Vérification

- `npm run lint` et `npm run build` réussis.
- **44/44 groupes de tests complets**, suite historique de 11 tests comprise dans ce total.
- Nouveau groupe `tests/edge_cases_browser.ts` : scénarios de la revue transformés en contrôles de correction — cache invalide, sessions, audience, confirmation de reset, réponse perdue, filtres, favoris, profil et Échap.
- Les anciens tests attendent l’écran chargé ; ceux du reset confirment désormais l’action explicitement. Le scénario de présentation choisit explicitement Public pour son exemple destiné au fil.
- Bases et comptes temporaires : aucune base de présentation réelle n’a été utilisée pour les tests de reset.

## Guide complet livré

- [PowerPoint modifiable](GUIDE_UTILISATION_COMPLET.pptx) : **41 diapositives**, environ 2,7 Mo.
- [PDF](GUIDE_UTILISATION_COMPLET.pdf) : **41 pages**, environ 2,6 Mo.
- [Sommaire et fichiers source](guide-utilisation/README.md).

Captures réalisées dans cette version corrigée avec des données fictives : navigation, recherche, check et audience, profils, avis, stories, progression, réglages, propositions, aperçu établissement, console, sauvegarde et confirmation de reset.

Le PDF a été rendu sans réseau et vérifié pour l’absence de débordement. Le PPTX a été rouvert avec sa bibliothèque de génération : structure ZIP valide, 41 diapositives, images intégrées, texte modifiable et absence de macro. Pages de couverture/confidentialité du PDF relues visuellement. Les deux fichiers sont inférieurs à 40 Mo. L’ouverture dans PowerPoint/Keynote sur les appareils réels reste à effectuer ; aucun test Microsoft PowerPoint physique n’est revendiqué.

## Limites conservées et annoncées

Le GPS navigateur et ses coordonnées ne constituent pas une preuve antifraude ; l’échec du GPS peut ramener ce prototype au simulateur, qu’il faut vérifier avant de confirmer. Certains compteurs initiaux restent fictifs et ne correspondent pas au nombre de profils accessibles dans les listes. Intentions d’événement et essais de récompense restent locaux à l’appareil, désormais séparés par compte.

Les propositions et certaines actions opérateur restent illustratives/locales. L’aperçu établissement présente des statistiques inventées. Aucun lien d’hébergement distant n’est activé ; un hébergement gratuit peut perdre son stockage. La sauvegarde chiffrée reste manuelle. Safari, Windows, les autorisations GPS réelles et la présentation sur projecteur nécessitent une répétition sur les appareils concernés.
