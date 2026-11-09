# CHKPT — PROCHAINE ÉTAPE CODEX
## Audit de l'existant, rattrapage des décisions validées, implémentation et recette

**Version :** 9 novembre 2026  
**Projet :** CHKPT (prototype privé de démonstration)  
**Destinataire :** **conversation Codex existante** et dépôt déjà utilisé pour le prototype  
**Type de mission :** poursuivre l'existant ; **ne pas repartir de zéro**  
**Priorité :** vérifier → conserver ce qui est terminé → implémenter ce qui manque → tester → rendre compte.

---

## 0. INSTRUCTION PRINCIPALE À CODEX — À EXÉCUTER

Tu reprends **la mission de développement CHKPT déjà engagée**, y compris les précédents lots 0 à 8 et les addenda UX. Le porteur du projet **ne sait plus exactement quels points ont déjà été réalisés et testés**. Il te demande donc **de le constater toi-même dans le code** puis de terminer le travail restant, sans lui faire redécrire les décisions.

**Pour chaque exigence de ce document et chaque rappel des addenda antérieurs :**

1. **Cherche l'implémentation effective dans le dépôt et la branche de travail actuelle** (composants, routes, API, base, migrations, types, tests). Vérifie aussi les changements locaux non poussés ; la branche distante peut être moins avancée que le travail local.
2. Classe la décision dans l'un des états :
   - `FAIT + TESTÉ` — fonctionnalité présente et vérifiée par un test pertinent effectivement exécuté ;
   - `FAIT, TEST À COMPLÉTER` — présente, mais preuve de test insuffisante ;
   - `PARTIEL` — une portion seulement fonctionne ;
   - `À FAIRE` — absente ou contraire à la dernière décision ;
   - `BLOQUÉ` — dépendance réelle à signaler (avec solution de repli, si possible).
3. **Si `FAIT + TESTÉ`, ne recode pas :** note les fichiers et la preuve du test, puis passe au point suivant.
4. **Si `FAIT, TEST À COMPLÉTER`, complète les tests sans réécrire inutilement le code.**
5. **Si `PARTIEL` ou `À FAIRE`, implémente le delta nécessaire**, raccorde-le à l'existant, ajoute des tests, exécute-les et actualise le statut.
6. **Si `BLOQUÉ`, n'invente pas un fonctionnement :** explique précisément le blocage, ce qui reste à faire, et réalise tout ce qui est possible hors de ce blocage.
7. Donne au porteur un **tableau final simple** : `Fonction / État initial / Modifications / Tests réellement exécutés / État final / Limites`.

**Important :** ne considère pas une ligne de TODO, un écran statique, un mock d'API, une ancienne capture ou un test écrit mais non exécuté comme une fonctionnalité « faite et testée ». Vérifie les parcours réels de bout en bout dès que l'environnement le permet. **Ne redemande pas l'autorisation entre deux points déjà validés** : avance par incréments cohérents, dans la même mission.

### Règles de sécurité du travail

- **Ne pas** créer un nouveau projet, réinitialiser le dépôt, écraser le travail local, perdre une fonctionnalité existante ou supprimer des données de test à l'aveugle.
- Inspecter `git status`, la branche, les commits locaux et les modifications en cours **avant** de toucher aux fichiers ; préserver l'historique.
- Préserver les contrats et données existants, la confidentialité et les contrôles anti-abus.
- Changements incrémentaux, lisibles, avec tests ciblés à chaque étape ; commits locaux si la pratique du dépôt le permet.
- **Pas de push, merge, suppression de branche, déploiement public, achat de service, souscription ou migration irréversible de production sans demande explicite.**
- Ne pas annoncer des fonctionnalités de production : CHKPT est encore un **prototype privé**, avec des données fictives explicitement identifiées.
- Respecter les décisions les plus récentes ci-dessous en cas de contradiction avec une consigne plus ancienne.
- Dans les textes destinés aux utilisateurs et à Ingrid, toujours employer le terme **« utilisateurs »** ; pas « particuliers ». Ne pas exposer le nom de la société ombrelle dans les contenus externes destinés à Ingrid.

---

## 1. RÉFÉRENCES À RECONCILIER — RAPPEL, PAS REDÉVELOPPEMENT AUTOMATIQUE

