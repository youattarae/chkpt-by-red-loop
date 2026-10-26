# Feuille de route pour Codex — quatre petits chantiers

**Ne commence pas les lots suivants avant d'avoir stabilisé le précédent.** Chaque lot se termine par un petit bilan : code modifié, tests exécutés, difficultés, reste à faire.

## Lot A — Fiabilité et sécurité (à faire en premier)
- Inspecter la structure du dépôt et les scripts ; installer les dépendances, résoudre les erreurs si présentes.
- Sécuriser ou désactiver côté serveur la bascule de persona `/api/auth/switch-demo`, surtout vers administrateur ; ne jamais utiliser un paramètre client comme unique protection.
- Rendre `/api/demo/reset` accessible seulement dans un environnement privé de démonstration à des opérateurs autorisés ; ne pas en faire une fonction ouverte au public.
- Neutraliser les jetons et identifiants de seed prévisibles en dehors du mode local de démonstration.
- Garantir que « Check-in ici » reprend l'identifiant exact du lieu sélectionné lors de chaque ouverture de la fenêtre.
- Ajouter tests pertinents pour ces cinq règles ; exécuter lint/build/tests, rapporter honnêtement les résultats.

**Acceptation :** même sans session, on ne peut ni devenir admin ni effacer la démo. De la carte à la fiche puis au check-in, le lieu ne change jamais.

## Lot B — Un seul scénario parfait (après lot A)
- Scénario Maquis à Cocody, vrais enchaînements entre composants, compteur XP, badge « Maquis Master » visuel.
- Check-in simulé **clairement affiché comme simulation**, sans tricher sur le résultat d'une vraie vérification GPS.
- La création facultative d'une publication apparaît dans l'Accueil et le Profil et résiste aux navigations de la démo.
- L'intention « J'y serai » fonctionne sur un événement cohérent.
- Reset autorisé + jeu de données stables pour rejouer le parcours plusieurs fois ; test complet du parcours.

**Acceptation :** démonstration de 3 minutes reproductible sans appel Gemini externe ni coupure de parcours.

## Lot C — Finition premium (après lot B)
- Palette CHKPT (deux bleus et bordeaux) ; interface mobile d'abord, lisible sur écran projeté.
- Photos de présentation fiables et autorisées, fallback en l'absence de réseau.
- Harmoniser boutons, textes français, icônes, chargements, animations sobres.
- Afficher discrètement « Mode démonstration — données fictives ».
- Ne pas créer de nouveaux logos définitifs : intégrer des assets validés fournis par le porteur.

**Acceptation :** une personne peut comprendre le concept sans instructions techniques.

## Lot D — Préparer la présentation (après lot C)
- Un écran d'accueil ou bouton « Démarrer la démo » (s'il améliore le parcours sans risques de permission).
- Une checklist répétable avant présentation et un texte du pitch (FrancoTech, financeurs).
- Un mode de secours ou vidéo de 60–90 secondes si faisable, **sans prétendre qu'elle existe avant sa création**.
- Mettre à jour la documentation : fonctionnalités vraies vs simulées, étapes de lancement, limitations connues.

**Acceptation :** Ingrid peut dérouler seule le pitch et répondre honnêtement aux questions.

## Non prioritaires
Migration native, achats, base de production, 130 écrans complets, check-in collaboratif, IA temps réel, nouveaux systèmes publicitaires ou badges, nouveaux rôles non validés.
