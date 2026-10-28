# CHKPT — Réponses de conception : prototype et version finale

**Date :** 28 octobre 2026<br>
**Version :** 1.0 — réponses de travail<br>
**Application :** CHKPT<br>
**Écosystème :** RED LOOP<br>
**Document d’origine :** `QUESTIONS_CONCEPTION_PROTO_ET_VERSION_FINALE.md`

Ce document reprend les 44 réponses formulées dans la conversation de conception. Il conserve la numérotation du questionnaire et distingue les décisions existantes des recommandations encore à valider. Il ne modifie pas automatiquement le code livré ni la structure du document maître.

## Sources et statuts

- **[Q]** : questionnaire CHKPT du 28 octobre 2026, notamment sa section « Décisions déjà retenues ».
- **[H]** : décisions explicites du porteur du projet dans la conversation de conception RED LOOP / CHKPT.
- **[C]** : état du code RED LOOP 0.3 livré. Un choix technique dans ce code ne vaut pas automatiquement validation produit.

**Retenu** = décision existante.<br>
**Proposé** = recommandation à valider.<br>
**À décider** = information ou arbitrage encore manquant.

Les références [H] et [C] renvoient aux éléments déjà exposés dans la conversation ; elles ne prétendent pas constituer une nouvelle vérification du dépôt ou de l’ensemble des documents historiques. Les propositions de ce document ne deviennent pas des décisions officielles sans validation du porteur du projet.

---

## A. Objectif du prototype et présentation

### A01 — Quel message le jury doit-il retenir en une phrase ?

**Proposé :**

> CHKPT transforme la découverte de lieux en expériences vécues, partagées et récompensées, tout en donnant de la visibilité aux établissements locaux.

Ordre conseillé pour la présentation :

1. Découvrir des lieux et des expériences.
2. Passer de la découverte à une visite réelle.
3. Partager et découvrir grâce aux autres.
4. Encourager le retour et l’exploration.
5. Apporter de la visibilité aux commerçants.

**Exemple concret :** une personne découvre un maquis, s’y rend, confirme sa visite, débloque un badge et partage son expérience.

**Périmètre :** prototype et version finale.<br>
**Source :** positionnement global [H] ; formulation et classement proposés.

### A02 — Quel scénario doit absolument fonctionner ?

**Proposé :** un parcours principal complet, court et reproductible :

**Accueil → découverte d’un lieu → fiche → bouton central Check-in → sélection du lieu → confirmation → progression/badge → publication facultative → profil.**

Ajouter un second compte permet de montrer la publication dans le fil et le fonctionnement du suivi.

**Exemple concret :** un compte de démonstration visite « Maquis des Amis — fictif », reçoit ses XP, débloque un badge configuré pour la démonstration, puis publie une photo.

La récompense partenaire peut être démontrée avec un **avantage explicitement fictif**, sans promesse d’utilisation réelle. Le back-office et certaines fonctions professionnelles peuvent rester illustratifs si cela est annoncé.

**Périmètre :** prototype prioritaire.<br>
**Sources :** parcours de check-in [Q] ; scénario proposé.

### A03 — Quelle échéance et quels appareils ?

**Retenu :** prototype privé pour FrancoTech Cocody, Ingrid et des financeurs ; accès distant important. [Q]

**À décider :** date de présentation, durée accordée, modèles de téléphones, navigateurs et qualité de connexion disponible.

**Proposé :** prévoir une démonstration de **5 à 7 minutes**, testée sur l’ordinateur Windows d’Ingrid et au moins un téléphone. Préparer une courte vidéo et des captures comme secours.

**Exemple concret :** si Internet tombe, la vidéo montre le parcours complet ; elle est présentée comme un enregistrement, pas comme une utilisation en direct.

**Périmètre :** prototype. Le véritable fonctionnement hors connexion reste un développement distinct.

### A04 — Quels critères définissent « prototype terminé » et qui valide ?

**Proposé :** le prototype est terminé lorsque :

- l’accès privé fonctionne depuis un appareil extérieur ;
- le parcours principal aboutit sans erreur bloquante ;
- le check valide ou refuse correctement une présence ;
- les XP et badges sont attribués une seule fois ;
- les publications et profils respectent la confidentialité ;
- les données persistent après fermeture et réouverture ;
- les éléments fictifs et simulés sont identifiés ;
- les principaux écrans utilisent la bonne identité CHKPT.

**Validation proposée :** le porteur du projet pour le produit et les contenus ; responsable technique pour le fonctionnement ; Ingrid pour la facilité de démonstration sur son équipement, si ce rôle lui est confié.