Chercher, dans l'historique de la mission et les fichiers disponibles, puis **auditer** les exigences déjà transmises :

- Mission générale **lots 0 à 8** : sauvegarde du travail ; investigation du timeout de check-in ; navigation flottante ; recherche et en-têtes ; Carte immersive ; bouton central de création/check ; Messages/DM ; panneau de partage ; Sortir ; notifications ; tests de démonstration.
- `CHKPT_ADDENDUM_STORIES_DEFILEMENT_2026-11-05.md` : rangée Stories immédiatement au-dessus de « Pour toi / Amis », Stories qui partent avec le défilement du fil, retour indépendant des lignes d'en-tête, plusieurs Stories de démo autorisées.
- `CHKPT_ADDENDUM_MENU_BADGES_ET_BOUTON_PLUS_2026-11-05.md` : menu gauche, ordre exact des neuf entrées, collection de badges en huit familles, détails de badges verrouillés/débloqués, gros bouton central `+`.
- Les récapitulatifs maîtres CHKPT déjà fournis à Codex, pour les décisions non remplacées ici.

**Si un fichier de référence n'est pas accessible dans l'environnement Codex, ne prétends pas l'avoir lu.** Utilise les rappels précis ci-après pour continuer et signale uniquement le document indisponible dans le bilan.

### 1.1. Contrôles rapides de non-régression sur l'existant

Auditer, et ne modifier que si nécessaire :

- Barre du bas flottante : **Accueil · Carte · grand `+` · Sortir · Messages** ; `+` bien visible aux couleurs CHKPT, **pas le symbole de marque**, actions « Faire un check » puis « Créer une publication ».
- Sur l'Accueil : avatar à gauche, identité de marque uniquement là où validée, recherche à droite ; menu latéral depuis la gauche ; comportement d'en-têtes au défilement.
- Stories : cercles immédiatement au-dessus de « Pour toi / Amis », sans annuaire intercalé ; elles défilent hors écran et ne réapparaissent qu'en revenant à leur emplacement ; confidentialité et durée de vie respectées.
- Menu latéral dans **cet ordre exact** : **Notifications → Mon compte → Badges et progression → Enregistrés → Historique privé → Récompenses fictives → Classement → Aide → Réglages**. Supprimer uniquement l'entrée redondante « Messages privés » ; conserver les DM via la barre du bas. Bloc identité ouvrant le Profil ; compteur de notifications distinct des messages.
- Badges : **huit familles officielles** : Explorateur, Foodie, Maquis Master, Culture Hunter, Event Hunter, Pionnier, Photographe, Multi-Explorer. Sur la page de collection : grands badges illustrés et nom des familles ; détail : compteur **nombre de badges obtenus / nombre total des badges** ; badges obtenus en couleur **avec leur vrai nom**, badges verrouillés en gris **sans leur nom ni condition future** ; bloc « Badge actuel » décrivant un accomplissement passé réellement enregistré. Ne pas changer silencieusement le moteur XP ou les seuils.
- Carte et fiche de lieu : aperçu compact, fiche complète, filtre, recherche, géolocalisation, statuts, accès contextualisé au check. Pas de bannière publicitaire sur la Carte.
- Tous les contrôles de confidentialité et de modération existants, notamment profils privés et comptes de 13–17 ans.

**À la fin, indiquer clairement pour chacun : déjà fait et vérifié / réparé / encore incomplet.**

---

## 2. CARTE — CORRECTION PRÉCISE DE L'INTERFACE EXISTANTE

La dernière consigne du porteur corrige explicitement un malentendu de l'ancienne capture.

### À supprimer

- Les **cinq raccourcis visibles** : `Centrer Cocody`, `Centrer Marcory`, `Centrer Plateau`, `Centrer Yopougon`, `Centrer Riviera`.
- Le **bloc de texte d'explication/démo en bas à gauche** qui indique « Repères de lieux fictifs » et « Position simulée : cercle de 250 m, éligibilité finale vérifiée par le serveur. »

### À conserver

- Le panneau et son accès **« Outils carte »** : **ne pas supprimer le panneau entier**.
- L'action **« Mon radar · 250 m »** dans ce panneau.
- Les fonctions utiles de zoom, déplacement, recherche, localisation et filtres, ainsi que les vérifications de présence applicables.
- La barre de navigation flottante du bas.

