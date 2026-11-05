# CHKPT — Audit de reprise et plan de modifications

Date : 5 novembre 2026. **Livrable de diagnostic uniquement : aucun changement fonctionnel effectué.**

## 1. Conclusion

La base existante est substantielle et réutilisable. Comptes, publications, médias, stories, visites, progression, profils, relations, recherches et contrôles serveur existent. Le parcours UX du 5 novembre n'est toutefois pas encore livré : navigation et en-têtes anciens, Carte encadrée, partage principalement externe, messagerie texte sans cartes de fiches, éditeurs séparés.

Il faut relier et adapter ces modules, sans reconstruire l'application. Le principal chantier concerne la navigation et les transitions entre les modules ; ce n'est pas une nouvelle stack ni un nouveau backend. La réussite des tests historiques ne prouve pas l'application de ces décisions nouvelles.

**Priorité recommandée après cet audit : lot 0 de référence/version, puis lot 1 de navigation et en-têtes.** Les choix de cadence publicitaire, de catalogue final des badges et de messagerie publique ne doivent pas retarder ces changements UX explicites.

## 2. Sources et périmètre de la vérification

Références utilisateur conservées à l'identique :

- [Récapitulatif UX du 5 novembre](references/2026-11-05/CHKPT_RECAP_UX_DEMONSTRATION_CONVERSATION_CENTRALE_2026-11-05.md), prioritaire sur navigation, en-têtes, menu, Carte, partage et Messages.
- [Récapitulatif complet du 5 novembre](references/2026-11-05/CHKPT_RECAP_COMPLET_CONVERSATION_CENTRALE_2026-11-05.md), contexte et registre des arbitrages.

Les consignes, plans et messages à transférer figurant dans ces pièces ont été lus comme références ; l'autorisation actuelle porte uniquement sur l'audit et le plan, pas sur leur exécution automatique. Les documents originaux `03_CHKPT.md`, la fiche publicitaire finale, les fiches détaillées de badges et les six écrans de back-office ne sont pas joints à cette demande : les synthèses n'en prouvent pas tous les détails.

Inspection : `AGENTS.md`, `IMPLEMENTATION_STATUS.md`, README, références produit historiques, routes et composants front, état partagé, modèles/persistance, API sociales/check-in/médias/messages, sécurité de démo, scripts, tests serveur et navigateur. Comparaison du diff local depuis `main`, puis du lot postérieur à la référence fournie.

### Version exacte et PR

| Élément | Constat vérifié |
|---|---|
| Branche locale | `feat/profil-social`, arbre initial propre. |
| Référence donnée | `06896234ac419d8d91a1199d729f2efc258ab24a`, présente dans l'historique. |
| HEAD réellement examiné | `6c4652a311d180da4c6cdda084e6604ea40d4860`, lot messagerie/menu gauche. Ne pas revenir à `0689623` en perdant ce lot. |
| Diff `0689623..6c4652a` | 22 fichiers ; 206 insertions / 15 suppressions, guides binaires compris. API et écran DM, menu gauche, bouton Message des profils, migration des messages et tests. |
| Base locale `main` | `b8cfd43f0c9b74464662998ad483ff785fffbf93`. |
| Diff local `main...0689623` | 292 fichiers, 7 144 insertions / 2 109 suppressions ; inclut beaucoup de captures et documentation. Ce n'est pas un comptage de seules modifications métier. |
| Diff local `main...HEAD` | 297 fichiers, 7 335 insertions / 2 109 suppressions. Ensemble fonctionnel beaucoup plus large qu'un simple changement de profil. |
| PR #4 distante | Signalée ouverte par l'utilisateur. `git ls-remote` a reçu HTTP 502 ; API GitHub inaccessible via proxy HTTP 403. HEAD/base distants, état ouvert, revue, conflits et Actions actuelles **non confirmés**. |
| Publication de `6c4652a` | Lot connu localement comme non publié. Pas de preuve distante nouvelle dans cet audit ; aucun push effectué. |

Le diff local sert de comparaison technique disponible, **pas de substitut prétendument exact au diff actuel de la PR distante**. Aucune fusion, modification de `main`, création de ressource payante ni manipulation de la base de présentation.

## 3. Légende de la matrice

- **Déjà implémenté** : mécanisme présent dans le code ; portée de vérification précisée.
- **Partiellement implémenté** : éléments existants mais parcours incomplet.
- **Simulé** : données ou effet de démonstration, pas service réel équivalent.
- **Absent** : pas de mécanisme correspondant trouvé dans le périmètre examiné.
- **Contradictoire** : comportement actuel opposé à une décision UX explicite récente ; ce n'est pas nécessairement un bug de l'ancienne version.
- **À vérifier** : point non tranché par inspection et essais disponibles, ou nécessitant appareil/service réel.

Les statuts ne sont pas exclusifs : une simulation peut être réellement implémentée et testée. Pas de pourcentage trompeur de « prototype terminé » à partir de ce tableau.

## 4. Matrice — navigation et interface