**Exemple concret :** refaire deux fois le même check ne doit pas donner deux récompenses de progression.

**Périmètre :** prototype.<br>
**Source :** critères et répartition proposés.

---

## B. Identité, contenus et lieux

### B01 — Quels fichiers de marque sont définitifs ?

**Retenu :** CHKPT est l’application ; RED LOOP est l’écosystème. Le slogan est **« Sors. Check. Partage. »** L’application doit utiliser les couleurs et le symbole CHKPT. [Q]

**À fournir ou confirmer :** fichiers maîtres CHKPT, codes couleurs exacts, typographies, variantes clair/sombre et icône d’application.

Les anciens fichiers RED LOOP du code 0.3 ne doivent pas être considérés comme les nouveaux fichiers officiels CHKPT.

**Exemple concret :** utiliser le symbole CHKPT dans l’en-tête, avec la localisation et les notifications.

**Périmètre :** prototype et version finale.

### B02 — Quels territoires couvrir ?

**Retenu :** ambition nationale, fonctionnement géographique par la carte et la recherche, sans pages dédiées aux villes, communes ou quartiers. [H]

**Proposé :** concentrer le prototype sur Cocody, avec quelques lieux fictifs dans d’autres communes pour démontrer la recherche. Le périmètre du lancement réel reste à fixer.

Dans les données, **Riviera sera rattachée à Cocody**, tout en pouvant être sélectionnée comme zone de recherche. Les limites précises des zones restent à définir.

**Exemple concret :** rechercher « Riviera » filtre les lieux de cette zone sans ouvrir une page de présentation de Riviera.

**Périmètre :** prototype local ; extension progressive dans la version finale.

### B03 — Quels lieux et catégories faut-il montrer ?

**Retenu :** restaurants, bars, maquis, clubs, lieux culturels et événements font partie de l’univers du produit. [H][Q]

**Proposé :** préparer un jeu de **15 à 20 lieux fictifs**, couvrant au minimum restaurants, maquis, bars, clubs, cafés et espaces culturels.

**Exemple concret :** « Club Horizon — fictif », avec catégorie, zone, photo illustrative, horaires et coordonnées de démonstration.

**À décider :** liste exacte et éventuels établissements réels autorisés. Ne pas inventer des horaires, prix ou partenariats pour un commerce réel.

**Périmètre :** données fictives pour le prototype ; informations vérifiées pour le lancement.

### B04 — Qui crée et valide une fiche établissement ?

**Retenu :** un utilisateur peut proposer un lieu absent, notamment depuis le parcours de check-in. Un établissement peut exister sans être partenaire. [H]

**Définitions proposées :**

- **Référencé** : le lieu existe dans la base.
- **Revendiqué** : une personne demande ou obtient la gestion de sa fiche.
- **Validé** : l’équipe a contrôlé les informations et, si nécessaire, le représentant.
- **Partenaire/abonné** : statut commercial distinct.

L’équipe valide les créations et traite les corrections sensibles. Un commerçant autorisé gère ses informations dans les limites définies.

**Exemple concret :** un nouveau maquis apparaît en gris ; après vérification, son repère devient vert.

**Périmètre :** prototype simplifié et version finale.<br>
**À décider :** procédure exacte de vérification et traitement des fermetures.

### B05 — Quels visuels et textes sont autorisés ?

**Proposé :** utiliser les éléments de marque validés, les contenus créés pour le projet et les images dont l’utilisation est autorisée.

**Exemple concret :** une image générée illustre un restaurant fictif et porte une mention de démonstration ; elle n’est pas attribuée à un établissement réel.

Les logos de partenaires ne doivent pas suggérer un accord inexistant.

**À décider :** inventaire des fichiers autorisés et des autorisations obtenues.

**Périmètre :** prototype et version finale.<br>
**Source :** distinction fictif/réel [Q] ; modalités proposées.

---

## C. Carte, localisation et check-in

### C01 — Quelles interactions cartographiques sont indispensables ?

**Retenu :** carte interactive, localisation, recherche par zone, catégories et distance ; « Autour de moi » reste sur la carte. [H][Q]

**Proposé pour le prototype :** déplacement, zoom, recentrage, sélection d’un repère, ouverture de fiche et radar. Le regroupement des repères devient prioritaire lorsque leur densité gêne la lecture.

**Exemple concret :** déplacer la carte vers Plateau, choisir « Restaurants », puis consulter un établissement.

L’itinéraire externe peut être ajouté, mais ne déclenche jamais automatiquement un check.

**Périmètre :** interactions essentielles au prototype ; enrichissements dans la version finale.

### C02 — Comment doit se comporter le radar de 250 mètres ?