**Attention :** retirer un texte de démonstration de l'UI ne retire pas le caractère fictif des données. Maintenir une indication de démonstration appropriée ailleurs sans remettre le bloc encombrant, et ne pas supprimer les contrôles GPS côté serveur.

**Tests :** aucun raccourci « Centrer [commune] » visible ; « Outils carte » et « Mon radar · 250 m » accessibles et fonctionnels ; le bloc inférieur gauche absent ; la Carte reste navigable sur mobile.

---

## 3. FOND CARTOGRAPHIQUE ET BASE DE LIEUX — ARCHITECTURE VALIDÉE

### 3.1. Objectif

- **À court terme :** fond de carte personnalisable **OpenFreeMap + MapLibre**, ou solution de repli équivalente si une contrainte vérifiée l'empêche, avec un style CHKPT cohérent, rues/quartiers visibles et **libellés commerciaux concurrents masqués**.
- **Données de lieux :** utiliser **OpenStreetMap (OSM)** comme source initiale des lieux, **dans une base de données CHKPT distincte**. Les repères sont affichés par **CHKPT depuis sa base**, et non directement comme une seconde couche de labels commerciaux du fournisseur de carte.
- **À long terme uniquement :** possibilité d'héberger notre propre infrastructure cartographique ; **ne pas la développer ni provisionner maintenant**.
- Conserver la possibilité de remplacer le fournisseur de tuiles sans perdre les fiches CHKPT et leurs relations.

### 3.2. Travail concret demandé

1. Faire un inventaire des bibliothèques de carte actuelles (notamment Leaflet), des tuiles, de la géolocalisation et des couches de marqueurs. **Ne pas remplacer aveuglément une Carte qui fonctionne.**
2. Vérifier la faisabilité des styles sans labels commerciaux, les conditions/licences du service gratuit et la compatibilité avec le prototype. **Ne pas supposer « illimité et gratuit en production » sans vérification.**
3. Proposer et implémenter une migration progressive vers MapLibre/OpenFreeMap si compatible, avec conservation des actions et comportements de la Carte ; **prévoir un repli** si le service gratuit ne fonctionne pas dans l'environnement de démo.
4. Définir la source d'import OSM adaptée aux catégories ciblées et à la **zone initiale Cocody**, avec ouverture possible sur tout Abidjan ; distinguer les résultats réellement importés de données fictives du scénario démo.
5. Importer en base uniquement des attributs OSM réutilisables et pertinents, en conservant **l'identifiant source OSM, le type d'objet, la date/version de provenance si disponible, la licence et la date d'import**.
6. Prévoir un import reproductible / idempotent (rerun sans doublons), un aperçu ou mode `dry-run`, des contrôles sur noms, catégories, coordonnées et qualité. Éviter les appels abusifs aux services OSM publics : privilégier une source/extrait autorisé, les règles d'utilisation et la mise en cache appropriée.
7. Pour les lieux créés par des utilisateurs : rechercher une correspondance existante avant création (proximité GPS, variantes de nom, catégorie, identifiants externes) ; permettre l'arbitrage manuel des ambiguïtés. **Ne pas fusionner automatiquement deux lieux distincts uniquement parce qu'ils sont voisins.**
8. Concevoir **une fiche de lieu CHKPT canonique** et une couche de provenance/source : les informations contributives propres à CHKPT et les données OSM restent traçables. Respecter **l'attribution et les obligations ODbL** ; signaler à part les points de conformité qui nécessitent une validation juridique avant exploitation publique.
9. Préserver les relations publications, favoris, check-ins, XP et badges lors d'une fusion de doublons ; éviter toute suppression accidentelle.
10. Mettre en place une méthode de mise à jour/conciliation ultérieure des données OSM, sans écraser aveuglément les corrections locales validées.

**Limite importante :** la couverture d'OSM à Cocody peut être partielle. **Ne pas promettre** que tous les établissements de Google Maps apparaîtront dans CHKPT ; **ne pas scraper ni copier massivement Google Maps** dans la base.

### 3.3. Critères d'acceptation