| Référence attendue | État actuel | Preuve et modification minimale |
|---|---|---|
| Accueil / Carte / ＋-Check / Sortir / Messages | **Contradictoire** | `BottomNav.tsx` conserve Profil en cinquième entrée ; Messages est une page secondaire. Changer l'onglet, conserver la route du profil et les anciens liens. |
| Capsule flottante détachée des bords | **Contradictoire** | Barre actuelle pleine largeur, collée au bord inférieur ; transformer le contenant, conserver les actions et zones tactiles. |
| Onglet actif : couleur + point bordeaux | **Déjà implémenté** | `BottomNav.tsx`, à conserver sur la nouvelle composition. |
| ＋ ouvre Faire un check / Créer une publication | **Absent** | L'action centrale ouvre directement `CheckinModal`. Ajouter un panneau d'actions compact sans refaire le moteur de check. |
| Symbole CHKPT uniquement en haut d'Accueil | **Contradictoire** | `App.tsx` monte le même `Header` sur tous les écrans, symbole compris. En-tête contextualisé nécessaire. Le symbole central existant n'est pas arbitrairement supprimé par une règle portant sur les en-têtes. |
| Menu fin à gauche et avatar ouvrant son profil | **Partiellement implémenté / contradictoire** | Bouton menu actuel à droite ; pas d'avatar dans le Header. Réutiliser l'identité et la navigation profil existantes. |
| Pas de cloche ; puce chiffrée sur menu uniquement | **Contradictoire** | `Header.tsx` affiche une cloche et un point, pas un nombre sur menu. Réutiliser `unreadNotificationsCount`. |
| Deuxième ligne Pour toi / Amis + localisation seule | **Partiellement implémenté / contradictoire** | Deux onglets corrects ; GPS avec commune permanente dans le Header, contrôles séparés du fil. Déplacer l'accès de zone et masquer le libellé permanent. |
| Pas de Tendances dans Accueil | **Déjà implémenté** | Deux onglets seulement dans `FeedView.tsx`. Ne pas réintroduire Tendances depuis le récapitulatif maître historique. |
| Pas de barre de rédaction avant le fil | **Contradictoire** | Carte « Qu’as-tu découvert à… ? » encore présente ; déplacer son accès vers ＋ en réutilisant le contenu de l'éditeur. |
| Deux lignes d'en-tête masquées ensemble en descendant, retour immédiat en sens inverse | **Absent** | Header sticky sans gestion directionnelle commune aux onglets du fil. Prévoir seuil anti-tremblement et recherche active épinglée. |
| Loupe remplaçant toute la première ligne | **Absent / contradictoire** | `SearchBar` permanent sous l'en-tête ; aucune bascule de la première ligne. Réutiliser requête/suggestions/filtres plutôt que les réécrire. |
| Suggestions temporaires, résultats et filtres réutilisables | **Déjà implémenté** | `SearchExperience.tsx`, `FilterPanel.tsx`, routes search et contexte. Présentation récente des résultats encore à préciser ; garder par défaut les pages déjà validées. |
| Menu venant de gauche avec photo ronde et nom | **Déjà implémenté localement** | `SideMenu.tsx`, lot `6c4652a`, bord gauche mesuré à 0 px. |
| Identité du menu : avatar + nom + identifiant cliquables vers profil | **Partiellement implémenté** | Avatar et nom présents, pas d'identifiant affiché ni lien sur le bloc ; « Mon compte » ouvre la connexion/gestion du compte. |
| Ouverture/fermeture par glissement de bord | **Absent** | Aucun gestionnaire de geste du menu ; gérer le conflit avec retour iOS et déplacement Leaflet. Croix et fermeture par zone externe déjà présentes. |
| Notifications dans le menu, consultation puis ouverture du contenu et lecture | **Partiellement implémenté / contradictoire** | Centre et marquage lus existants, accès par cloche ; clic sur une notification appelle seulement `markNotificationAsRead`, sans ouvrir sa cible. Modèle possède déjà `targetType/targetId`. |
| Profil compact, publications rapidement visibles | **Déjà implémenté** | `ProfileView.tsx`, grande photo dans le contenu, fil sans couverture envahissante. |
| Sur son profil : Retour, pas de menu/avatar/symbole dans l'en-tête | **Contradictoire** | Profil encore onglet principal, Header global toujours visible ; la variante page issue d'une recherche ajoute Retour sans retirer ce Header. |
| Retour navigateur et conservation de contexte | **Déjà implémenté / à étendre** | `Navigation.tsx` : hash, historique, scroll/focus, pages gardées montées, protection au changement de compte. Ajouter Messages comme onglet sans casser cette logique. |

## 5. Matrice — Carte, fiches, check et publication

