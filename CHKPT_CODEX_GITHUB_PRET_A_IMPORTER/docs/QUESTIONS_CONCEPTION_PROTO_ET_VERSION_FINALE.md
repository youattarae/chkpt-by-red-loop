# CHKPT — questions pour compléter la conception

**À copier dans la conversation de conception de l’application.**  
Mise à jour : 28 octobre 2026.

## Comment répondre

Conserver les numéros. Pour chaque réponse, préciser : **décision retenue**, **exemple concret**, **prototype / version finale / plus tard**. Reprendre les décisions existantes avec leur source. Sinon indiquer **à décider**, sans inventer de règle officielle.

Ne transmettre aucun mot de passe, clé API, document d’identité ou donnée personnelle sensible.

## Décisions déjà retenues

- CHKPT est l’application ; RED LOOP est l’écosystème. Slogan : **Sors. Check. Partage.**
- Priorité : prototype privé pour FrancoTech Cocody, Ingrid et des financeurs, pas application de production complète.
- Interface claire au départ ; mode sombre dans Réglages ; couleurs et symbole CHKPT.
- Navigation : Accueil, Carte, Check-in central, Sortir, Profil.
- Accueil : **Pour toi / Amis**, sans Tendances.
- En-tête : symbole, GPS et commune sélectionnée, notifications.
- Check exclusivement depuis le bouton central : **choisir le lieu → Confirmer le check → publication facultative**.
- Une validation par établissement et par jour ; rayon actuel **250 mètres**.
- GPS réel et simulateur pour la démo ; données fictives identifiables.
- Historique des visites réservé au propriétaire, même avec un profil public.
- Profils consultables et suivi demandés ; profils mineurs privés.
- Partage de fiches, avis de 1 à 5 étoiles avec commentaire et exemple fictif, filtres de catégorie/distance demandés.
- Publicité fictive non cliquable ; pas de paiement interne pour le prototype.
- Huit familles de badges : Explorateur, Foodie, Maquis Master, Culture Hunter, Event Hunter, Pionnier, Photographe, Multi-Explorer.
- Moteur serveur de 40 badges demandé ; **barème provisoire documenté autorisé**, en attendant validation officielle.
- Carte interactive avec radar de 250 mètres demandée.
- Accès privé à distance important ; préparation d’une solution simple, sans compte d’hébergement fourni.

Ces décisions ne signifient pas que toutes les fonctions de la version finale sont déjà développées.

---

## A. Objectif du prototype et présentation

**A01 — Quel message le jury doit-il retenir en une phrase ?**  
Classer : découverte de lieux, visites, fidélisation, réseau social local, visibilité des commerçants.

Réponse : …

**A02 — Quel scénario doit absolument fonctionner ?**  
Personnage, lieu, check, badge, récompense, publication et éventuel événement. Quels parcours peuvent rester illustratifs ?

Réponse : …

**A03 — Quelle échéance et quels appareils ?**  
Date, durée de présentation, Windows d’Ingrid, téléphone, connexion et secours hors connexion.

Réponse : …

**A04 — Quels critères définissent « prototype terminé » et qui valide ?**  
Liste courte de résultats vérifiables ; personne responsable du contenu, des visuels et du parcours.

Réponse : …

## B. Identité, contenus et lieux

**B01 — Quels fichiers de marque sont définitifs ?**  
Symbole et logo maîtres, SVG/PNG transparent, codes couleurs, typographies, variantes clair/sombre. Distinguer fichier officiel et adaptation provisoire.

Réponse / fichiers : …

**B02 — Quels territoires couvrir ?**  
Prototype puis lancement réel : Cocody, Riviera, Marcory, Plateau, Yopougon, autres communes/villes. Riviera doit-elle être un quartier de Cocody ou une zone de recherche distincte ?

Réponse : …

**B03 — Quels lieux et catégories faut-il montrer ?**  
Liste fictive du prototype, notamment les clubs. Pour les lieux réels : noms, catégories, adresses, coordonnées, horaires, prix et contacts autorisés.

Réponse : …

**B04 — Qui crée et valide une fiche établissement ?**  
Utilisateur, commerçant ou équipe CHKPT ? Qui corrige une erreur ou un lieu fermé ? Définir référencé, revendiqué et certifié.

Réponse : …

**B05 — Quels visuels et textes sont autorisés ?**  
Photos, images générées, mentions à conserver, logos de partenaires et autorisations d’utilisation.

Réponse : …

## C. Carte, localisation et check-in

