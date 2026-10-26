> **Mise à jour Lot A :** les points 1–4 ont été traités et testés dans cette branche. Voir [LOT_A_VERIFICATION.md](LOT_A_VERIFICATION.md) pour les commandes, résultats et limites. Le texte ci-dessous décrit l’état initial de l’export. Les lots B–D sont désormais décrits dans GUIDE_PRESENTATION.md ; ce document reste l’historique de départ.

# État de départ : source exporté de Google AI Studio le 26 octobre 2026

**Ceci est un état observé dans le code, pas une certification de fonctionnement.**

## Ce que contient cette version
- React 19, TypeScript, Vite 8, styles Tailwind, Express 4 ; package d'origine inchangé.
- Modules front `src/components/feed`, `map`, `places`, `checkin`, `profile`, `sortir`, `badges`, `auth`, `operator`.
- Serveur Express dans `server.ts`, persistance fichier JSON dans `server/db.ts`, API check-in, utilisateurs et médias.
- Tests existants : `tests/security_and_checkin.test.ts`, lancés avec `npm test` pendant que le serveur tourne.
- Éléments visuels simulés : carte illustrée, contenus de démonstration, notifications locales ; données de lieux à harmoniser.
- Des fonctions de Gemini/Google Maps sont présentes dans le serveur mais ne sont **pas une condition** du parcours de présentation ; ne pas dépendre de l'API en direct pour le jury.

## Risques concrets à résoudre AVANT de partager un lien public
1. **`server.ts` `/api/auth/switch-demo`** : le client peut demander un utilisateur de son choix, y compris `redloop_admin` ; la protection actuelle teste un champ `environment` envoyé par le client. **Ce n'est pas une protection serveur fiable.**
2. **`server.ts` `/api/demo/reset`** : endpoint actuellement accessible sans authentification ; tout visiteur peut remettre le scénario à zéro.
3. **`server/db.ts`** : comptes de démonstration et sessions à jetons prédéfinis ; ces identifiants sont un risque hors serveur local isolé. Les exemples `admin123`, `demo_session_admin_token_67890` ne doivent jamais devenir de vrais accès publics.
4. **`src/components/checkin/CheckinModal.tsx`** : état initial `selectedPlaceId` dépendant de `preselectedPlaceId` sans synchronisation certaine lors d'une nouvelle ouverture ; risque de check-in du mauvais lieu après clic depuis une fiche.
5. **`src/services/store.tsx`** : reconstitution d'informations de lieux à partir de valeurs locales / par défaut ; ne pas afficher chiffres/horaires inventés comme vérifiés.
6. **`src/services/notificationService.ts` / photos** : vérifier l'existence des images et un fallback disponible hors connexion.
7. **`server.ts`** : nom de modèle IA déclaré dans le code à vérifier, ne pas compter dessus pour le pitch.
8. **`IMPLEMENTATION_STATUS.md`** annonce 11/11 tests réussis : ce chiffre provient de l'export d'origine, **non vérifié dans la préparation du ZIP**.

## Hygiène GitHub du paquet
- Le ZIP imbriqué `chkpt_by_red_loop.zip` du fournisseur a été retiré.
- La base `.data/chkpt_db.json` (hash de mots de passe et jetons de session de démonstration) a été **exclue**. Au démarrage, le code recrée ses données fictives dans `.data/`.
- `.gitignore` exclut `.data/`, `.env*` (sauf `.env.example`), dépendances et build.
- Aucun accès public ni hébergement en ligne n'est configuré par cette opération.

## Vérifications à réaliser par Codex
- Installation `npm install` (le gestionnaire n'a pas pu installer les dépendances dans l'environnement de préparation).
- `npm run lint` et `npm run build` : vérifier et corriger les éventuelles erreurs.
- Démarrer `npm run dev`, puis tester le flux manuellement et exécuter `npm test` sur un serveur/dossier de test distinct.
- Ajouter des tests négatifs pour switch-demo, reset anonyme, simulation GPS, accès médias privés, sélection du lieu, XP unique.
- Ajouter un `package-lock.json` via npm après installation pour figer les versions une fois vérifiées.