| Référence attendue | État actuel | Preuve et modification minimale |
|---|---|---|
| Fond interactif, déplacement, zoom et radar 250 m | **Déjà implémenté** | Leaflet dans `DynamicMap.tsx`, position et cercle ; tuiles OpenStreetMap externes, secours illustré disponible. Ce n'est pas une preuve GPS de production. |
| Carte bord à bord, commandes flottantes et centre supérieur dégagé | **Contradictoire** | `App.tsx` contraint main à `max-w-4xl`, Header opaque ; MapView a recherche/bandeaux et hauteur minimale 720 px. Recomposer les contenants sans remplacer Leaflet. |
| Vérifié vert / non vérifié gris | **Contradictoire pour Leaflet / partiel** | Repères dynamiques bleus ou bordeaux selon sélection, sans couleur de validation ; carte illustrée distingue déjà les statuts. Harmoniser les deux, avec libellés accessibles. |
| Capsules de catégorie et recentrage flottant | **Partiellement implémenté** | Filtres et centrages/radar existent, mais dans des bandes de commandes ; conserver leurs actions et revoir la disposition. |
| Repère → aperçu compact → Voir le lieu → fiche page | **Partiellement implémenté** | Aperçu avec photo/localisation et bouton « Détails », puis fiche normale. Une fiche est déjà présélectionnée à l'ouverture même sans toucher un repère ; préciser cet état et remplacer le libellé. |
| Sélection d'un autre repère et mise en évidence | **Déjà implémenté** | `selectedPlaceId`, couches et aperçu ; préserver filtrage et état vide. |
| Même cadrage/zoom au retour | **Partiel / à vérifier dans les nouveaux parcours** | Composant conservé monté entre pages/onglets ; centre/zoom détenus par l'instance Leaflet, pas sauvegardés explicitement. Passage au secours sur erreur de tuile démonte cette instance et perd ce cadrage. |
| Fiche lieu complète, galerie, enregistrer, avis, partage | **Déjà implémenté / partiel** | `PlaceDetailModal.tsx` est désormais une page malgré son nom, avec galerie, favoris et `ReviewSection`. Partage seulement externe ; en-tête global empêche le plein écran UX voulu. |
| Faire un check depuis la fiche, lieu prérempli | **Absent / contradictoire** | Ancienne règle « central uniquement » appliquée : pas de bouton sur la fiche ; `CheckinModal` ne reçoit plus de lieu préselectionné. Nouvelle décision UX autorise explicitement ce parcours. Ne pas remettre de raccourci sur les publications. |
| Sélection, visibilité, confirmation et publication facultative | **Déjà implémenté** | CheckinModal + moteur serveur ; résultat, Plus tard et suivi de publication. Ne pas refaire la validation. |
| Rayon, validation quotidienne et pas de double XP | **Déjà implémenté** | `server/checkinEngine.ts`, preuves isolées, PointsLedger et reprise réseau ; contrôles serveur à conserver dans chaque lot. |
| Position simulée annoncée ; sélection de commune ne crée pas de visite | **Implémenté / simulé** | Simulation explicitement autorisée par serveur privé ; sélection de position ne déclenche pas `/api/checkins`. Séparer l'exploration de zone du choix de position de preuve pour éviter une future ambiguïté. |
| GPS réel fiable et anti-fraude de production | **À vérifier / incomplet pour production** | Coordonnées du navigateur et contrôles de distance ne prouvent pas l'authenticité d'une position. Le refus GPS peut basculer le Store en simulation ; garder une information explicite. |
| Proposer un lieu absent puis validation humaine | **Partiel / simulé** | Formulaire et console de propositions locaux ; pas de circuit serveur complet transformant une proposition validée en fiche canonique vérifiée. Ne pas annoncer un workflow opérationnel. |
| Même éditeur depuis ＋, après check et depuis partage | **Absent comme composant commun** | Deux formulaires dans FeedView et CheckinModal, composants de médias/audience communs. Extraire un éditeur sans changer les contrats de confidentialité. |
| Brouillon conservable au départ de l'éditeur | **Partiel / contradictoire** | Check : continuer ou abandonner ; pas d'option de conservation explicite. Fil : Annuler efface texte/médias. États locaux gardés tant que composant monté, pas une politique de brouillons. |
| Quatre images/vidéos maximum, audiences, médias protégés | **Déjà implémenté** | Uploader, SafeImage/SafeVideo, API médias/posts. Préserver la limite demandée auparavant ; le nouveau document ne l'annule pas. |
| Publication liée à lieu ou événement sans fausse présence | **Partiel / absent pour événement** | Modèle Post comporte `linkedPlaceId` et `linkedCheckinId`, pas de carte événement partagée. L'API ne crédite pas une publication libre comme un check. Ajouter la référence d'entité validée, sans preuve ni coordonnées privées. |
| Likes, commentaires, auteur et lieu cliquables | **Déjà implémenté** | `PublicationCard.tsx`, Store et API ; permissions réelles. |
| Enregistrer une publication | **Partiel / ambigu** | Le signet actuel enregistre le lieu associé, **pas la publication** ; absent si post libre. Besoin d'une collection de publications enregistrées distincte et d'un libellé non trompeur. |
| Stories 24 h et accès par avatars | **Déjà implémenté** | UI et API stories ; conservation demandée, pas de suppression pour simplifier les nouveaux en-têtes. L'avatar personnel du petit en-tête doit ouvrir directement le profil ; garder l'accès story dans le contenu. |

## 6. Matrice — partage, Messages, Sortir et données