- Carte utilisable et lisible, sous identité CHKPT, sans superposition inutile de noms commerciaux et de repères CHKPT.
- Chaque repère CHKPT provient d'une fiche CHKPT avec ID unique ; aucune duplication à chaque nouvel import ou proposition d'un lieu déjà présent.
- Import testable de manière reproductible avec un petit jeu de données Cocody et résultats vérifiables.
- Attribution OSM et distinction des données sources / originales conservées.
- Aucun service payant ni nouvelle infrastructure propriétaire provisionnés.

---

## 4. MARQUEURS CARTE — CATÉGORIE, VÉRIFICATION ET SPONSORING

### 4.1. Deux dimensions à distinguer

- **Catégorie du lieu = pictogramme / forme lisible.**
- **Vérification = variante du repère : gris non vérifié, vert vérifié.**
- **Sponsoring = halo rouge autour du repère**, **indépendant** du statut de vérification. Un établissement sponsorisé n'est pas nécessairement vérifié.

### 4.2. Pictogrammes à montrer dans le prototype

Au minimum, rendre visuellement reconnaissables :

- Restaurants (couverts / assiette) ;
- Maquis (pictogramme distinct du restaurant) ;
- Bars / lounges ;
- Cafés / boulangeries ;
- Hôtels ;
- Lieux d'événements / événements ;
- Lieux culturels / touristiques.

**Précision de périmètre :** « hôtel » est demandé pour les pictogrammes visibles du prototype. Si la catégorie n'existe pas encore dans la taxonomie CHKPT validée, ajouter une représentation de démonstration réutilisable et signaler l'extension de taxonomie nécessaire, sans bouleverser silencieusement les catégories métier ni leur monétisation.

### 4.3. Comportement attendu

- Les repères sont visibles et différenciables **sans ouvrir une fiche**.
- Même catégorie = même symbole ; statut lisible via la variante ; halo rouge = sponsorisé.
- Au moins un exemple visible et fonctionnel de chaque type dans les données de démonstration ; distinguer explicitement données fictives et données réellement importées.
- Prévoir une légende compacte ou un repère explicatif accessible, et une distinction qui ne dépende pas uniquement de la couleur (accessibilité).
- Ne pas afficher une bannière publicitaire sur la Carte et ne pas confondre sponsorisé / mieux noté / vérifié.
- Ne pas déclencher de lien publicitaire au clic sur le halo ; le repère ouvre normalement sa fiche de lieu.

**Tests :** rendu pour gris/vert/sponsorisé, associations catégories ↔ pictogrammes, clic sur repère, filtrage, superposition et lisibilité sur téléphone.

---

## 5. LIEUX NON VÉRIFIÉS, CHECK-INS ET XP RÉTROACTIFS

### 5.1. Décision métier exacte

Un lieu **référencé mais non vérifié** est **consultable, partageable, enregistrable et checkable**.

- À la réalisation du check-in admissible, le système **enregistre le check avec statut « en attente de vérification du lieu »**.
- **Aucun XP immédiat** tant que le lieu demeure non vérifié.
- Quand CHKPT valide ce lieu, le système **réévalue les checks admissibles déjà enregistrés** et **crédite leurs XP rétroactivement**, **sans obliger l'utilisateur à revenir sur place**.
- Un check frauduleux, un check qui ne satisfait pas les règles existantes ou un lieu finalement rejeté **ne reçoit pas d'XP**.
- Prévoir une notification claire à l'utilisateur lorsque ses XP sont effectivement crédités.

### 5.2. Conception technique requise

