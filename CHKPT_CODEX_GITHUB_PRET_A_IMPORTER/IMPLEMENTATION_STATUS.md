# CHKPT — état vérifié des lots A à D

Prototype privé pour FrancoTech Cocody et les financeurs ; non prêt pour la production.

| Lot | Résultat concret | Vérification |
|---|---|---|
| A | Accès démo désactivés par défaut, opérateur requis, anciens accès neutralisés, check-in synchronisé | Refus anonymes/utilisateur ordinaire, migrations, coordonnées, XP, confidentialité et 11 tests historiques |
| B | Démarrer la démo, Maquis → badge → publication facultative → profil → événement → répétition | Parcours navigateur 390/1280 pixels, rechargement et deuxième répétition ; 1240 → 1315 XP |
| C | Accueil illustré, palette harmonisée, police et visuels locaux, secours d'image, simulation clairement identifiée | Même parcours avec tout accès externe bloqué et une image locale volontairement indisponible ; captures dans docs/captures |
| D | Guide Ingrid, pitch trois minutes, checklist et support autonome de quatre captures | Contenu HTML rendu sans réseau et navigation entre ses étapes vérifiée |

Commandes : `npm ci`, `npm run lint`, `npm run build`,
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` (ou Chromium Playwright installé).
Le lanceur exécute 18 groupes de contrôles, dont la suite historique de 11 tests.
Les tests utilisent leurs propres serveurs et bases temporaires, sans toucher aux données de présentation.

Les publications, badges et intentions sont des états de démonstration locaux au navigateur.
La distance, les sessions et les XP de check-in sont vérifiés côté serveur, sans preuve de l'origine physique du GPS.
Le jeu de départ, les compteurs et la progression préchargée restent fictifs. Les médias importés ne survivent pas au redémarrage serveur.
Le reset efface la base fictive ; le bouton Démarrer la démo repart avec Koffi après autorisation opérateur.
Gemini reste facultatif et son service externe n'a pas été validé. Aucun logo officiel, photographie de lieu validée ou vidéo n'a été fourni/créé.
Aucun pilote réel, résultat de marché, partenariat, déploiement public ou synchronisation multiutilisateur des publications n'est revendiqué.

Voir [GUIDE_PRESENTATION.md](docs/GUIDE_PRESENTATION.md) pour lancer et répéter la démonstration.
