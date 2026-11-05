# Menu, collection de badges et grand ＋ — bilan du 5 novembre 2026

Complément de la mission existante, sur `feat/ux-demo-lots-0-8`, après la version `f747703` publiée avec autorisation. Aucun changement de stack, de base personnelle, de moteur, de seuil, de grade, de journal XP ou de permissions serveur.

## Changements

- Menu gauche : neuf accès dans l’ordre validé, identité séparée vers Profil. Mon compte et Réglages conservent leurs fonctions ; Messages reste dans la barre basse. Compteurs et lecture des notifications inchangés.
- Grand ＋ blanc de 40 px dans un bouton de 56 px aux couleurs CHKPT, sans symbole ni image dans le bouton, en clair/sombre. Actions Faire un check puis Créer une publication, sans check automatique.
- Huit familles officielles, illustrées par des médailles vectorielles originales intégrées au code (aucune dépendance réseau). Couleur/illustration correspondant au grade acquis ; verrou gris générique autrement.
- Pages de familles avec vrai Retour : ordre du catalogue existant, acquis/total exact, noms des seuls acquis, aucun nom/condition/tooltip de futur badge. Badge actuel décrit un accomplissement connu. Si les compteurs historiques ne permettent plus de détailler un acquis enregistré, le texte reste factuel sans inventer de chiffre.
- XP et journal réservés au propriétaire et conservés dans un volet séparé, fermé au départ. Aucun vrai compte ne reçoit de badge fictivement débloqué.

## Fichiers principaux

`SideMenu.tsx`, `BottomNav.tsx`, `BadgesView.tsx`, nouveau `BadgeArt.tsx`, `PersonalPage.tsx`, navigation/route `badge-family` et raccordement App. `server/badgeEngine.ts`, `shared/badgeCatalog.ts`, les API et le stockage des données ne sont pas modifiés.

## Vérifications

Recette dédiée : 320/390/1280 px × clair/sombre ; ordre exact du menu, notifications non marquées au simple affichage, accès aux deux parcours du plus, huit familles, vrais noms des acquis, anonymat des verrous, absence de jauges, retour/focus/position. Cas 2/5 vérifié par une réponse de test interceptée (aucune écriture en base) ; compte nouvellement créé avec zéro badge et visiteur non connecté vérifiés séparément. Captures dans `captures/menu-badges-plus-2026-11-05`.

**Résultat final : TypeScript et build réussis ; suite complète 49/49 groupes réussis, aucun échec final.** [Journaux et empreintes](verification-menu-badges-plus-2026-11-05/README.md). Les 48 groupes précédents restent historiques. PDF/PPTX régénérés : 49 pages/diapositives, sous 40 Mo.

## Limites et décisions conservées

Les familles sont celles validées par le projet ; noms de badges et barème restent provisoires. Les explications des acquis des personnages de présentation reposent sur les compteurs de démo explicitement fictifs. Le catalogue technique reste inspectable dans le code livré : le mystère est un choix de présentation, pas un secret cryptographique. Aucun test physique Safari/iPhone/Windows ni nouveau déploiement n’est annoncé. Le souci de connexion du téléphone au Mac n’a pas été diagnostiqué faute d’adresse IP et de message Safari.

La première relance complète s’est arrêtée au test de stabilité du serveur de développement : navigation initiale dépassant son délai de 15 s. Le même scénario rejoué isolément a réussi (check, badge, publication, absence de recharge de données et HMR). Aucun délai ni code applicatif n’a été modifié pour ce test ; la cause unique n’est pas établie. L’échec intermédiaire et la relance sont conservés dans les preuves, séparément de la recette finale. Les captures complètes des huit familles et d’une famille ont été régénérées avant cette relance.

Le rejeu global suivant a passé le contrôle dev puis révélé une ambiguïté de test : le journal était recherché par texte dans plusieurs anciennes pages gardées en cache. Le test cible désormais uniquement la page de progression visible, comme les autres interactions. Les pages conservées restent en place pour préserver leur état ; aucun contenu n’est supprimé pour faire passer le test.

Le nouveau test de retour mesure le défilement lors du clic natif, et non avant l’auto-défilement éventuel de Playwright pour atteindre la carte. Il continue d’exiger le retour à cette position et la restauration du focus. Une exécution précédente avait passé 47 groupes et cinq configurations du nouvel écran avant de s’arrêter sur cette mesure ; la trace intermédiaire est conservée. Les six configurations ont ensuite réussi en test ciblé, sans hausse de délai ni modification de la navigation applicative.