**Retenu :** rayon actuel de **250 mètres** et carte avec radar demandée. [Q]

**Proposé :** afficher le radar lorsque l’utilisateur consulte sa proximité ou prépare un check, sans le maintenir en permanence pendant toute exploration de la carte.

**Exemple concret :**

- lieu à portée : « Ce lieu est à portée de check » ;
- lieu trop éloigné : « Rapproche-toi pour confirmer ta visite » ;
- position incertaine : « Ta position manque de précision. Réessaie. »

Être dans le cercle ne suffit pas si la position est trop ancienne ou imprécise.

**Périmètre :** rayon fixe au prototype ; exceptions par lieu à décider pour la version finale.

### C03 — Que faire sans accès à la localisation ?

**Proposé :** permettre la découverte manuelle, les recherches, les fiches et les sauvegardes. Bloquer la validation d’un check fondé sur le GPS tant qu’aucune position exploitable n’est disponible.

**Exemple concret :** l’utilisateur choisit Cocody et consulte les restaurants, mais reçoit une explication lorsqu’il tente de confirmer une visite.

**Retenu :** le simulateur est réservé à la démonstration et doit être identifiable. [Q]

**Périmètre :** prototype et version finale ; preuve alternative éventuelle plus tard, après validation.

### C04 — Quelle preuve de présence pour la version finale ?

**Retenu :** contrôle de proximité et limite de fréquence. Le code 0.3 prévoit également précision, ancienneté du signal et cohérence des déplacements, avec des paramètres provisoires. [Q][C]

**Proposé :** combiner ces contrôles côté serveur. Une coordonnée envoyée par le téléphone ne doit pas être considérée comme une preuve infaillible.

**Exemple concret :** refuser un check à Abidjan quelques minutes après un autre situé à une distance incompatible avec le déplacement.

**À décider :** seuils définitifs, éventuel temps sur place, QR complémentaire et procédure de contestation.

**Périmètre :** contrôle simplifié au prototype ; dispositif renforcé avant lancement réel.

### C05 — Quelles règles de visite sont définitives ?

**Retenu :** **une validation par établissement et par jour**. [Q]

**Proposé :** utiliser le jour civil en heure d’Abidjan. La première découverte correspond au premier check admissible de l’utilisateur dans ce lieu ; les jours suivants sont des retours.

**Exemple concret :** deux visites le même jour donnent un seul check crédité.

Un lieu non validé peut recevoir une visite admissible, sans bénéficier automatiquement des avantages des lieux validés. [H]

**À décider :** check en dehors des horaires déclarés et articulation lieu/événement. Recommandation : une même présence ne donne pas deux fois les XP de base.

**Périmètre :** prototype et version finale.

### C06 — Quelles données GPS conserver et qui peut les voir ?

**Retenu :** l’historique des visites reste réservé à son propriétaire, même si son profil est public. [Q]

**Proposé :** distinguer :

- position courante pour la proximité ;
- preuve technique temporaire du check ;
- historique personnel ;
- lieu volontairement associé à une publication.

**Exemple concret :** une publication peut afficher le restaurant choisi, sans exposer les coordonnées précises du téléphone ni les déplacements antérieurs.

**À décider :** durée de conservation des preuves GPS et accès interne autorisé. Le paramètre technique de 30 jours présent dans l’ancien code n’est pas une politique définitivement approuvée.

**Périmètre :** séparation dès le prototype ; politique complète avant lancement.

---

## D. Points, 40 badges et récompenses

### D01 — Quel catalogue exact pour les 40 badges ?

**Retenu :** 40 badges, organisés dans les huit familles suivantes :

Explorateur, Foodie, Maquis Master, Culture Hunter, Event Hunter, Pionnier, Photographe et Multi-Explorer. [Q]

Les degrés bronze, argent, or et prestige sont distincts des différents badges. [H]

**Proposé :** cinq badges par famille, avec quatre degrés par badge. Le catalogue des noms, visuels et seuils reste à compléter.

**Exemple concret :** un badge de découverte de restaurants évolue de bronze à prestige ; ce ne sont pas quatre badges différents.

**Validation proposée :** le porteur du projet pour les règles et noms ; responsable technique pour leur calcul.

**Périmètre :** barème provisoire documenté au prototype ; catalogue approuvé avant lancement.

### D02 — Que compte chaque famille ?

**Proposition de travail, non encore validée :**