**C01 — Quelles interactions cartographiques sont indispensables ?**  
Déplacement, zoom, regroupement des repères, recherche, recentrage, quartiers, fiche lieu et itinéraire externe éventuel.

Réponse : …

**C02 — Comment doit se comporter le radar de 250 mètres ?**  
Toujours visible ou seulement pendant le check ? Messages dedans/dehors, GPS imprécis et rayon identique ou différent selon les lieux en version finale.

Réponse : …

**C03 — Que faire sans accès à la localisation ?**  
Découverte manuelle autorisée, check bloqué, aide ou preuve alternative ? Le simulateur doit rester réservé à la démonstration.

Réponse : …

**C04 — Quelle preuve de présence pour la version finale ?**  
GPS, précision minimale, temps sur place, QR code, confirmation du lieu, contrôle de fréquence ou autre preuve. Définir refus, attente et contestation.

Réponse : …

**C05 — Quelles règles de visite sont définitives ?**  
Jour de référence, première découverte, retour, établissement fermé ou non certifié, événement au même lieu. Confirmer la règle d’un check quotidien.

Réponse : …

**C06 — Quelles données GPS conserver et qui peut les voir ?**  
Usage, durée et accès. Distinguer position courante, publication partagée et historique privé.

Réponse : …

## D. Points, 40 badges et récompenses

**D01 — Quel catalogue exact pour les 40 badges ?**  
Pour chacun : famille, nom, palier, visuel, règle, seuil, points éventuels et texte de déblocage. Qui validera le barème provisoire ?

Réponse / document : …

**D02 — Que compte chaque famille ?**  
Lieux distincts ou visites totales ? Catégories Foodie/Culture Hunter, communes Multi-Explorer. Pionnier : premier visiteur, parmi les cinq premiers ou créateur d’un lieu ?

Réponse : …

**D03 — Quelles preuves pour Event Hunter et Photographe ?**  
Distinguer « J’y serai » et présence confirmée. Pour une photo : import, publication, check associé, image unique et visibilité. Définir les preuves admissibles et les cas refusés.

Réponse : …

**D04 — Les badges ajoutent-ils des XP ?**  
Règle actuelle : 75 XP pour une première visite et 50 pour un retour admissible. Garder ces valeurs ? Bonus de badge cumulable ou reconnaissance sans bonus ?

Réponse : …

**D05 — Comment gérer les paliers et les corrections ?**  
Plusieurs déblocages simultanés, notifications, fraude, photo/lieu supprimé et changement de barème. Acquis permanents ou révocables ?

Réponse : …

**D06 — Quelles récompenses réelles envisager ?**  
Offre, établissement, financeur, conditions, durée, stock, âge, nombre d’utilisations et contrôle chez le commerçant. Tout reste fictif sans accord réel.

Réponse : …

## E. Profils, suivi, publications et partage

**E01 — Que voit-on sur le profil d’autrui ?**  
Identité, bio, compteurs, publications, badges, favoris ? L’historique personnel reste exclu. Préciser avant connexion et pour un profil privé.

Réponse : …

**E02 — Comment fonctionne le suivi privé ?**  
Demande, acceptation, refus, retrait d’abonné, blocage et signalement. Quelles règles pour les mineurs et les publications publiques d’un profil privé ?

Réponse : …

**E03 — Quels formats et interactions pour les publications ?**  
Texte, plusieurs photos, vidéo, lieu, check, événement, mentions et hashtags. Priorités pour modification, suppression, commentaires et réactions.

Réponse : …

**E04 — Que contient le partage externe ?**  
Lien, titre, photo, adresse et aperçu WhatsApp/autres réseaux. Connexion du destinataire requise ? Quels contenus seront publics en version finale ?

Réponse : …

**E05 — Quelle logique pour Pour toi et Amis ?**  
Chronologie, proximité, abonnements, préférences et recommandations. Expliquer ou non pourquoi une publication apparaît.

Réponse : …

## F. Avis, événements et Sortir

**F01 — Qui peut noter un lieu et comment calculer sa note ?**  
Check préalable, un avis modifiable, délai, photos, anonymat, moyenne et nombre d’avis. Séparer avis fictifs et réels.

Réponse : …

**F02 — Comment traiter les avis abusifs et les réponses ?**  
Signalement, modération, contestation, réponse du commerçant, suppression, délais et responsable.

Réponse : …

**F03 — Quelles catégories, distances et règles de tri dans Sortir ?**  
Définir Bars, Clubs, Restaurants, Maquis, Culture et autres. Les filtres concernent-ils les lieux, les événements ou les deux ?

Réponse : …

