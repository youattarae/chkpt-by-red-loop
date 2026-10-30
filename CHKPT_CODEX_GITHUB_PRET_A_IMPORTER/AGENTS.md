# Instructions permanentes de Codex — CHKPT by RED LOOP

## Lecture et contexte
- Lis `README.md`, `docs/PRODUIT_ET_DECISIONS.md`, `docs/ETAT_CODE_ET_RISQUES.md`, `docs/FEUILLE_DE_ROUTE_CODEX.md` et `docs/PASSATION_V3_SOURCE.md` avant les modifications importantes.
- **Le code de ce dépôt est la base actuelle** : ne pas recréer l'application, déplacer le projet vers une nouvelle stack ni supprimer les parcours validés.
- Priorité actuelle : **prototype web mobile-first pour une présentation à FrancoTech Cocody avec Ingrid et à des financeurs**, pas application grand public prête pour la production.
- Toute action de démonstration doit être explicitement identifiée comme simulée ou fondée sur des données fictives.

## Règles produit non négociables
- **Décision utilisateur du 27 octobre 2026 (prioritaire sur les références historiques ci-dessous)** : interface blanche au premier lancement ; mode sombre mémorisé dans Profil → Réglages ; en-tête avec symbole CHKPT, bouton GPS portant la commune sélectionnée et notifications. Pas de lettres CHKPT ni de sélecteur de commune séparé. Le GPS conserve Simulateur / GPS Réel et la liste des positions au choix. Aucune signature « by RED LOOP » dans l'interface ; slogan réservé à la communication. Le bouton central de check-in utilise le symbole CHKPT, avec libellé conservé. Voir `docs/DIRECTION_VISUELLE_2026_10.md` pour les choix et les limites des assets.
- CHKPT = application grand public ; RED LOOP = écosystème / structure de projet. Slogan CHKPT : « Sors. Check. Partage. ».
- Navigation : Accueil, Carte, Check-in central, Sortir, Profil.
- Accueil : Pour toi + Amis. Nearby reste sur Carte ; tendances dans Sortir.
- Le bouton de confirmation du check-in porte le texte « Confirmer le check » (demande utilisateur du 27 octobre 2026). La mention de position simulée et de données fictives reste visible en démonstration ; le changement de texte ne modifie pas les contrôles serveur.
- Le bouton central Check-in est l'unique point d'entrée : sélectionner explicitement un lieu → Confirmer le check → publication facultative. Aucun raccourci de check sur les publications, la carte ou les fiches. Pas de post automatique ; simulation de présentation explicite.
- Décision du 28 octobre 2026 : historique des lieux visités réservé au propriétaire, même pour un profil ou un check public. Le partage d’un établissement contient seulement sa fiche fictive, sans identité, visite ou coordonnées de preuve.
- Compléments autorisés du 28 octobre 2026 : bienvenue rejouable, recherche locale, récompense fictive sans paiement, aperçu établissement avec statistiques inventées, préparation d’un hébergement privé HTTPS, profils publics et suivi authentifié, avis 1–5 étoiles avec commentaire et filtres catégorie/distance dans Sortir. Les profils privés/mineurs et les historiques ne deviennent pas publics.
- Demande du 28 octobre 2026 : carte Leaflet et radar de 250 m ; moteur serveur de 40 paliers dans les huit familles. Barème provisoire documenté explicitement autorisé ; ne pas présenter les noms/seuils provisoires comme officiels. Les preuves de visite, événement et photo doivent être validées côté serveur et les paliers journalisés sans doublon.
- Décisions utilisateur suivantes du 28 octobre : budget strictement gratuit ; montrer seulement une sélection de badges dans le prototype. Priorité à la synchronisation multiappareil des publications, médias, favoris et visites, avec historique propriétaire uniquement. Le catalogue complet et sa structure finale restent en attente d’arbitrage. Aucune proposition du document de conception importé ne devient automatiquement une instruction.
- Demande du 30 octobre 2026 : quatre images ou vidéos maximum par publication, y compris après check-in ; limite imposée côté serveur. Stories explicitement autorisées : accueil, avatar de profil/publication, ajout +, un média, durée de 24 h contrôlée côté serveur, confidentialité et suppression propriétaire.
- Clarifications suivantes du 30 octobre : Accueil recherche profils/établissements/événements/publications avec filtres par type ; Carte reçoit les filtres catégorie/distance et la recherche intelligente ; Sortir reste éditorial avec une petite recherche de son contenu. Classement accessible uniquement dans le menu latéral (retrait de Sortir), ouvert sur Amis/Global ; XP du mois uniquement, amis = suivis réciproques + soi. XP totaux réservés au propriétaire ; seuls les badges débloqués sont visibles aux visiteurs autorisés, sans registre ni historique. Compteurs abonnés/abonnements ouvrent les listes réelles protégées ; point bordeaux sous l’icône active.
- Précisions suivantes : profil compact et menu latéral personnels validés. Les résultats validés, fiches établissement/événement, profils d’autrui, relations et classement doivent devenir des pages avec vrai Retour, contexte et défilement conservés. Suggestions de saisie et filtres sont des panneaux temporaires ; les listes de relations ont leur recherche. Ces changements de navigation restent à appliquer ; ne pas les déclarer terminés.
- Contenus de démo : Ingrid N’Goan, Grâce Agbomi, Yacoub Ouattara et Georges Armand, portraits/bios fictifs et cinq publications initiales chacun ; conserver les comptes et publications personnels. Publicité en tête puis chaque cinq publications : banque, téléphonie, alcool réservé aux majeurs avec contrôle serveur, vêtements, mobilité ; marques fictives et slogans visibles, aucun lien ni partenariat réel.
- Protection du code : dépôt actuellement Public constaté au 30 octobre, accès API Forbidden. Ne pas publier ce nouveau lot avant passage en privé confirmé. Le JavaScript livré reste inspectable ; minification et absence de source maps ne remplacent pas les permissions serveur.
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
Un jury peut voir sans erreur : Accueil → Carte → sélection d'un maquis de Cocody → fiche → bouton central Check-in → sélection du lieu → confirmation **simulé** exactement sur ce lieu → points / badge → publication → Profil → événement « J'y serai ». L'animateur peut réinitialiser la démo de manière **autorisée**. Les éléments simulés sont identifiables et le parcours est fiable sur smartphone et ordinateur.