1. Auditer les modèles actuels `Place`, `CheckIn`, récompenses, crédits XP, statut de validation et historique ; réutiliser les mécanismes existants.
2. Ajouter si nécessaire un **statut métier explicite** de check en attente et les métadonnées minimales permettant de déterminer l'admissibilité ultérieure ; conserver les protections de confidentialité et une politique de conservation raisonnable.
3. Au passage d'un lieu de non vérifié à vérifié, traiter les checks éligibles via **une opération idempotente**, idéalement transactionnelle ou munie d'une clé d'unicité, afin de ne jamais attribuer deux fois le même crédit.
4. Garder les règles anti-fraude et de fréquence des checks déjà validées, et les appliquer avant tout crédit ; ne pas créer un contournement via les lieux non vérifiés.
5. Prévoir un état « contrôle manuel requis » en cas de coordonnées suspectes, lieu fusionné ou check incohérent ; ne pas créditer par simple changement de couleur dans l'interface.
6. Ne pas inventer de barème XP, de règle de classement ou de seuils de badges. Réutiliser ceux du moteur existant si connus ; **sinon isoler la politique à configurer et signaler la décision manquante**, sans fabriquer une valeur dite officielle.
7. Rendre lisible dans la fiche/activité privée la situation « Check enregistré — XP en attente de vérification du lieu » ; ne pas l'afficher comme un check validé donnant déjà XP.
8. Vérifier l'effet réel sur badges, historique et classement ; si le mécanisme rétroactif de classement requiert une décision non validée, l'isoler et la signaler plutôt que modifier silencieusement les règles.

### 5.3. Tests indispensables

- Check sur lieu non vérifié : présence enregistrée, **XP = 0 immédiat**.
- Validation ultérieure : crédit des checks **admissibles** uniquement.
- Rejeu de la tâche de validation, double clic ou relance serveur : **aucun double crédit**.
- Lieu rejeté, douteux ou doublon : aucun crédit injustifié.
- Une visite trop fréquente ou hors des règles ne gagne pas d'XP par effet rétroactif.
- Confidentialité des coordonnées et des historiques respectée.

---

## 6. MESSAGES — PROFILS, RÉPONSES AUX STORIES ET PARTAGES

**Réutiliser la messagerie textuelle/DM déjà existante. Ne pas créer un deuxième système parallèle.**

### 6.1. Trois parcours obligatoires

1. **Profil d'un autre utilisateur → « Message »** : ouvre la conversation avec lui, existante si elle existe déjà.
2. **Story visible → champ « Répondre à la Story… » → DM** : la réponse part **dans la conversation privée avec l'auteur de la Story**, avec une **carte/miniature de référence à la Story** et le texte saisi. Une réponse Story **n'est jamais un commentaire public** ni une conversation indépendante par Story.
3. **Partager un lieu, un événement ou une publication → Envoyer en DM** : le destinataire reçoit un message avec une **carte de contenu consultable** et les autorisations appropriées.

### 6.2. Cas limites et confidentialité

- Badges/compteur de messages non lus sur l'onglet Messages ; ne pas confondre avec les notifications du menu latéral.
- Réponse à une Story expirée : le DM texte reste, mais l'aperçu du média expiré devient indisponible si sa durée/permission le commande ; **ne jamais réexposer une Story expirée ou privée**.
- Respecter les profils privés, blocages, autorisations de DM et protections des 13–17 ans ; ne jamais contourner une restriction par un lien, un partage ou une réponse.
- Conserver le suivi de lecture et l'ouverture correcte des liens internes ; pas de faux messages qui ne seraient visibles qu'en façade.

### 6.3. Tests

- Profil → DM et retour ;
- Story → réponse → conversation → carte de Story et aperçu selon disponibilité ;
- Story expirée et accès non autorisé ;
- Partage → carte de contenu dans les DM ;
- Badges de non-lus et permissions.

---

## 7. PARTAGE D'UNE PUBLICATION D'AUTRUI — DERNIÈRE DÉCISION

**Décision finale : le repartage d’une publication d’un autre utilisateur dans son propre fil est AUTORISÉ.** Cette décision annule l’interdiction passagère envisagée précédemment.

### 7.1. Panneau à deux rangées

**Rangée 1 — actions dans CHKPT** :

- **Republier dans mon fil** ;
- **Envoyer en DM** à un ou plusieurs utilisateurs / amis, selon les autorisations.

**Rangée 2 — hors de CHKPT** :

- Copier un lien ;
- Partage via WhatsApp, Messenger, SMS et les apps proposées par le système lorsque réellement prises en charge.

**Ne pas** afficher une action externe factice : utiliser le partage natif disponible ou un repli valide (copier le lien), sans promettre une intégration privée Instagram/Messenger qui n'existe pas.

### 7.2. Implémentation du repartage

