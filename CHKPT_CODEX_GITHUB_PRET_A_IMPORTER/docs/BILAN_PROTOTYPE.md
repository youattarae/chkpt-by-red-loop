Mise à jour du 30 octobre : publications de quatre images ou vidéos maximum. Voir [les détails et la proposition de stories](PUBLICATIONS_MEDIAS_ET_STORIES.md). Stories non intégrées à ce stade.

# CHKPT by RED LOOP — bilan du prototype

**Mise à jour : 28 octobre 2026.**

Ce document résume le travail réalisé sur le dépôt existant et les limites à connaître pour la démonstration d’Ingrid à FrancoTech Cocody et aux financeurs.

## 1. Objectif et méthode

Préparer un prototype web fiable et présentable, utilisable sur ordinateur et téléphone. Le code existant a été conservé et corrigé progressivement : aucune réécriture complète, nouvelle stack ou infrastructure de production.

Le dépôt reste privé. Les corrections passent par des branches et pull requests. Les lots A à D sont préparés ; les derniers ajustements visuels et fonctionnels sont regroupés dans la [pull request nº 4](https://github.com/youattarae/chkpt-by-red-loop/pull/4), sur la branche `feat/profil-social`. Les compléments ci-dessous sont préparés sur cette même branche. Une version installée sur un ordinateur ne se met pas à jour automatiquement après modification du dépôt.

## 2. Lot A — vérification, accès et check-in

- Lecture des instructions, des documents produit et du code existant.
- Outils de démonstration désactivés par défaut ; activation locale explicite et mot de passe opérateur nécessaire.
- Suppression des anciens accès fixes utilisables et protection des changements de personnage et remises à zéro.
- Contrôles de rôles, sessions et permissions côté serveur.
- Correction du lieu utilisé pour valider une visite ; contrôle des coordonnées et de la distance.
- Une validation par établissement et par jour ; attribution des XP sans doublon.
- Protection des médias et des profils mineurs ; coordonnées de preuve non exposées dans le partage.
- Préservation des données valides ; refus de remplacer silencieusement une base endommagée.
- Tests avec serveurs et bases temporaires, séparés des données de présentation.

## 3. Lot B — scénario de présentation

Parcours préparé :

1. Connexion opérateur et démarrage de la démo.
2. Découverte d’un maquis de Cocody et ouverture de sa fiche.
3. Bouton central Check-in, choix explicite du lieu, **Confirmer le check**.
4. Résultat lisible, attribution de points et badge du scénario.
5. Publication facultative, visible ensuite sur le profil.
6. Événement et action « J’y serai ».
7. Remise à zéro autorisée pour répéter.

Dans le scénario vérifié, le personnage passe de **1 240 à 1 315 XP**. Ces points, personnages, compteurs et lieux sont des données fictives de démonstration.

Le problème de clignotement pendant le check-in a été reproduit et corrigé : les écritures de données ne provoquent plus le rechargement de la page en développement. Le lancement `npm run demo` utilise la version compilée pour la présentation.

## 4. Lot C — direction visuelle et interface

### Identité

- Interface claire au premier lancement.
- Mode sombre mémorisé, accessible dans **Profil → Réglages**.
- Couleurs CHKPT et symbole adapté de la planche fournie.
- En-tête : symbole seul, bouton GPS avec commune sélectionnée et notifications.
- Bouton central Check-in représenté par le symbole CHKPT.
- Navigation conservée : Accueil, Carte, Check-in, Sortir, Profil.

Le symbole est une adaptation vectorielle simplifiée : le fichier maître officiel reste nécessaire pour une reproduction exactement fidèle.

### Accueil

- Deux onglets : **Pour toi** et **Amis**.
- Publications avec auteur, texte, grande illustration et établissement associé.
- Réactions, commentaires et enregistrement des lieux partagés avec le profil.
- Fil Amis fondé sur les relations réellement présentes dans les données.
- Filtres secondaires regroupés pour alléger l’affichage.
- Publicité **Banque Boucle**, banque imaginaire : visuel généré par IA, non cliquable, sans service financier ni partenariat réel.

### Profil

- Avatar rond, identité, biographie et compteurs.
- Gestion du compte et accès aux réglages.
- Onglets Publications, Lieux enregistrés et Badges.
- Progression et journal XP conservés.
- Accès clair à **Historique des lieux visités** : lieux regroupés, dernière visite et nombre de visites, ouverture de leur fiche.
- Historique réservé au propriétaire du profil ; refus des autres comptes côté serveur, même pour un profil ou un check public.

### GPS et fiches lieu

- Modes **Simulateur / GPS Réel** conservés.
- Six positions de démonstration au choix ; la commune du bouton suit le choix.
- Fiche lieu plein écran sur téléphone et grand format sur ordinateur.
- Grande illustration, adresse, horaires disponibles, tags, favoris et galerie quand plusieurs images distinctes existent.
- Retour accessible pendant le défilement ; données fictives identifiées.
- Partage de l’établissement via le menu du téléphone quand disponible ; sinon lien à copier, WhatsApp ou e-mail.
- Lien direct vers la fiche, sans session, identité du visiteur, historique ou coordonnées GPS.

**Le check-in reste exclusivement accessible par le bouton central : choix du lieu → confirmation → publication facultative.** Aucun bouton de check sur les publications ou fiches.

### Illustrations

Visuels locaux générés pour le maquis, la terrasse, la cour culturelle et la publicité bancaire. Ils fonctionnent sans service d’images externe et ne prouvent aucun établissement ou partenariat réel. Les anciens médias fictifs en cache sont adaptés à l’affichage ; les médias importés ne sont pas réécrits.

## 5. Compléments demandés le 28 octobre

- **Bienvenue** : découvrir, checker et partager en trois étapes, parcours facultatif et rejouable depuis Réglages.
- **Recherche Carte** : nom, commune et catégorie, avec gestion des accents et état vide clair.
- **Filtres Sortir** : Bars, Restaurants, Clubs et catégories présentes, distance de 1 à 20 km et recherche locale. Les distances sont simulées ou estimées selon le GPS ; elles ne sont pas des trajets. Aucun club n’étant présent dans les données fictives, cette catégorie peut être vide. L’agenda reste indépendant.
- **Récompense fictive** : exemple de boisson découverte débloquée par un check validé au maquis, utilisation fictive mémorisée, sans paiement ni coupon réel.
- **Aperçu établissement** : deux fiches avec exemples de visites, enregistrements, publications et graphique fictif sur sept jours, sans données privées.
- **Profils de communauté** : ouvrir l’auteur d’une publication, voir son profil public et ses publications accessibles, suivre ou ne plus suivre. La relation est enregistrée côté serveur et alimente Amis. Les profils privés/mineurs et l’historique restent protégés ; les demandes de suivi privé ne sont pas ajoutées.
- **Avis** : composant `ReviewSection`, note de 1 à 5 étoiles et commentaire, exemple fictif visible, un avis modifiable par compte et lieu. Validation serveur, enregistrement dans la base et absence d’exposition des avis de profils privés/mineurs. Les notes fictives initiales de la fiche restent distinctes.
- **Carte et radar** : Leaflet/OpenStreetMap, zoom et déplacement, recentrage sur cinq zones d’Abidjan et cercle de présence de 250 m ; secours illustré si le fond est inaccessible.
- **Sélection de badges** : le prototype affiche au maximum six cartes ; le catalogue technique plus large est conservé pour la suite. La structure finale des badges et degrés reste à arbitrer. Le calcul serveur est fondé sur le journal et les preuves. Déblocages idempotents, notifications, preuves d’événement et de photo, sans bonus XP de badge ajouté. La progression de départ de Koffi reste fictive. Voir [les règles et limites](CARTE_RADAR_ET_40_BADGES.md).
- **Accès privé à distance** : configuration Node.js et Render, barrière HTTPS avec mot de passe visiteur distinct de l’opérateur, protection des fichiers et API, cookie sécurisé, déconnexion et limitation des tentatives. Le compte Render et le service restent à créer : aucun lien hébergé actif n’est revendiqué.

Captures et mode d’emploi : [EVOLUTIONS_DEMO.md](EVOLUTIONS_DEMO.md). Installation de l’hébergement : [ACCES_PRIVE_DISTANCE.md](ACCES_PRIVE_DISTANCE.md).

## 6. Synchronisation et budget gratuit

Le même compte retrouve ses nouvelles publications, photos, favoris, visites, XP et badges sur ses appareils. Les réactions et commentaires sont persistés. La confidentialité est vérifiée côté serveur, y compris pour les photos privées ; les anciennes réponses ne doivent pas réafficher les données du compte précédent.

La reprise d’une publication après une réponse réseau perdue utilise le même identifiant pour éviter un doublon. Une erreur conserve le texte dans le formulaire. Les médias ne reposent plus seulement sur la mémoire du processus.

Le budget retenu reste **strictement gratuit**. L’offre Render préparée peut effacer son disque ; aucune permanence gratuite sur Internet n’est garantie. Une sauvegarde chiffrée et sa restauration sont disponibles pour les administrateurs de la démo. Elles incluent les données et photos, mais pas les sessions actives. Une restauration remplace le jeu de données et impose une reconnexion.

Voir [SYNCHRONISATION_ET_SAUVEGARDE.md](SYNCHRONISATION_ET_SAUVEGARDE.md). Les anciennes données locales ne sont pas publiées ou importées automatiquement.

## 7. Lot D — supports et répétition

- Guide de présentation et scénario court pour Ingrid.
- Checklist de préparation et de répétition.
- PDF de huit étapes illustrées avec captures réelles.
- Support HTML autonome de secours, consultable sans connexion ; il montre des captures et ne remplace pas l’application interactive.
- Documentation du lancement sur Mac et Windows.
- Essai accompagné sur le Mac et accès depuis le téléphone sur le même réseau.

## 8. Comment accéder à la démonstration

Sur l’ordinateur, depuis le dossier contenant `package.json`, après configuration locale du fichier `.env` :

```bash
npm ci
npm run demo
```

Ouvrir `http://localhost:3000` sur cet ordinateur.

Pour accéder depuis un téléphone sur le même réseau privé, le serveur doit écouter sur le réseau. Sur le Mac :

```bash
HOST=0.0.0.0 npm run demo
```

Ouvrir sur le téléphone `http://ADRESSE-IP-DU-MAC:3000`. L’ordinateur doit rester éveillé, le serveur lancé et le réseau joignable. Un partage de connexion peut convenir selon le téléphone. Une adresse locale ne fonctionne pas depuis Internet ; le partage d’une fiche ne change pas cette limite.

Le GPS réel du navigateur nécessite généralement HTTPS. Le mode Simulateur convient à la répétition sur le réseau local.

Ne jamais envoyer ni versionner le fichier `.env`, son mot de passe ou les données `.data/`.

## 9. Vérifications et limites

Les contrôles couvrent la sécurité des accès, la confidentialité, les XP et doublons, le parcours complet et sa répétition, les réponses asynchrones, le rechargement, les images locales et leur secours, la navigation au clavier, les réglages, les deux thèmes et les écrans de 320, 390 et 1 280 pixels. Le partage et l’historique personnel font l’objet de contrôles supplémentaires.

**Dernière validation :** compilation, vérification des types et **35/35 groupes** de contrôles réussis sous Chromium Linux ; les 11 tests historiques sont inclus. Les supports ont été actualisés et le HTML de secours revérifié hors connexion.

Les résultats exacts de la dernière exécution sont consignés dans [IMPLEMENTATION_STATUS.md](../IMPLEMENTATION_STATUS.md). Les 21 groupes serveur et la compilation passent également sous Node.js 22. Les tests navigateur sont exécutés sous Chromium Linux ; ils ne remplacent pas la répétition sur le Mac, Safari du téléphone et Windows d’Ingrid.

Limites à connaître :

- Prototype privé, pas application prête pour la production.
- Données, statistiques de départ, personnes et lieux fictifs ; aucune traction ou partenariat revendiqué.
- Publications, médias, favoris, réactions, commentaires et historique personnel sont désormais partagés via le serveur. Les intentions, notifications locales et utilisation de récompense fictive restent propres au navigateur.
- Sessions, distance et XP contrôlés côté serveur ; absence de preuve de l’origine physique du GPS.
- Avis et relations de suivi enregistrés sur le serveur, sous réserve de la conservation de sa base ; un hébergement gratuit peut réinitialiser cette base.
- Médias importés conservés dans la base serveur tant que le disque est conservé ; une offre gratuite peut perdre ce disque.
- Recherche externe Gemini facultative et non nécessaire au scénario ; intégration externe non validée pour la présentation.
- Pas de paiement, billetterie, application mobile native ou backend de production.

## 10. Documents utiles

- [Accès privé à distance](ACCES_PRIVE_DISTANCE.md)
- [Compléments et captures](EVOLUTIONS_DEMO.md)
- [Guide de présentation](GUIDE_PRESENTATION.md)
- [Accueil et publicité fictive](ACCUEIL_SOCIAL.md)
- [Profil social](PROFIL_SOCIAL.md)
- [GPS et fiches lieu](GPS_ET_FICHE_LIEU.md)
- [Partage et historique personnel](PARTAGE_ET_HISTORIQUE.md)
- [Visuels et droits](VISUELS_ET_DROITS.md)
- [Démonstration illustrée PDF](DEMONSTRATION_PAS_A_PAS.pdf)
- [Support autonome de secours](DEMO_SECOURS.html)

## 11. Prochaine étape

Créer le compte Render et déployer la configuration préparée, puis vérifier le lien HTTPS avec un téléphone en données mobiles. Installer la version actualisée, vérifier les nouveaux éléments sur le Mac et le téléphone, puis installer la même version sur l’ordinateur Windows d’Ingrid. Répéter le scénario complet avec les appareils de présentation avant toute fusion finale ou utilisation devant le jury.