| Famille | Mesure principale proposée |
|---|---|
| Explorateur | Nombre de lieux distincts visités |
| Foodie | Restaurants et autres catégories de restauration admissibles |
| Maquis Master | Maquis distincts visités |
| Culture Hunter | Lieux culturels distincts visités |
| Event Hunter | Événements avec présence confirmée |
| Pionnier | Contributions à des lieux nouvellement intégrés, après validation |
| Photographe | Contributions photo admissibles liées à des visites |
| Multi-Explorer | Diversité de communes, puis de villes explorées |

**Exemple concret :** dix visites dans le même restaurant ne deviennent pas dix restaurants découverts.

**À décider :** catégories exactes et règle Pionnier. Le premier visiteur, les cinq premiers et le créateur d’un lieu ne sont pas équivalents.

**Périmètre :** prototype provisoire ; règles finales à valider.

### D03 — Quelles preuves pour Event Hunter et Photographe ?

**Proposé :**

- **Event Hunter** : présence confirmée pendant la période de l’événement et dans son périmètre. « Ça m’intéresse » ou « J’y serai » ne prouve pas une présence.
- **Photographe** : photo publiée et liée à un check admissible ; un simple import abandonné ne compte pas.

**Exemple concret :** sauvegarder un concert ne débloque pas un badge de participation.

**À décider :** doublons d’image, nombre de photos créditées par visite et audiences admissibles. Recommandation : permettre une publication limitée aux abonnés pour ne pas imposer le partage public.

**Périmètre :** simulation identifiable au prototype ; preuves contrôlées dans la version finale.

### D04 — Les badges ajoutent-ils des XP ?

**À confirmer :** le questionnaire indique actuellement **75 XP pour une première visite** et **50 XP pour un retour admissible**. Il demande explicitement de confirmer ces valeurs. [Q]

**Proposé :** les conserver comme barème provisoire du prototype, sans bonus supplémentaire de badge au départ.

**Exemple concret :** une première visite rapporte 75 XP et peut débloquer un badge ; le badge n’ajoute pas automatiquement d’autres XP.

Cela évite de multiplier les points sans avoir encore défini leur équilibre.

**Périmètre :** prototype ; économie de progression à valider pour le lancement.

### D05 — Comment gérer les paliers et les corrections ?

**Proposé :**

- attribuer tous les paliers réellement atteints ;
- regrouper leur présentation pour éviter une succession excessive de notifications ;
- conserver une trace des corrections ;
- retirer les gains issus d’une fraude confirmée ;
- ne pas retirer automatiquement un badge parce qu’un lieu ferme ultérieurement.

**Exemple concret :** une visite invalidée pour fraude entraîne le recalcul des XP et badges qui en dépendent.

**À décider :** effet d’une suppression volontaire de photo et changement de barème. Recommandation : versionner les règles et annoncer toute modification affectant les acquis.

**Périmètre :** logique simple au prototype ; gestion complète dans la version finale.

### D06 — Quelles récompenses réelles envisager ?

**Retenu :** avantages partenaires, réductions, invitations ou tickets offerts ; utilisation par **QR unique avec code de secours**. Aucun achat de points. [H]

**Exemple concret :** un partenaire offre un avantage valable une fois, jusqu’à une date donnée, dans la limite d’un stock défini.

**À décider pour chaque offre :** financeur, bénéficiaires, conditions, âge, stock, durée, contrôle et éventuel coût en points.

**Périmètre :** récompenses fictives au prototype ; activation réelle uniquement après accord du partenaire.

**Source :** décisions récompenses [H] et distinction fictif/réel [Q].

---

## E. Profils, suivi, publications et partage

### E01 — Que voit-on sur le profil d’autrui ?

**Retenu :** les publications constituent le contenu principal du profil, sous forme de fil. Les badges sont une rubrique distincte. L’historique personnel n’est pas exposé. [H][Q]

**Proposé :** afficher nom, identifiant, avatar, bio et compteurs autorisés. Garder les favoris privés par défaut.

**Exemple concret :** un visiteur autorisé voit les publications partagées avec lui, mais pas la liste exhaustive des visites du propriétaire.

Pour un profil privé, publications et badges sont masqués aux personnes non autorisées.

**À confirmer :** visibilité des badges pour les abonnés acceptés et consultation avant connexion.

**Périmètre :** prototype et version finale.

### E02 — Comment fonctionne le suivi privé ?

**Retenu :** un seul bouton **Suivre**, avec acceptation pour les profils privés. Les profils mineurs sont privés. [H][Q]

**Proposé :** gérer demande, acceptation, refus, annulation, retrait d’abonné, blocage et signalement.

**Exemple concret :** après une demande, le bouton indique « Demande envoyée ». Le destinataire accepte ou refuse.

Une publication marquée publique ne doit pas contourner la confidentialité globale d’un profil privé.