- Le nouveau contenu du fil est **un repartage référencé à la publication originale**, avec attribution visible à l'auteur et accès à l'original lorsque autorisé.
- Ne pas dupliquer aveuglément tous les médias, likes ou commentaires en prétendant qu'ils appartiennent au repartage.
- Respecter la visibilité de la publication source, les suppressions, les blocages et les changements de confidentialité, y compris lorsqu'un lien a été partagé à l'extérieur.
- Aucun repartage ne doit autoriser le contournement d'un profil privé.
- Ajouter un commentaire personnel au-dessus du repartage **uniquement si le parcours existe déjà ou si cela ne nécessite pas de règle métier nouvelle** ; sinon laisser ce supplément pour arbitrage et livrer le repartage fonctionnel.

**Tests :** repost dans le fil, renvoi à l'original, source supprimée/devenue privée, partage DM, partage externe et permissions.

---

## 8. PROFIL — TROIS PETITS BADGES DE RECONNAISSANCE SOCIALE

### 8.1. Placement final, validé sur maquette

**Conserver la disposition claire et compacte du profil existant** (photo à gauche, nom, @identifiant, bio, lieu, statistiques puis publications). Ne pas transformer le profil en grand écran sombre illustré et ne pas augmenter inutilement sa hauteur.

- La photo conserve son **petit bouton `+` de création de Story**, déjà placé sur son bord inférieur.
- **Ne placer aucun badge sur ou sous la photo** : conflit avec ce `+`.
- La ligne de localisation affiche **`Cocody, Abidjan` puis, immédiatement à sa droite sur la même ligne, les trois petits symboles de badges**.
- **Ne pas ajouter une rangée « Badges » sous la description** ; ne pas afficher de titre ni leurs noms sur cette ligne.
- Les pictogrammes doivent rester compacts, lisibles et équilibrés sur petit écran, en évitant tout écrasement du lieu (gestion responsive, éventuellement repli adapté aux très petites largeurs).
- Les visuels sont les **vrais symboles des badges CHKPT débloqués**, et non des pictogrammes génériques permanents.

### 8.2. Sélection automatique et personnalisation

- **Par défaut**, afficher les **trois badges obtenus les plus prestigieux** selon un ordre stable et documenté du catalogue existant ; ne pas inventer un nouveau classement arbitraire des huit familles.
- L'utilisateur peut ouvrir **« Choisir mes badges de profil »** depuis son espace personnel ou « Badges et progression » et choisir/ordonner **jusqu'à trois badges parmi ceux qu'il a effectivement débloqués**.
- Les badges verrouillés ne peuvent jamais être affichés comme s'ils étaient acquis.
- Si moins de trois badges sont obtenus, n'afficher que ceux réellement disponibles ; prévoir un état vide discret.
- Les choix personnalisés sont persistants et exposés sur le profil dans le respect de la confidentialité.
- Sur le profil d'autrui, le bouton « Message » doit être disponible si les règles de permission le permettent.
- Éventuel détail d'un badge au tap : nom et distinction déjà acquise, sans divulguer les exigences des badges futurs.

### 8.3. Tests

- Trois badges les plus prestigieux affichés par défaut, déterministes ;
- choix personnalisé enregistré et restitué dans le même ordre ;
- suppression/désactivation d'un badge non autorisé ;
- profils privés ; profils sans badge ; mobile étroit ;
- bouton `+` de Story toujours utilisable et rien n'empiète sur lui.

---

## 9. PUBLICATIONS — CARROUSEL DE MÉDIAS SANS COMPTEUR

**Dernière décision : abandonner la mosaïque 2 × 2 des publications à quatre images.**

- Pour **2 à 4 médias** (photos et/ou vidéos selon les limites existantes), **une seule image ou vidéo visible à la fois** dans un **carrousel horizontal** ; balayage latéral pour passer au média suivant.
- Conserver l'ordre de publication choisi par l'auteur.
- Sous les médias, afficher uniquement les **petits points de pagination** indiquant l'élément courant.
- **AUCUN compteur numérique** du type `1/4`, `2/4`, ni dans l'image, ni en dehors, ni en haut à droite.
- Pour **un seul média**, pas de points de pagination inutiles.
- Conserver les proportions/recadrages raisonnables, la qualité des images, les interactions du post, les vidéos avec son désactivé par défaut et les commandes nécessaires.
- **Même composant de publication / même comportement dans le fil d'actualité et sur le profil**, y compris après repartage lorsque le post source est visible.
- Ne pas réintroduire la grille 2 × 2 parce qu'une maquette antérieure la montrait.

