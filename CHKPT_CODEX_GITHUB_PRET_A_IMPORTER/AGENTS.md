# Instructions permanentes de Codex — CHKPT by RED LOOP

## Lecture et contexte
- Lis `README.md`, `docs/PRODUIT_ET_DECISIONS.md`, `docs/ETAT_CODE_ET_RISQUES.md`, `docs/FEUILLE_DE_ROUTE_CODEX.md` et `docs/PASSATION_V3_SOURCE.md` avant les modifications importantes.
- **Le code de ce dépôt est la base actuelle** : ne pas recréer l'application, déplacer le projet vers une nouvelle stack ni supprimer les parcours validés.
- Priorité actuelle : **prototype web mobile-first pour une présentation à FrancoTech Cocody avec Ingrid et à des financeurs**, pas application grand public prête pour la production.
- Toute action de démonstration doit être explicitement identifiée comme simulée ou fondée sur des données fictives.

## Règles produit non négociables
- CHKPT = application grand public ; RED LOOP = écosystème / structure de projet. Slogan CHKPT : « Sors. Check. Partage. ».
- Navigation : Accueil, Carte, Check-in central, Sortir, Profil.
- Accueil : Pour toi + Amis. Nearby reste sur Carte ; tendances dans Sortir.
- Check-in distinct d'une publication facultative ; pas de post automatique. Simulation GPS de présentation explicite.
- 8 familles de badges ; ne pas inventer que les 40 badges complets sont implémentés.
- Publicités non cliquables, avec mention « Publicité » ; aucune publicité sur Carte.
- Aucun paiement interne, wallet ou billetterie intégrée ; pas de nouvelles fonctionnalités non validées.
- Couleurs cible : bleu nuit, bleu clair lumineux, bordeaux, noir, blanc. Garder l'emplacement des logos officiels s'ils ne sont pas fournis.
- Mineurs 13–17 ans privés par défaut ; médias et historiques respectent les permissions.

## Sécurité PRIORITAIRE (précondition à toute publication)
- Ne jamais présenter ce dépôt comme « prêt pour la production ».
- Corriger `/api/auth/switch-demo` : jamais de prise de rôle admin à partir d'un paramètre contrôlé par un visiteur ; réserver les personas aux environnements de démo privés, avec accès serveur vérifié.
- Corriger `/api/demo/reset` : aucune remise à zéro anonyme, aucun reset disponible publiquement par défaut ; tests de refus d'accès.
- Inspecter les comptes/sessions de seed codés en dur dans `server/db.ts` et empêcher leur usage sur Internet ; pas de mot de passe ou token fixe en déploiement public.
- Ne jamais versionner `.data/`, `.env*` (sauf `.env.example`), clés, jetons, photos privées ou informations personnelles.
- Ne pas confondre données de test avec utilisateurs, traction, lieux certifiés ou partenariats réels.

## Méthode de travail
1. Inspecter le code réel, les scripts et les erreurs ; ne pas prendre `IMPLEMENTATION_STATUS.md` pour preuve de tests.
2. Commencer par lot A de `docs/FEUILLE_DE_ROUTE_CODEX.md` : audit, sécurité, synchronisation du lieu présélectionné, tests.
3. Faire le plus petit changement sûr ; préserver l'interface et les données de démonstration synthétiques.
4. Exécuter `npm install` si nécessaire, `npm run lint`, `npm run build`, puis les tests avec serveur et base isolée ; noter chaque réussite, échec et limite.
5. Ne pas générer de nouveau repo, nouveau ZIP source, backend de production, React Native ou PostgreSQL sans demande explicite.
6. Lister les fichiers modifiés, les risques résiduels et les essais réalisés après chaque lot ; mettre à jour `IMPLEMENTATION_STATUS.md` et `DECISIONS_TECHNIQUES.md` quand utile.
7. Proposer les changements dans une branche / pull request plutôt que modifier directement la branche principale.

## Définition du succès immédiat
Un jury peut voir sans erreur : Accueil → Carte → sélection d'un maquis de Cocody → fiche → check-in **simulé** exactement sur ce lieu → points / badge → publication → Profil → événement « J'y serai ». L'animateur peut réinitialiser la démo de manière **autorisée**. Les éléments simulés sont identifiables et le parcours est fiable sur smartphone et ordinateur.