**À décider :** les mineurs peuvent-ils rendre leur profil public ? L’ancien choix « privé par défaut » et la nouvelle formulation « profils mineurs privés » doivent être distingués.

**Périmètre :** prototype et version finale.

### E03 — Quels formats et interactions pour les publications ?

**Retenu :** texte, photo, vidéo, avis et association à un lieu ; proposition de publication immédiatement après le check, mais facultative. [H][Q]

**Proposé pour le prototype :** texte, photo, lieu associé, avis, réactions, commentaires et suppression. Plusieurs photos et vidéo peuvent suivre selon le temps disponible.

**Exemple concret :** après son check, l’utilisateur ajoute une photo et un commentaire, choisit l’audience puis publie — ou sélectionne « Plus tard ».

**À décider :** modification, mentions, hashtags et limites techniques.

**Périmètre :** parcours essentiel au prototype ; formats et interactions complémentaires dans la version finale.

### E04 — Que contient le partage externe ?

**Retenu :** partage de fiches demandé. [Q]

**Proposé :** lien, titre, visuel autorisé, catégorie et localisation utile. Les aperçus externes ne doivent pas révéler de contenu privé.

**Exemple concret :** partager une fiche lieu sur WhatsApp avec son nom, son image et son adresse.

**Prototype :** le lien reste soumis à l’accès privé à la démonstration.

**Version finale proposée :** fiches publiques consultables sans compte ; compte requis pour enregistrer, suivre, publier ou confirmer une visite.

**À décider :** périmètre exact des pages publiques et partage des publications personnelles.

### E05 — Quelle logique pour Pour toi et Amis ?

**Retenu :**

- **Pour toi** : événements enregistrés, intentions « intéressé/j’y serai », lieux sauvegardés et leurs actualités, publications de proches, contenus correspondant aux centres d’intérêt.
- **Amis** : activité des personnes suivies, proches ou non.
- Aucun onglet Tendances ; proximité sur la carte. [H]

**Proposé :** commencer avec un classement simple, explicable, combinant récence et pertinence.

**Exemple concret :** « Parce que tu as enregistré ce lieu » accompagne une actualité.

**À décider :** définition technique des « proches », pondérations et gestion des contenus répétés.

**Périmètre :** règles simples au prototype ; personnalisation progressive ensuite.

---

## F. Avis, événements et Sortir

### F01 — Qui peut noter un lieu et comment calculer sa note ?

**Retenu :** avis de 1 à 5 étoiles avec commentaire ; avis fictifs identifiés dans le prototype. [Q]

**Proposé :** demander un check admissible pour publier un avis de visite ; conserver un avis actif modifiable par utilisateur et par lieu.

**Exemple concret :** l’utilisateur met à jour son avis après une nouvelle visite au lieu d’ajouter plusieurs notes qui amplifient son poids.

Afficher une moyenne des avis admissibles et leur nombre.

**À décider :** délai après visite, minimum d’avis avant affichage d’une moyenne, anonymat et traitement des anciennes notes.

**Périmètre :** calcul fictif séparé au prototype ; règles finalisées avant lancement.

### F02 — Comment traiter les avis abusifs et les réponses ?

**Proposé :** signalement accessible, revue par un modérateur, motif de décision, possibilité de contestation et journal interne.

Un établissement ne supprime pas lui-même une critique. Son représentant validé peut disposer d’un droit de réponse.

**Exemple concret :** un avis injurieux est examiné ; un avis négatif mais respectueux n’est pas retiré simplement à la demande du commerçant.

**À décider :** délais de traitement, règles détaillées et responsable opérationnel.

**Périmètre :** démonstration simplifiée au prototype ; dispositif opérationnel avant lancement réel.

### F03 — Quelles catégories, distances et règles de tri dans Sortir ?

**Retenu :** Sortir rassemble événements et contenus éditoriaux, avec découverte de lieux ; présentation sans les onglets supérieurs de la maquette initiale. [H]

**Proposé :** proposer les filtres dans un panneau dédié. Les catégories et distances s’appliquent aux lieux et événements pertinents ; un article peut être filtré par thème ou territoire.

**Exemple concret :** sélectionner « Clubs » et une distance maximale, sans transformer Sortir en second fil social.

**À décider :** distances proposées, liste complète des catégories et ordre des rubriques.

**Périmètre :** catégories essentielles au prototype ; réglages affinés dans la version finale.

### F04 — Qui crée et valide les événements ?

**Retenu dans la conception :** organisateurs et établissements alimentent les événements ; l’équipe assure le contrôle. Le code 0.3 prévoit des propositions professionnelles en brouillon. [H][C]