**Tests :** 1, 2, 4 médias ; mix photo/vidéo ; balayage tactile et clavier si applicable ; retour dans le fil ; points correctement synchronisés ; absence totale de compteur numérique.

---

## 10. ORDRE DE TRAVAIL RECOMMANDÉ

### Phase A — Audit et sécurisation (obligatoire en premier)

- Inspecter le dépôt actuel et les changements locaux sans perte.
- Lire les références accessibles et construire la **matrice initiale des états**.
- Exécuter les tests existants, séparer échecs préexistants des régressions ; investiguer l'ancien **timeout intermittent de check-in** plutôt que masquer le test par une hausse arbitraire de délai.
- Relever les points déjà terminés et les dépendances.

### Phase B — Corrections UX et social, incrémentales

- Nettoyage précis de la Carte.
- Pictogrammes/statuts de carte si données déjà présentes.
- Profil : trois badges près de `Cocody, Abidjan` ; choix personnalisable.
- Publications : carrousel sans compteur.
- Story → DM, profil → DM, partages → DM ; repartage dans le fil.
- Rappels menu / Stories / grand `+` / collection de badges : compléter **seulement ce qui manque**.

### Phase C — Données et cartographie

- Modèles source OSM / lieu CHKPT / import idempotent / anti-doublons.
- Style de Carte CHKPT et rendu des repères ; migration ou adaptation progressive de la bibliothèque cartographique avec repli fonctionnel.
- Contrôle des licences, mentions et services gratuits avant toute exploitation au-delà du prototype.

### Phase D — XP rétroactifs et recette de bout en bout

- Statut check en attente, validation d'un lieu, crédit idempotent, notifications, intégrité et cas frauduleux.
- Scénarios de démonstration multi-comptes, protection des données et tests de non-régression.
- Captures réelles du prototype **après** implémentation, distinctes des images d'intention générées.

**Ne pas interrompre la mission pour demander quelle phase effectuer :** suivre cet ordre, réorganisable seulement pour respecter les dépendances techniques. Si certaines parties dépendent d'un service externe, livrer le maximum vérifiable localement et décrire précisément le reste.

---

## 11. MATRICE DE RECETTE MINIMALE À PRODUIRE

Pour chaque ligne ci-dessous, renseigner **l'état initial** et **l'état final**, avec fichiers, tests exécutés et résultats :

| ID | Fonction à auditer | Critère de réussite |
|---|---|---|
| R01 | Conservation du travail local | Aucun commit/modification perdu ; branche identifiée |
| R02 | Navigation basse | Accueil · Carte · grand `+` · Sortir · Messages |
| R03 | Bouton central | « Faire un check » et « Créer une publication » fonctionnels |
| R04 | Menu latéral | Neuf entrées exactes, Messages absent du menu, accès Profil |
| R05 | Stories | Emplacement exact et défilement non sticky, privacy et 24 h |
| R06 | Collection de badges | Huit familles, détails corrects, verrouillés anonymes |
| R07 | Carte / outils | Cinq « Centrer » retirés, « Outils carte » et radar conservés |
| R08 | Carte / texte démo | Bloc bas gauche retiré sans supprimer les contrôles de check |
| R09 | Catégories de lieux | Pictogrammes distincts visibles et filtrables |
| R10 | Statuts de lieux | Non vérifié gris / vérifié vert / sponsorisé halo rouge |
| R11 | Fond de carte CHKPT | Libellés commerciaux concurrents masqués, carte utilisable |
| R12 | Données OSM | Import reproductible, attribution et provenance |
| R13 | Base CHKPT | Fiche canonique, suggestions, prévention des doublons |
| R14 | Checks sur lieu non vérifié | Check enregistré, aucun XP immédiat |
| R15 | XP rétroactifs | Crédit à validation du lieu, une seule fois, checks admissibles |
| R16 | Messages depuis profil | Conversation ouverte si autorisée |
| R17 | Réponse Story en DM | Réponse privée avec référence et permissions respectées |
| R18 | Partage en DM | Publication/lieu/événement visible en carte autorisée |
| R19 | Repartage dans le fil | Attribution et permissions de l'auteur d'origine |
| R20 | Partage externe | Lien ou partage natif réel, pas d'application factice |
| R21 | Trois badges sur profil | Trois petits symboles à droite de localisation, même ligne |
| R22 | Choix de badges | Sélection persistante parmi les badges obtenus |
| R23 | Média de publication | Carrousel horizontal, points uniquement, jamais `1/4` |
| R24 | Recette de démonstration | Parcours complets sans régression, données démo identifiées |