| Référence attendue | État actuel | Preuve et modification minimale |
|---|---|---|
| Partage lieu : panneau bas, deux rangées horizontales | **Absent / contradictoire** | PlaceShare tente d'abord `navigator.share`, sinon panneau en haut à droite ; pas de rangée interne. Construire un panneau commun lieu/événement. |
| Rangée interne : Publier dans mon fil puis avatars amis | **Absent** | Aucun flux de partage vers éditeur ou DM ni liste directe des amis dans le partage. |
| Rangée externe : copier, applications disponibles, Plus | **Partiellement implémenté** | Copie, feuille native, WhatsApp et e-mail ; pas la composition finale. SMS et autres cibles dépendent du téléphone ; ne pas garantir Instagram/Messenger. |
| Messages : conversations texte privées persistantes | **Déjà implémenté localement** | `MessagesPage.tsx`, `server/messages.ts`, migration de la table messages. Deux participants authentifiés ; ni conversation publique ni serveur de messagerie à reconstruire. |
| Messages en cinquième onglet et compteur global non lu | **Absent** | Uniquement page via menu/profil ; non-lus par conversation dans la liste, pas compteur de barre bas. Nécessite état partagé avec séparation du compteur des notifications. |
| Choisir un ami, prévisualiser une fiche et confirmer l'envoi | **Absent** | API DM accepte texte uniquement ; aucune pièce structurée de type lieu/événement. Ajouter un contrat versionné compatible avec les messages existants. |
| Carte reçue cliquable → fiche → même conversation/position | **Absent / à vérifier pour scroll** | Pas de rendu de carte. `MessagesPage` appelle `scrollIntoView` en revenant visible ou quand le nombre de messages change ; risque de forcer le bas malgré la restauration générale. Ce risque provient du code, pas d'une reproduction chiffrée du saut. |
| Conversations fictives prêtes à présenter | **Absent en seed DM** | Table messages initialement vide ; les quatre personas existent déjà. Ajouter un jeu synthétique idempotent, sans toucher les messages personnels. |
| Notifications d'activité : like/commentaire et cible | **Partiel / simulé** | Notifications locales par propriétaire, progression et boutons de simulation check ami/événement. Pas de circuit serveur général produisant les likes/commentaires entrants et leur navigation. |
| Sortir éditorial sans onglets supplémentaires | **Déjà implémenté / partiel** | Sélections et événements, recherche contextuelle ; mise en avant actuelle surtout textuelle, pas la grande ouverture illustrée finale. |
| Articles lisibles avec lieux cités cliquables | **Absent** | Pas de modèle d'article, route ni page de lecture. Ajouter quelques articles fictifs ciblés, pas un CMS de production. |
| Fiche événement avec intention, enregistrer et partager | **Partiel** | EventDialog page et intentions présentes ; pas d'enregistrement ni de partage de fiche événement. Intention conservée localement par compte et appareil. |
| Historique des lieux et XP totaux privés ; badges publics accessibles selon permissions | **Déjà implémenté** | API et vues dédiées ; conserver la règle plus stricte de propriétaire seul pour l'historique. Le récapitulatif général n'autorise pas à l'ouvrir. |
| Badges serveur et sélection progressive | **Implémenté / simulé pour base démo / à consolider** | 40 paliers provisoires, 8 familles, 5 grades techniques ; sélection UI limitée à six, baseline fictive et notifications de déblocage. Sélection réduite ne signifie pas encore une introduction contextuelle UX complète. |
| Classement et récompenses | **Implémenté / simulé / à arbitrer** | Classement mensuel Amis/Global du menu (jusqu'à 100), total personnel privé. Récompense locale fictive sans paiement ; QR partenaire réel non livré. Top 20 est une référence historique non arbitrée. |
| Publicités identifiées, non cliquables, jamais sur Carte | **Déjà implémenté / simulé** | Marques et slogans fictifs, contrôle serveur de la bière pour adultes. Accueil : première puis chaque 5 publications. Sortir : pas de bannières présentes dans SortirView. Cadence exacte ouverte. |
| Données conservées entre appareils du même serveur | **Implémenté, portée limitée** | JSON persistant, posts/médias/visites/favoris lieux/DM partagés ; intentions, préférences et notifications principalement locales. Pas une garantie de conservation sur hébergement gratuit éphémère. |
| Accès privé distant et démonstration en ligne | **Préparé / à vérifier** | Garde serveur et configuration Render gratuits présents. Aucun nouveau service ni lien de démo accessible à distance constaté/créé dans cet audit. Ne pas confondre dépôt public et application accessible. |
| Rôles, mineurs, reset et sauvegarde | **Déjà implémenté, à préserver** | Restrictions serveur, reset opérateur confirmé, sauvegarde chiffrée, restauration et migrations. Pas de certification de production ; console et métriques partiellement fictives. |

## 7. Observations exécutées et valeur des tests

### Constat ciblé de la nouvelle UX

[Mesures JSON à 390 et 1280 px](audits/2026-11-05/observations-ux.json), Chromium, build actuel, serveur/base temporaires et tuiles bloquées volontairement pour observer le secours illustré. Aucun reset de la base de démonstration.

Aux deux tailles : Profil présent et Messages absent de la barre basse ; cloche présente ; commune permanente ; recherche et rédaction visibles avant activation ; menu bien à gauche mais sans identité cliquable ni Notifications ; central ouvrant directement le check sans choix de publication ; Header et symbole présents sur Carte ; pas de Faire un check sur la fiche. À 1280 px, main de Carte mesuré à 896 px : ce n'est pas bord à bord. L'aperçu « Détails » est déjà présent avant le premier appui sur repère.

Ces mesures reproduisent des **écarts de conformité**, sans modifier le code pour les « corriger » pendant l'audit. Les couleurs des repères Leaflet sont établies par lecture de leur génération, pas par cette mesure du mode illustré. Aucun essai réel des applications de partage, des gestes iOS ou du GPS terrain.

### Vérifications de la base existante

- `npm run lint` : réussi le 5 novembre.
- `npm run build` : réussi le 5 novembre.
- `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser` : **échec de cette exécution complète**, après **26 groupes terminés avec succès**, au groupe 27, `tests/lot_a_browser.ts:37`, clic « Confirmer le check », délai de 10 secondes dépassé en 1280 px. Le sous-parcours 390 px avait réussi. La suite historique de 11 tests comprise dans ces groupes a réussi.
- Réexécution ciblée du seul `checkBrowser`, serveur/base temporaires neufs : **390 px et 1280 px réussis**, sans changement de code ni allongement du délai. Cela révèle une instabilité à investiguer, pas une cause établie ni un défaut corrigé. Une charge concurrente, une interaction focus/scroll ou le navigateur sont des hypothèses, pas un diagnostic prouvé.
- Les groupes **28 à 45 n'ont pas été exécutés dans cette relance complète interrompue**. Leur validation du 2 novembre reste historique, notamment les DM, médias et stories navigateur.
- Journaux : [exécution complète interrompue](audits/2026-11-05/non-regression.txt), [parcours check ciblé](audits/2026-11-05/check-cible.txt). Aucun résultat « 45/45 actuel » annoncé.
- Historique : 45/45 annoncé au lot du 2 novembre ; distingué de la nouvelle exécution.

Même une suite entière verte confirme l'ancien contrat testé, pas les critères UX du 5 novembre. Aucun test existant ne doit être supprimé uniquement parce qu'il révèle une régression métier.

| Tests existants à réutiliser | Adaptation future, pas faite dans cet audit |
|---|---|
| `lot_a.test.ts`, `security_and_checkin.test.ts`, tests serveur de stories et données partagées | Garder les refus de droits, 250 m, doublons, audiences, migrations, sauvegarde, isolation des médias. |
| `visual_direction_browser.ts`, `feed_browser.ts`, `profile_browser.ts` | Remplacer les attentes de cloche/commune permanente/Profil bas et rédaction intégrée par le contrat récent. Conserver thèmes, petit écran, contenus et publication. |
| `navigation_search_browser.ts`, `place_browser.ts`, `radar_browser.ts` | Tester profil hors barre, recherche d'en-tête, plein écran, couleurs, aperçu préalable, caméra au retour et gestes. |
| `share_history_browser.ts`, `messages_browser.ts` | Étendre au panneau deux rangées, envoi de carte, compteur distinct, tiers refusé, entité indisponible et conservation du scroll. Historique toujours privé. |
| `presentation_browser.ts`, `edge_cases_browser.ts`, `support_browser.ts` | Actualiser la séquence sans perdre reprise réseau, cache corrompu, séparation comptes, clavier/focus et support hors connexion. |

## 8. Décisions acquises et arbitrages encore ouverts

### Décisions explicites à appliquer au prochain lot

Messages remplace Profil en bas ; menu et avatar d'accès direct au profil ; symbole seulement sur Accueil ; notifications dans menu avec compteur distinct ; recherche remplaçant la première ligne ; en-tête directionnel commun à deux lignes sur Accueil ; localisation sans commune permanente ; Carte immersive et aperçu avant fiche ; check autorisé depuis une fiche préremplie ; ＋ avec deux actions ; éditeur commun et proposition de conservation du brouillon ; partage en deux rangées dans l'ordre donné ; fiche cliquable dans Messages ; retours conservant l'état.

Les règles AGENTS historiques « Profil en bas », « GPS avec commune et cloche en haut », « central seul point d'entrée » sont donc obsolètes **sur ces points précis**. Au lot 0, les annoter/remplacer de façon ciblée ; ne pas supprimer les autres protections ou réécrire tout le document.

### Questions ouvertes, sans changement silencieux

| Sujet | Sources en présence | Proposition pour la démo, à distinguer d'une décision définitive |
|---|---|---|
| Cadence publicitaire | Demande précédente appliquée : début puis 5 posts ; synthèses : historique de 10 à réconcilier ; Sortir historique par 3 rubriques/cartes. | Conserver 5 sur Accueil pendant les lots UX. Ajouter les emplacements Sortir après choix de cadence. Ne pas « corriger » automatiquement vers 10. |
| Badges et grades | Code : 40 paliers, 8 familles × 5 grades provisoires ; synthèse : Bronze/Argent/Or/Prestige évoqués, sans distribution des 40. | Garder moteur/données/barème étiqueté provisoire et sélection réduite. Ne pas convertir les grades ni recalculer les XP existants. |
| Messagerie publique | Expérience de démo approuvée ; lancement public non décidé. Restriction majeure/public du lot existant = choix technique de prototype. | Garder ces restrictions serveur. Définir séparément consentement, privés, mineurs, blocage/signalement, conservation et exploitation avant ouverture réelle. |
| Amis dans le partage | Classement = réciproques + soi ; fil Amis = suivis ; document partage ne définit pas la population. | Choisir explicitement réciproques, suivis ou contacts récents avant généralisation. La démonstration peut utiliser des relations synthétiques adultes réciproques. |
| Barre basse sur fiches, conversations et éditeur | Document UX laisse cette visibilité ouverte. | Proposition : visible sur espaces principaux, masquée dans éditeur/conversation au clavier ; détailler la règle avant lot 1 et la tester. |
| Ordre complet du menu | Notifications actées ; autres entrées proposées dans le document, plusieurs déjà validées dans notre historique. | Conserver les accès existants, ajouter Notifications, pas de classement dans Sortir. Valider seulement ordre/regroupements. |
| Résultats de recherche | Mode d'entrée figé ; présentation détaillée/contextes laissés ouverts. | Préserver les pages de résultats et portées Accueil/Carte/Sortir déjà réalisées ; seule l'entrée change. |
| Brouillons | Proposer de conserver est retenu ; durée, persistance et règles médias ouvertes. | Proposition : brouillon par compte/session, références des médias importés, jamais un cache partagé entre comptes ; pas de promesse après fermeture tant que non spécifié. |
| Enregistrer | Publications demandées ; code sait seulement enregistrer un lieu ; événements encore absents. | Distinguer types dans Enregistrés, avec actions et permissions explicites. Ne pas transformer les favoris lieux en favoris publications par migration. |
| Classement | Demande précédente mensuel/réciproques ; synthèse évoque Top 20 historique. | Garder mensuel et permissions ; limite de liste à confirmer sans toucher aux scores. |
| Texte seul/photo seule, avis après check | API texte requis, avis via ReviewSection ; détails UX non figés. | Réutiliser avis existants et préciser les raccourcis après check ; garder la limite de quatre médias. |
| Authentification et back-office | Pas de nouvelles règles opérationnelles complètes ni six écrans source joints. | Préserver les contrôles actuels ; pas de back-office de production ou rôle supplémentaire inventé. |

Ces questions n'exigent pas toutes une réponse immédiate. Avant les lots concernés, présenter une petite décision concrète plutôt qu'un questionnaire bloquant l'ensemble.

## 9. Composants à conserver et réutiliser

| Base réutilisable | Usage minimal prévu |
|---|---|
| `Navigation.tsx`, App et PageLayout | Étendre les routes/onglets et variantes d'en-têtes ; conserver liens existants, retour, focus, scroll et séparation de compte. |
| Header, SideMenu, BottomNav | Changer composition et déclencheurs ; réutiliser compteurs, identité, thème et accès personnels. |
| SearchExperience, FilterPanel, GlobalSearch | Réutiliser moteur, suggestions, recherche validée et filtres dans le nouveau contenant. |
| MapView, DynamicMap, CategoryFilterBar | Même Leaflet, même radar et filtrage ; contenants immersifs, statut des repères, caméra et aperçu. |
| PlaceDetailModal, EventDialog, ReviewSection | Garder fiches/pages, galerie, avis, intentions ; ajouter les entrées et partages manquants. Le nom de fichier Modal n'impose pas une fenêtre modale. |
| FeedView, CheckinModal, AudienceSelect, PostMediaUploader | Extraire un éditeur commun ; préserver imports, quatre médias, visibilité, contrôles et reprises de check. |
| PublicationCard, StoryAvatar, StoryStrip, SafeImage/SafeVideo | Garder rendus et interactions ; ajouter cartes d'entités/enregistrement de post sans changer les permissions des médias. |
| MessagesPage et server/messages | Ajouter référence de fiche et compteur global ; garder participants, anti-doublons, limites, refus des mineurs et migrations. |
| NotificationCenterModal, notificationService et cibles typées | Déplacer l'accès, réutiliser lecture ; ajouter résolution de cible, navigation et démo explicitement fictive. |
| server/social, db, auth, checkinEngine, badgeEngine, backup | Évolution additive des données, pas de remplacement du serveur ; sauvegardes et anciennes données compatibles. |
| Tests et supports de présentation | Adapter assertions UX, garder les tests métier ; régénérer les guides après les changements, pas avant. |

## 10. Lots proposés, isolables et vérifiables

Chaque lot doit pouvoir être relu et testé séparément. Les dépendances ci-dessous rendent explicite l'ordre d'intégration ; « indépendant » ne signifie pas que le partage peut fonctionner sans contrat Messages. Aucune exécution de ces lots n'est commencée dans cet audit.

### Lot 0 — Référence de reprise et protection de la base

**Fichiers :** AGENTS, IMPLEMENTATION_STATUS, DECISIONS_TECHNIQUES, références datées, tests de migration/backup ; métadonnées de PR si accès disponible.

**Changement minimal :** acter les seules substitutions UX, conserver `6c4652a`, vérifier le vrai HEAD de PR quand GitHub répond ; documenter les contrats des entités partagées. Sauvegarder avant une future mise à jour de la vraie démo, jamais réinitialiser pour préparer le développement.

**Risques :** publier une version incomplète, repartir du ZIP `main` ou perdre les DM et données existantes. **Anomalie à qualifier avant les changements UX :** le timeout intermittent du clic de confirmation constaté dans la relance complète ; ne pas le masquer en augmentant simplement le délai.

**Acceptation/tests :** branche correcte, diff relu, scénario de clic instrumenté (trace, focus, scroll, requête/réponse) et origine de l’instabilité qualifiée, anciennes sauvegardes/migrations compatibles sur copie synthétique ; aucun secret versionné, aucun reset/push/merge automatique. **Dépendance :** aucune.

### Lot 1 — Navigation flottante, profil et menu contextualisés

**Fichiers :** App, Navigation, BottomNav, Header, SideMenu, PageLayout, ProfileView, types/styles ; tests navigation/profile/visual.

**Changement minimal :** Messages devient espace principal ; profil en page via avatar et identité du menu ; variantes d'en-tête, cloche retirée, Notifications dans menu, deux compteurs séparés ; capsule basse et geste latéral de bord avec alternative accessible au bouton.

**Risques :** liens anciens `tab=profile`, mauvaises piles Retour, fuites d'état entre comptes, conflit avec retour iOS et Leaflet, zones tactiles trop petites.

**Acceptation/tests :** cinq entrées attendues, point actif, pas de symbole hors Accueil, identité cliquable, retour profil vers origine, Notifications dans menu sans marquage au simple accès menu ; clavier/focus, 320/390/1280 px et gestes sur téléphone réel. Navigation utilisable sans geste. La route profil ancienne reste supportée ou migrée. **Dépendance :** 0. Le fonctionnement des cibles Notifications sera complété au lot 7.

### Lot 2 — Recherche d'en-tête, localisation et défilement Accueil

**Fichiers :** Header, FeedView, SearchExperience, GlobalSearch, LocationControls, Store, styles ; tests feed/search/visual.

**Changement minimal :** recherche prenant la première ligne, recherche active maintenue visible, deux lignes synchronisées au scroll ; zone par icône, suppression de l'accès de rédaction au-dessus du fil après disponibilité de l'éditeur via ＋.

**Risques :** saut de scroll, champ perdant focus avec le clavier, confusion zone explorée/position GPS, disparition des contrôles lors des suggestions.

**Acceptation/tests :** afficher au premier petit mouvement inverse sans tremblement ; saisie conservée après ouverture de résultat/Retour ; suggestions et filtres, barre basse toujours visible ; changer la commune ne crée ni visite ni XP et n'écrase pas silencieusement une preuve de position réelle. Garder stories et répertoire des profils fictifs accessibles sans surcharger la première ouverture. **Dépendance :** 1 ; retrait final de l'ancienne rédaction après 4.

### Lot 3 — Carte immersive et fiches en deux étapes

**Fichiers :** App/contenants, MapView, DynamicMap, CategoryFilterBar, PlaceDetailModal, PageLayout, styles ; tests radar/place/navigation.

**Changement minimal :** surface cartographique à l'écran, commandes flottantes, repères vert/gris et sélection distincte ; aperçu compact « Voir le lieu », caméra sauvegardée en mémoire de session et restaurée ; fiches sans Header principal redondant.

**Risques :** tuiles absentes, perte de cadrage au secours, commandes cachées derrière l'aperçu/capsule, capture des gestes de déplacement par le menu.

**Acceptation/tests :** déplacer/zoomer/recentrer, sélectionner deux lieux, aperçu laissant voir la carte, ouvrir fiche puis retrouver centre/zoom/sélection ; état vide et secours sans réseau, aucune publicité ; vérification textuelle et visuelle des statuts, statut commercial distinct. Tests mode illustré ET Leaflet ; pas seulement de captures statiques. **Dépendance :** 1 ; peut avancer séparément de 2.

### Lot 4 — ＋, check contextuel, éditeur commun et brouillon

**Fichiers :** App, nouveau panneau d'actions et éditeur commun, CheckinModal, FeedView, PlaceDetailModal, AudienceSelect, uploader, Store ; tests presentation/post_media/edge_cases.

**Changement minimal :** ouvrir choix check/publication ; réutiliser le moteur actuel, réintroduire un contexte de lieu fourni par fiche ; utiliser un même éditeur avec contexte libre/check/fiche et proposition de conserver un brouillon. Aucun champ client ne peut fabriquer une visite valide.

**Risques :** mauvaise présélection au deuxième lieu, double XP, audience publique implicite, média orphelin ou révélé, suppression du brouillon d'un autre compte.

**Acceptation/tests :** deux lieux successifs correctement envoyés ; check simulé signalé, refus hors rayon et doublon inchangés ; Plus tard sans publication ; quatre médias maximum ; audience héritée explicite, privés/mineurs protégés ; quitter/conserver/reprendre/abandonner, erreurs d'import/envoi, récupération sans double visite. Publication libre et partage : zéro nouvel événement de visite/XP. **Dépendance :** 1 ; contexte fiche raccordé à 3.

### Lot 5 — Messages : cartes d'entités, non-lus et retour stable

**Fichiers :** MessagesPage, server/messages, server/db, Store, types, composant commun de carte d'entité ; tests messages et snapshots/backup.

**Changement minimal :** message texte existant conservé, ajout facultatif d'une référence `place/event` validée côté serveur, cartes cliquables ; non-lus partagés avec l'onglet Messages ; défilement conditionné à la lecture en bas, pas forcé au retour ; quelques conversations fictives ajoutées sans doublon/perte.

**Risques :** fuite par aperçu de contenu, destinataire falsifié, double envoi après coupure, carte disparue, ancienne sauvegarde incompatible, compteur dépendant de la seule page ouverte.

**Acceptation/tests :** deux comptes/navigateurs, troisième refusé ; référence réelle/invalidée/supprimée, absence de jeton/coordonnées privées dans la carte, migration de texte seul ; incrément entrant/décrément à lecture, retour fiche/conversation au bon message et brouillon conservé ; lectures hors ligne/envoi incertain explicites ; restrictions actuelles maintenues. **Dépendance :** 1 et résolution des fiches existantes ; autonome vis-à-vis du panneau de partage.

### Lot 6 — Partage commun lieu/événement

**Fichiers :** PlaceShare remplacé/étendu par panneau commun, EventDialog, éditeur commun, MessagesPage/contexte d'envoi, API posts/messages/types, composant de carte.

**Changement minimal :** panneau bas à deux rangées, interne dans l'ordre imposé ; publication préremplie ou destinataire choisi avec confirmation ; copier et partage natif à la demande depuis la rangée externe. Proposer les applications réellement utilisables, pas simuler une réussite extérieure.

**Risques :** confusion partager/checker, liste d'amis non accessible, envoi avant confirmation, URL locale inutilisable à distance, fausse promesse de partage Instagram.

**Acceptation/tests :** ordre des rangées et avatars, annulation sans envoi, confirmation unique avec commentaire facultatif ; fiche reçue réouvrable, publication liée visible selon audience ; aucun check/XP créé ; liens sans secrets/historique ; refus d'accès et contenu devenu indisponible ; tests Android/iOS réels pour partage natif et repli copier. **Dépendances :** 4 et 5 ; population des destinataires à préciser avant raccordement final.

### Lot 7 — Sortir, enregistrés et notifications reliées

**Fichiers :** SortirView, EventDialog, nouvelles pages articles, PersonalPage, PublicationCard, NotificationCenterModal, Store, types/db/social/discovery selon contrats ; fixtures éditoriales.

**Changement minimal :** mise en avant illustrée, quelques articles fictifs avec liens de lieux, favoris distinguant lieux/posts/événements ; entrée Notifications et cibles cliquables, lecture/compteur fiables ; deux exemples fictifs like/commentaire pour le pitch. Les notifications de démonstration ne doivent pas inventer un service push serveur.

**Risques :** confondre enregistrer un post/un lieu, ouvrir un contenu privé depuis une notification, perdre les intentions, inventer un CMS ou une régie publicitaire hors périmètre.

**Acceptation/tests :** sauvegardes par compte avec changements réversibles ; retrouver article/fiche/intention après Retour ; notification ouvre la bonne cible puis diminue le compteur une seule fois ; cible indisponible correctement traitée ; menu ouvert seul ne lit rien ; aucun badge de notification sur avatar ; publicité hors Carte uniquement, cadence conservée/en attente d'arbitrage. **Dépendances :** 1 et 6 pour partage événement ; catégories d'enregistrés peuvent être livrées séparément.

### Lot 8 — Recette finale, supports et accès privé gratuit

**Fichiers :** tests navigateur/métier, docs, captures, guides JSON/PDF/PPTX, scripts de présentation, configuration d'accès privé existante si ajustement nécessaire.

**Changement minimal :** tester la séquence entière du document UX et les reprises, actualiser guides et support de secours ; préparer une mise en ligne privée avec service gratuit choisi et sauvegarde, sans achat ni compte créé automatiquement.

**Risques :** verts de tests fondés sur l'ancienne UX, clavier Safari recouvrant l'envoi, arrêt/sommeil de l'ordinateur, liens de réseau local, disque gratuit éphémère, exposition involontaire de la démo.

**Acceptation/tests :** recette mobile et desktop, vrais appareils Ingrid/Mac/Windows selon disponibilité, gestes/retours/rotation/clavier, deux comptes et plusieurs appareils, erreurs réseau/tuile et session expirée ; tous tests serveur conservés ; état des données fictives clair ; droits privés testés sur HTML/assets/API/médias ; sauvegarde-restauration vérifiée sur copie. Pas d'annonce « production prête ». **Dépendances :** lots fonctionnels retenus ; lancement distant exige un hébergement et des secrets locaux distincts, aucun abonnement payant.

## 11. Séquence de recette finale cible

Accueil Pour toi/Amis → scroll puis retour immédiat des commandes → recherche dans l'en-tête → Carte immersive → repère → aperçu → fiche → check prérempli et visibilité → confirmation simulée → publication ou Plus tard → retrouver sur profil via avatar → revenir au contexte → partager une fiche à un ami → Messages et carte cliquable → fiche puis retour à la même position → Notifications via menu → Sortir/événement/article et actions conservées.

Invariants mesurés sur toute la séquence : aucune publication automatique ; aucun check en explorant/partageant/publiant librement ; un seul crédit par visite admissible ; aucune exposition de visite privée/XP total/médias d'un autre compte ; aucune perte de publications, messages ou imports existants ; pas de publicité sur Carte ; simulation identifiée.

## 12. Limites et résultat de cette mission

Cette livraison produit le diagnostic, les références archivées et les observations ; elle n'applique aucun des lots proposés. Le code de l'application, les références techniques existantes et la base personnelle sont préservés. Pas de changement de stack, backend de production, fusion de PR, push ni déploiement. Les guides PDF/PPTX actuels décrivent encore l'ancienne UX et devront être régénérés au lot de recette, sans les présenter déjà conformes aux décisions du 5 novembre.