**Proposé :** exiger organisateur, lieu, dates, horaires, catégorie, description et statut de publication.

**Exemple concret :** un organisateur propose un concert ; l’équipe valide avant publication. En cas d’annulation, la fiche change de statut.

La présence réelle se confirme pendant l’événement ; une intention ne suffit pas.

**Périmètre :** prototype simplifié ; récurrence, capacité et règles détaillées ensuite. Paiement et billetterie internes restent exclus.

---

## G. Établissements, partenaires et revenus

### G01 — Que peut faire un établissement dans son espace ?

**Retenu :** revendiquer sa fiche, gérer ses informations, développer sa visibilité et accéder à des fonctions professionnelles. [H]

**Proposé pour le premier espace :** modifier les coordonnées et horaires, proposer un événement ou une offre, répondre aux avis et consulter des statistiques agrégées.

**Exemple concret :** un restaurant corrige ses horaires et propose une soirée spéciale.

**À décider :** preuves du représentant, validation des changements sensibles et droits de plusieurs collaborateurs.

**Périmètre :** parcours illustratif ou simplifié au prototype ; espace contrôlé dans la version finale.

### G02 — Quelles statistiques ont de la valeur ?

**Proposé :**

- vues de fiche ;
- utilisateurs ayant enregistré le lieu ;
- checks admissibles ;
- visiteurs uniques ayant effectué ces checks ;
- retours observés ;
- interactions et utilisations d’offres.

**Exemple concret :** « 40 checks effectués par 28 utilisateurs sur 30 jours ».

Ces chiffres ne représentent pas automatiquement toute la fréquentation physique du commerce. Les historiques privés ne doivent pas être transmis.

**À décider :** périodes, seuils d’agrégation, export et mesure d’attribution.

**Périmètre :** statistiques fictives identifiées au prototype ; mesures réelles et définies au lancement.

### G03 — Quel modèle économique tester ?

**Retenu dans nos échanges :**

- abonnement établissement envisagé à **5 000 FCFA par trimestre** ou **15 000 FCFA par an** ;
- formules premium ;
- publicité d’annonceurs ;
- opérations avec partenaires et sponsors ;
- aucune transaction directement dans l’application. [H]

**Exemple concret :** un établissement paie hors application pour son offre professionnelle ; un annonceur finance une campagne de visibilité.

Les tarifs sont une base commerciale retenue, pas la preuve de ventes ou d’accords signés.

**Périmètre :** offres illustratives au prototype ; validation commerciale au pilote. Les prestations de données agrégées restent à cadrer séparément.

### G04 — Quelles règles publicitaires définitives ?

**Retenu :** publicité non cliquable, y compris dans la conception de l’application réelle ; visuels choisis par l’équipe, mention « Publicité » discrète mais lisible. [H]

Emplacements retenus :

- **Accueil** : avant les publications, puis toutes les 10 publications.
- **Sortir** : au début, puis toutes les 3 rubriques.
- **Dans une rubrique** : après chaque groupe de 3 lieux ou événements.
- **Articles** : un emplacement publicitaire prévu.
- **Carte** : aucune bannière.

**Exemple concret :** une bannière d’annonceur est visible sans ouvrir de lien au toucher.

**À décider :** ciblage, catégories interdites, protections des mineurs et plafonnement global de la pression publicitaire.

**Périmètre :** annonceurs fictifs au prototype ; règles de diffusion pour la version finale.

---

## H. Accès distant, exploitation et données

### H01 — Qui doit accéder à la démo à distance ?

**Retenu :** Ingrid, équipe projet, jury et financeurs concernés. [Q]

**Proposé :** accès nominatifs révocables pour les testeurs ; session de présentation dédiée pour le jury. Éviter un compte partagé pour les personnes qui créent réellement du contenu.

**Exemple concret :** Ingrid dispose de son accès ; un financeur reçoit un accès temporaire après la présentation.

**À décider :** liste des personnes, durée des accès et mécanisme d’invitation.

**Périmètre :** prototype privé. Aucun accès ne doit être créé ou transmis sans autorisation.

### H02 — Quel budget et quelle fiabilité d’hébergement ?

**À décider :** budget, fournisseur, domaine et titulaire du compte. Aucun compte d’hébergement n’est fourni dans le questionnaire. [Q]

**Proposé :** retenir un service avec données persistantes et sauvegarde pour la démonstration distante. Vérifier précisément les limites d’une éventuelle offre gratuite : gratuité ne signifie pas automatiquement perte de données.

**Exemple concret :** l’équipe ferme la démo le soir et retrouve les mêmes profils le lendemain.