Inclure les cas négatifs : absence de permissions, compte privé, Story expirée, lieu rejeté, répétition de crédit XP, doublon OSM, petit écran, panne du fournisseur cartographique.

---

## 12. LIVRABLES ET FORMAT DE RETOUR À L'UTILISATEUR

À la fin de la mission (ou de la portion réellement réalisable dans l'environnement actuel), fournir **dans la conversation Codex** :

1. **Résumé factuel des éléments déjà en place** : les points « faits et testés » **avec preuves**, pour ne pas les redévelopper.
2. **Résumé des modifications apportées** : par module et fichiers principaux, avec raison de chaque modification.
3. **Tableau de recette R01–R24** : `Avant / Après / Preuve de test / Reste à faire` ; les tests non exécutés doivent être marqués comme tels.
4. **Commandes de lancement et de test du prototype**, conformes au dépôt actuel, et éventuelles variables de configuration **sans révéler de secrets**.
5. **Migrations et imports** : procédure reproductible et réversible lorsque possible, sans modifier silencieusement la production.
6. **Problèmes ouverts / arbitrages réels** : uniquement ceux qui restent impossibles à résoudre sans décision produit, autorisation externe ou infrastructure.
7. **Captures des écrans clés actualisés** lorsque les outils locaux le permettent : Carte (repères), Profil (trois badges près du lieu), publication (carrousel), Messages avec réponse Story, collection de badges.

**Formulation attendue :** « déjà présent et testé », « déjà présent mais testé maintenant », « corrigé/implémenté puis testé », « impossible à valider dans cet environnement ». Ne jamais écrire « tout est terminé » si des tests ou une intégration ne l'ont pas confirmé.

### Ce que le porteur doit pouvoir comprendre à la lecture du bilan

- Qu'est-ce qui était **déjà développé** ?
- Qu'est-ce qui était **déjà testé** ?
- Qu'est-ce qui a été **ajouté ou corrigé maintenant** ?
- Qu'est-ce qui reste **réellement à faire** ?
- Quelle est la **prochaine étape de développement justifiée** par le code et les tests ?

---

## 13. PRIORITÉ DES DÉCISIONS EN CAS DE CONFLIT

Si une ancienne capture, un ancien Markdown ou une implémentation existante contredit un point ci-dessous, **ce document prévaut sur ce point précis** :

1. Le panneau « Outils carte » **reste** ; seuls les raccourcis « Centrer [commune] » et le bloc de texte bas gauche sont retirés ; « Mon radar · 250 m » **reste**.
2. Repères distincts par catégorie ; **gris** non vérifié / **vert** vérifié ; **halo rouge** sponsorisé quelle que soit sa vérification.
3. Lieu non vérifié **checkable**, sans XP immédiat ; **XP rétroactifs après vérification et contrôle d'admissibilité**.
4. Carte personnalisée sur une infrastructure externe/gratuite pour commencer ; base de lieux CHKPT **distincte** alimentée notamment par OSM ; infrastructure cartographique propre **plus tard**.
5. Réponse à une Story **en DM** ; accès DM aussi depuis le profil ; contenu partageable en DM.
6. **Le repartage de la publication d'autrui dans son propre fil est autorisé**, ainsi que DM et partage externe.
7. Profil clair et compact ; **trois petits badges immédiatement à droite de « Cocody, Abidjan » sur la même ligne**, et non sous la photo où se trouve déjà le `+` de Story ; badges personnalisables parmi les débloqués.
8. Publications multi-médias en **carrousel horizontal**, avec **points de pagination mais aucun compteur numérique**.

**Fin du cahier de mission : auditer, compléter, tester et rendre compte dans la même conversation Codex, sans reprendre depuis zéro.**