**F04 — Qui crée et valide les événements ?**  
Organisateur, lieu, horaires, prix, capacité, récurrence, annulation et éventuelle réservation. Comment confirmer une présence réelle ?

Réponse : …

## G. Établissements, partenaires et revenus

**G01 — Que peut faire un établissement dans son espace ?**  
Reprendre sa fiche, modifier ses données, créer une offre/événement, répondre aux avis et voir des statistiques. Comment vérifier son représentant ?

Réponse : …

**G02 — Quelles statistiques ont de la valeur ?**  
Définir visites, visiteurs uniques, vues de fiche, favoris, publications et utilisation d’offres. Périodes, comparaison et export, sans révéler d’historique privé.

Réponse : …

**G03 — Quel modèle économique tester ?**  
Publicité, abonnement établissement, mise en avant ou autre. Qui paie pour quel bénéfice ? Distinguer hypothèse, discussion et accord signé.

Réponse : …

**G04 — Quelles règles publicitaires définitives ?**  
Emplacements, fréquence, ciblage, mention, catégories interdites et mineurs. Non cliquable seulement en démo ou aussi dans la version finale ?

Réponse : …

## H. Accès distant, exploitation et données

**H01 — Qui doit accéder à la démo à distance ?**  
Ingrid, équipe, jury, financeurs et testeurs. Mot de passe partagé acceptable ou invitations individuelles ? Durée et retrait des accès.

Réponse : …

**H02 — Quel budget et quelle fiabilité d’hébergement ?**  
Gratuit avec veille/perte possible de données ou offre payante persistante ? Propriétaire du compte, facturation, validation d’une dépense et domaine souhaité.

Réponse : …

**H03 — Quelles données doivent suivre entre appareils ?**  
Profil, abonnements, publications, médias, badges, points, avis, favoris et historique. Indiquer indispensable au prototype ou à la version finale.

Réponse : …

**H04 — Quelles sauvegardes et durées de conservation ?**  
Suppression de compte, récupération après incident, conservation des photos et preuves GPS. Quelles données fictives peuvent être remises à zéro ?

Réponse : …

**H05 — Quelles responsabilités de confidentialité ?**  
Entité responsable, pays de lancement/hébergement, contact, mineurs, consentements et obligations à faire confirmer. Documents à valider avant de vrais utilisateurs.

Réponse : …

## I. Version finale et validation

**I01 — Sur quels supports lancer et dans quel ordre ?**  
Web mobile, application installable, Android, iPhone, ordinateur ; appareils anciens et réseaux faibles.

Réponse : …

**I02 — Quels moyens de connexion et de récupération ?**  
Téléphone, e-mail, mot de passe, code ou connexion sociale. Changement de numéro et protection renforcée des opérateurs.

Réponse : …

**I03 — Quelles fonctions pour le premier lancement réel ?**  
Classer obligatoire / utile / plus tard. Confirmer les exclusions : messagerie, paiement, billetterie, suivi de position en direct, etc.

Réponse : …

**I04 — Qui assure assistance, modération et gestion des incidents ?**  
Rôles, délais, recours, journal des actions et secours si la démonstration ne démarre pas.

Réponse : …

**I05 — Comment évaluer un pilote réel ?**  
Testeurs, lieux consentants, retours et indicateurs. Ne jamais utiliser les statistiques fictives comme preuve d’usage réel.

Réponse : …

---

## Éléments à joindre si disponibles

- [ ] Logo et symbole maîtres, palette et typographies.
- [ ] Maquettes validées et notes d’interaction.
- [ ] Catalogue des 40 badges, règles et visuels.
- [ ] Règles des points et récompenses.
- [ ] Lieux, catégories, coordonnées, horaires et contacts autorisés.
- [ ] Événements et règles de confirmation de présence.
- [ ] Photos, illustrations et autorisations d’utilisation.
- [ ] Pitch, public visé, scénario et date de présentation.
- [ ] Priorités fonctionnelles de la version finale.
- [ ] Accords de partenaires/commerçants, distingués des simples discussions.
- [ ] Hypothèses de revenus et budget d’hébergement.
- [ ] Règles de confidentialité, mineurs et modération déjà validées.
- [ ] Domaine souhaité et hébergement retenu, **sans aucun secret**.

## Synthèse attendue

1. Décisions confirmées avec leurs références.
2. Questions encore ouvertes, classées par urgence.
3. Périmètre final du prototype.
4. Périmètre du premier lancement réel.
5. Différences explicites entre simulation et fonctionnement réel.
6. Fichiers manquants et personnes chargées de les fournir.