**Périmètre :** hébergement limité au prototype, évolutif pour le pilote. Toute dépense doit faire l’objet d’une validation explicite.

### H03 — Quelles données doivent suivre entre appareils ?

**Proposé comme indispensable au prototype :** compte, profil, publications, abonnements, favoris, checks, historique privé, XP et badges.

**Exemple concret :** un check réalisé sur téléphone apparaît ensuite dans l’historique personnel sur l’ordinateur avec le même compte.

Les médias doivent également rester accessibles si leur publication fait partie de la démonstration.

**Version finale :** persistance cohérente de l’ensemble des données utilisateur, avis, récompenses et préférences inclus.

**Source :** cohérence proposée pour l’accès distant [Q] ; cela nécessite une base et un stockage partagés.

### H04 — Quelles sauvegardes et durées de conservation ?

**Proposé :** sauvegarde quotidienne du prototype hébergé, plus un point de restauration avant une présentation importante. Tester au moins une restauration.

**Exemple concret :** remettre le jeu fictif dans son état initial avant une nouvelle démonstration.

**À décider :** durée de conservation, suppression des comptes, médias, preuves GPS et sauvegardes. Les règles de suppression doivent couvrir les fichiers, pas seulement les lignes de base de données.

**Périmètre :** remise à zéro des données fictives au prototype ; politique complète avant collecte réelle.

### H05 — Quelles responsabilités de confidentialité ?

**À décider :** entité juridiquement responsable, contact, pays d’hébergement, prestataires et documents applicables.

**Retenu :** lancement pensé pour la Côte d’Ivoire, protection de la confidentialité et règles spécifiques pour les mineurs. [H][Q]

**Exemple concret :** une personne sait à qui demander la suppression de son compte et reçoit une explication sur l’usage de sa localisation.

**Périmètre :** données fictives privilégiées au prototype. Avant de vrais utilisateurs, faire vérifier les documents et obligations applicables par une personne compétente. Aucun nom d’entité ou engagement juridique n’est inventé ici.

---

## I. Version finale et validation

### I01 — Sur quels supports lancer et dans quel ordre ?

**Retenu :** la conception initiale vise une application mobile ; le prototype doit être accessible à distance et démontrable sur ordinateur. [H][Q]

**Proposé :**

1. Prototype privé utilisable dans un navigateur sur ordinateur et téléphone.
2. Pilote mobile, avec Android et iPhone selon les appareils des testeurs.
3. Lancement mobile plus large après validation.

**Exemple concret :** Ingrid présente le prototype sur Windows, tandis qu’un testeur reproduit le parcours sur téléphone.

**À décider :** ordre Android/iPhone et exigences sur appareils anciens.

**Attention :** le ZIP 0.3 ne constitue pas déjà cette démo web complète.

### I02 — Quels moyens de connexion et de récupération ?

**État existant :** le code 0.3 prévoit e-mail, mot de passe et récupération par e-mail. [C]

**Proposé :** conserver ce fonctionnement pour le prototype afin de limiter les dépendances et les coûts d’envoi.

**Exemple concret :** un testeur se connecte avec son compte de démonstration et peut demander un lien ou code de récupération selon l’implémentation retenue.

**À décider pour la version finale :** téléphone, SMS, connexions sociales et changement de numéro. Recommandation : protection renforcée des comptes administrateurs et professionnels.

**Périmètre :** e-mail au prototype ; autres moyens après arbitrage.

### I03 — Quelles fonctions pour le premier lancement réel ?

**Proposition de classement à confronter au périmètre maître :**

| Obligatoire | Utile selon les moyens | Plus tard |
|---|---|---|
| Comptes et confidentialité | Collections personnalisées | Mode voyage |
| Carte, recherche et fiches | Personnalisation avancée | Infos utiles sur la carte |
| Check-in contrôlé | Outils créateurs enrichis | Messagerie complète |
| Publications et suivi | Statistiques professionnelles avancées | Check-ins collaboratifs |
| Événements et Sortir | Automatisations éditoriales | Autres extensions de roadmap |
| Badges et progression cohérente | | |
| Modération, administration et assistance | | |
| Publicités et fonctions professionnelles retenues | | |
| Récompenses réellement financées, si promises au lancement | | |

**Exclusions maintenues :** paiement, portefeuille et billetterie internes ; pas de partage continu de position prévu.

**Exemple concret :** le produit permet de découvrir, visiter et partager avant d’ajouter le mode voyage.

**Sources :** décisions historiques [H] ; classement proposé, sans remplacement du périmètre maître.

### I04 — Qui assure assistance, modération et gestion des incidents ?

**Retenu dans le plan humain :** une personne cumule communauté, modération et support au départ ; le fondateur dirige le produit et les partenariats ; un responsable technique ou partenaire technique assure l’exécution technique. [H]

**Proposé :** répartir les incidents entre support, modération et technique, avec journal des actions et procédure d’escalade.

**Exemple concret :** le support recueille un problème de check ; le responsable technique examine l’erreur ; l’équipe produit décide si une règle doit changer.

**À décider :** personnes effectivement disponibles, horaires, délais et remplaçants.

**Périmètre :** rôles nommés avant la démo ; organisation opérationnelle avant le pilote.

### I05 — Comment évaluer un pilote réel ?

**Proposé :** commencer sur une zone dense, avec des établissements consentants et un groupe de testeurs recrutés pour des usages identifiés.

Mesurer notamment :

- réussite de la première découverte et du premier check ;
- taux d’erreurs et de refus contestés ;
- retours des utilisateurs ;
- répétition d’usage ;
- publications et interactions utiles ;
- intérêt des établissements ;
- compréhension de la proposition de valeur.

**Exemple concret :** comparer le nombre d’inscrits au nombre de personnes ayant effectué un premier check admissible, puis étant revenues.

**À décider :** nombre de testeurs, durée, lieux et objectifs chiffrés.

**Périmètre :** pilote réel uniquement. Les statistiques fictives ne prouvent jamais une adoption réelle.

---

## Synthèse

### 1. Décisions confirmées

CHKPT est l’application ; RED LOOP reste l’écosystème. Le prototype est privé. La navigation conserve ses cinq onglets. L’Accueil comporte Pour toi et Amis. Le check passe par le bouton central, avec un rayon actuel de 250 mètres et une validation quotidienne par établissement. La publication est facultative après le check. L’historique reste privé. Le prototype distingue clairement simulation et données réelles. Les publicités sont non cliquables et les transactions internes sont exclues. Les 40 badges utilisent désormais les huit familles indiquées dans le questionnaire. **Sources : [Q][H].**

### 2. Questions ouvertes les plus urgentes

1. Date, durée et appareils de démonstration.
2. Fichiers définitifs CHKPT.
3. Scénario principal et jeu de données fictives.
4. Validation des XP et du catalogue provisoire des badges.
5. Hébergement, budget et accès privés.
6. Critères de réception du prototype.

### 3. Périmètre proposé du prototype

Un accès privé, un jeu de données fictives persistant, les cinq onglets, un parcours découverte → check → progression → publication, des profils avec suivi, des badges calculés côté serveur, une carte avec GPS et simulation identifiée, et des publicités fictives. Les fonctions professionnelles peuvent être simplifiées si leur statut est annoncé.

### 4. Périmètre du premier lancement réel

Le périmètre maître reste la référence. Il faudra compléter la sécurité, l’exploitation, la modération, les droits d’accès, la fiabilité des données et les accords commerciaux avant d’utiliser le prototype comme base d’un véritable service public.

### 5. Différences simulation / fonctionnement réel

| Prototype | Version réelle |
|---|---|
| Lieux et utilisateurs fictifs identifiés | Informations et comptes réels |
| Position simulable pour la présentation | Contrôles de présence sans simulateur accessible au public |
| Barème de badges provisoire | Règles approuvées, versionnées et contrôlables |
| Récompenses illustratives | Offres financées et acceptées par les partenaires |
| Publicités fictives | Campagnes autorisées et administrées |
| Statistiques de démonstration | Mesures issues d’utilisations réelles |
| Réinitialisation possible du scénario | Conservation et suppression encadrées |

### 6. Fichiers manquants et responsables proposés

| Élément | Responsable proposé |
|---|---|
| Identité CHKPT définitive | Porteur du projet et créateur de l’identité |
| Catalogue et barème des 40 badges | Porteur du projet pour validation ; préparation possible avec l’assistant |
| Scénario et données fictives | Préparation possible avec l’assistant ; validation par le porteur du projet |
| Date, durée et équipement de présentation | Porteur du projet, avec Ingrid selon son rôle |
| Informations et autorisations des établissements | Équipe partenariats/commerciale |
| Configuration d’hébergement et exploitation | Responsable technique ; budget validé par le porteur du projet |
| Documents de confidentialité et conditions | Entité porteuse, avec accompagnement compétent |
| Vérification du prototype sur les appareils retenus | Responsable technique et testeurs désignés |

---

**Statut final du document :** questionnaire prérempli, à consolider après arbitrage. Les propositions ci-dessus ne deviennent pas des décisions officielles sans validation. Ce document ne constitue pas une preuve que les fonctionnalités décrites sont déjà développées.
