# CHKPT by RED LOOP — Passation V3 pour nouvelle conversation et Google AI Studio

**Édition : 26 octobre 2026**  
**Archive de référence : `chkpt-by-red-loop (2).zip`**  
**Usage :** joindre ce Markdown et le ZIP dans une **nouvelle conversation** avec une IA capable de lire du code.  
**Finalité :** terminer un **prototype web mobile-first, interactif, haut de gamme et fiable**, pour la présentation du projet d'Ingrid à **FrancoTech Cocody** et les présentations de **RED LOOP** à des financeurs et partenaires.

> **Instruction essentielle :** le ZIP joint est le point de départ du code. Ne recrée pas l'application. Ce document transmet les décisions et un audit statique de cette version V3. **Vérifie toi-même toute observation dans les fichiers actuels, exécute les tests si possible et préserve chaque élément fonctionnel.** Ne transforme pas le projet en chantier de production complet.

---

## 1. Première tâche de la nouvelle conversation

1. Décompresse et inspecte intégralement le ZIP le plus récent, y compris `src`, `server`, `tests`, `package.json`, `.data`, `README.md`, `IMPLEMENTATION_STATUS.md` et `DECISIONS_TECHNIQUES.md`.
2. **Ne prends pas les affirmations de `IMPLEMENTATION_STATUS.md` pour des tests vérifiés.** Distingue : opérationnel et testé, implémenté mais non testé, simulé, incomplet et cassé.
3. Préserve le code React/Vite/TypeScript/Express existant, l'identité CHKPT, le contenu des interfaces et les progrès déjà acquis.
4. Évalue en priorité le scénario « découvrir un lieu → fiche → check-in → publication → badge → profil → événement → réinitialisation ».
5. Corrige les anomalies bloquantes **avant** d'ajouter d'autres fonctionnalités ou des animations décoratives.
6. Si le projet peut être exécuté, lance d'abord le build et les tests **sur une copie de la base de démonstration**, puis effectue des tests manuels du parcours.
7. Rends un résultat vérifiable : code corrigé ou ZIP modifié, journal des corrections, tests effectivement lancés, instructions de démonstration.
8. En cas d'absence de dépendances ou d'impossibilité d'exécution, annonce clairement cette limite, sans prétendre que les tests ont réussi.

**Ne pose pas de questions déjà résolues dans ce document.** Les choix techniques secondaires peuvent être faits et documentés lorsqu'ils sont réversibles.

---

## 2. Comprendre le produit sans ambiguïté

### RED LOOP

Structure mère et écosystème pouvant exploiter la plateforme, les outils professionnels, les partenariats, la régie publicitaire et l'administration. Dans cette phase, elle ne nécessite pas sa propre application distincte.

### CHKPT

Application sociale de découverte des restaurants, cafés, maquis, bars, lieux culturels, événements et expériences à Abidjan, destinée à être proposée ensuite dans toute la Côte d'Ivoire.

- **Nom :** CHKPT, prononcé « checkpoint ».
- **Slogan :** « Sors. Check. Partage. »
- **Porteuse du pilote de présentation :** Ingrid ; candidature/présentation FrancoTech Cocody.
- **Pilote :** contenu et référencement prioritaires à Cocody, mais **pas** d'interdiction d'explorer d'autres villes/communes.
- **Cible :** jeunes actifs, étudiants, habitants, personnes souhaitant découvrir et partager des sorties.
- **Principe :** découverte → sortie → check-in vérifié en produit réel / simulé en démo → publication facultative → progression et découverte partagée.
- **Positionnement :** **réseau social en premier plan** ; la carte et le check-in rendent les découvertes locales plus utiles.

### Identité visuelle validée

« Classy street / street chic premium » : jeunesse urbaine, élégante et énergique. **Bleu nuit + bleu clair lumineux + bordeaux + noir + blanc.** L'emblème validé est abstrait, géométrique, inspiré du passage et du mouvement, avec effet de relief/3D ; wordmark CHKPT personnalisé en complément. **Ne pas remplacer l'emblème par une épingle de carte générique.** Si les véritables assets ne sont pas dans l'archive, prévoir un emplacement remplaçable, sans inventer un logo officiellement validé.

### Navigation publique définitive

**Accueil — Carte — Check-in — Sortir — Profil**, dans cet ordre, avec Check-in au centre et visuellement mis en valeur.

- **Accueil :** onglets **Pour toi** et **Amis** ; publications libres (sans check-in obligatoire), photos/vidéos courtes, réactions, commentaires et sauvegardes ; bannière publicitaire au tout début et après chaque bloc de **10 publications**.
- **Carte :** recherche et filtres des lieux/événements ; statut vérifié **vert**, non vérifié **gris**, toujours doublé d'une indication textuelle ; fiches et check-in ; **aucune publicité**.
- **Check-in :** choix lieu → contrôle de présence → confirmation ou refus → proposition **facultative** de publier ; aucune publication automatique. Des XP seulement après une visite validée par les règles actives. En démo, la position est **clairement simulée**.
- **Sortir :** Aujourd'hui, Ce week-end, En ce moment, guides, événements, intention « Ça m'intéresse » et « J'y serai » ; bannière initiale puis toutes les **3 rubriques** et au sein des rubriques toutes les **3 cartes**.
- **Profil :** publications au cœur du profil ; visites, favoris, XP, badges, relations et visibilité choisie.

**Autres décisions :** aucun paiement in-app, aucune billetterie intégrée, pas de messagerie générale, pas de stories ou live, pas de pages territoriales, pas de check-in collaboratif pour l'instant. Les profils 13–17 ans sont privés par défaut. Un compte Pro n'achète pas un rang organique.

### Gamification et économie

- Vision V1 : **40 badges dans 8 familles** : Explorateur, Foodie, Maquis Master, Culture Hunter, Event Hunter, Pionnier, Photographe, Multi-Explorer. Pour le prototype, rendre **2–3 déblocages compréhensibles et fiables** plutôt que prétendre implémenter les 40.
- Revenus envisagés à terme : abonnements établissements, publicités non cliquables, partenariats et sponsors. Référence commerciale de travail : **5 000 FCFA/trimestre ou 15 000 FCFA/an**, sans encaissement intégré.
- Ne jamais présenter les faux chiffres de la démo comme des données d'utilisateurs réels ni des partenaires fictifs comme déjà contractualisés.

---

## 3. Historique de la progression du développement

### V1 — `chkpt-by-red-loop.zip`

Première interface React interactive avec cinq grandes sections, lieux fictifs inspirés d'Abidjan, publications, check-ins simulés, badges et publicité. Risques alors relevés : état principalement local au navigateur, sécurité insuffisante de l'opérateur, absence d'un serveur fiable de vérification.

### V2 — `chkpt-by-red-loop (1).zip`

Ajout d'Express, d'une base JSON persistante, des sessions et mots de passe hachés, du check-in calculé côté serveur, d'une gestion de médias et de routes administrateur. **L'audit antérieur signalait** l'accès à la persona admin sans mot de passe et la discordance entre les lieux du front et du serveur. Le projet annonçait 10 tests réussis, sans réexécution indépendante lors de l'audit.

### V3 actuelle — `chkpt-by-red-loop (2).zip`

Inspection **statique** des sources le 26 octobre 2026. Les ajouts/modifications visibles incluent :

- Route `GET /api/places` et récupération côté client pour unifier les lieux ; six références de lieux communes sont prévues dans `server/db.ts`.
- Nouveau composant `src/components/common/CategoryFilterBar.tsx` et référentiel `src/data/categories.ts`.
- Centre de notifications réorganisé sous `src/components/common/NotificationCenterModal.tsx`.
- Nouvelle console `src/components/operator/OperatorConsole.tsx`.
- Progression visible des badges après check-in, notamment **Maquis Master** dans `src/services/store.tsx`.
- Réinitialisation de démonstration via `POST /api/demo/reset` et bouton dédié dans `AuthModal.tsx`.
- Nouveaux éléments de présentation et tests : la documentation annonce **11/11 tests réussis**, **non confirmés indépendamment**.

**Ce qui reste de nature « prototype » :** carte dessinée en SVG, photos chargées depuis des URLs distantes, feed/likes/commentaires principalement gérés côté client, badges calculés dans l'état React et données de démonstration synthétiques. Ce n'est pas une application mobile native ni une plateforme de production.

### Limite de la vérification réalisée

Une tentative d'installation des dépendances pour lancer les tests a **dépassé le délai disponible**. L'audit V3 est donc fondé sur le code, et **aucun succès de test ou de build n'est revendiqué** par l'auteur de la passation. La nouvelle conversation doit faire ses propres vérifications.

---

## 4. Anomalies V3 à traiter en priorité

### P0 — Isoler véritablement les fonctions de démonstration

**Fichiers :** `server.ts`, `server/checkinEngine.ts`, `server/auth.ts`, `src/components/auth/AuthModal.tsx`.

**Problème vérifié dans le code :** `POST /api/auth/switch-demo` fabrique une session pour **n'importe quel username**, y compris `redloop_admin`. Son garde ne refuse la requête que si **le champ `environment` envoyé par le client vaut `production` ET `NODE_ENV` vaut `production`** ; il peut donc être contourné en omettant ce champ ou en envoyant `demo`.

**Action exigée :** décider côté serveur, via une configuration non contrôlable par le navigateur, si une instance est une **instance démo isolée**. Refuser complètement la bascule de persona dans tout environnement public/production, ou n'autoriser qu'un compte présentateur isolé et sans vrais droits administratifs. **Ne jamais autoriser la création sans mot de passe d'une session administrateur sur une instance publique.** Les routes `requireOperator` sont utiles mais ne suffisent pas lorsque la session administrateur peut être obtenue librement.

**Problème connexe :** le contrôle de la position simulée dans `server/checkinEngine.ts` dépend également du champ `environment` fourni par le client. Ce mécanisme ne constitue pas une garantie antifraude réelle. Garder la simulation pour une instance démonstration, la désactiver par règle serveur en public/production.

### P0 — Protéger la réinitialisation

**Fichiers :** `server.ts` (`POST /api/demo/reset`), `server/db.ts` (`resetPitchDemoState`), `src/services/store.tsx`.

**Problème vérifié dans le code :** `POST /api/demo/reset` n'a ni authentification ni protection de mode serveur et remet entièrement la base à l'état initial. Une personne qui connaît l'URL peut donc vider l'état d'une instance accessible.

**Action exigée :** route disponible **uniquement dans une instance démo isolée**, avec authentification/autorisation de présentateur, confirmation explicite, journal de reset et refus par défaut ailleurs. Éviter de supprimer d'autres comptes/données partagés. La fonction client doit lire le statut HTTP et **ne pas annoncer la réussite si le reset serveur a échoué**. Le reset doit remettre à zéro de manière cohérente fil, compte, badges, check-ins, XP, intentions et session démo.

**Point de vigilance :** le onzième test lance effectivement ce reset, ce qui peut effacer les données. Exécuter les tests sur une base clonée, jamais sur une instance partagée.

### P0 — Réparer le lieu présélectionné dans le check-in

**Fichiers :** `src/App.tsx`, `src/components/checkin/CheckinModal.tsx`.

**Problème vérifié dans le code :** `selectedPlaceId` dans `CheckinModal.tsx` est initialisé depuis `preselectedPlaceId` avec `useState`, **mais n'est pas resynchronisé lorsque cette propriété change**. Comme la fenêtre est montée dans `App.tsx` même quand elle est fermée, cliquer « Check-in ici » depuis une fiche peut garder un ancien lieu ou le lieu initial plutôt que le lieu choisi.

**Action exigée :** synchroniser la sélection à chaque ouverture (ou remonter proprement le composant avec une clé stable). Ajouter un test de parcours : sélectionner **Maquis L'Étoile** dans la carte, ouvrir sa fiche, cliquer **Check-in ici**, vérifier que **Maquis L'Étoile** est sélectionné, puis le confirmer au bon emplacement simulé.

### P1 — Stabiliser les données et le récit pour un jury

- `src/services/store.tsx` synchronise les lieux du serveur en remplissant certaines données d'affichage depuis des valeurs locales ou par défaut (`rating`, `reviewCount`, `isCurrentlyOpen: true`). **Ne pas présenter ces chiffres ou horaires supposés comme vérifiés.** Pour le pitch, employer un jeu synthétique stable et signalé.
- Le système de badges montre des changements côté client après check-in ; vérifier après changement de persona, refresh et reset qu'XP, badge, compteur et publication gardent un état cohérent.
- La carte est un **dessin SVG**, pas une véritable carte Google Maps. Il faut la présenter comme telle et éviter les promesses de navigation GPS native ; un vrai fond de carte n'est pas prioritaire si son intégration risque de casser la démonstration.
- Plusieurs photos précédemment incluses ont été remplacées par des liens Unsplash. Vérifier le chargement sur connexion lente et prévoir des **images intégrées et autorisées** pour les moments clés du pitch ; le fallback de notification pointe encore vers un chemin d'image qui n'existe plus (`src/services/notificationService.ts`).
- La route Gemini/Google Maps utilise le nom de modèle `gemini-3.8-flash` dans `server.ts`. **Vérifier la disponibilité effective et la compatibilité API** avant de l'utiliser ; **aucune dépendance à un appel IA en direct pendant la présentation**.
- Les dates de démo actuellement codées autour d'octobre 2026 deviendront périmées. Préparer des événements de démonstration datés par rapport au jour de présentation, avec mention « données fictives », ou une date figée affichée clairement.
- Le ZIP principal contient **un ZIP imbriqué** `chkpt_by_red_loop.zip`. Utiliser les fichiers de la racine comme source courante ; retirer l'archive imbriquée de l'export final si elle n'a aucun usage explicite.
- Le `README.md` est très générique et mentionne un lien AI Studio différent du lien fourni dans les échanges précédents. Le remplacer par un README propre : installation, scénario pitch, limites, commandes et avertissements de sécurité.

### P2 — Rendu premium et finition

- Harmoniser bleu nuit/bleu clair/bordeaux selon la charte, plutôt que laisser le rouge dominer partout.
- Prévoir un mode **présentation sur téléphone** et un rendu **projection sur ordinateur** sans éléments tronqués.
- Afficher la mention **« Mode démonstration — données fictives »** de façon discrète mais explicite.
- Garder les cinq onglets cohérents et un seul style de cartes, titres, icônes, boutons, statuts et notifications.
- Ajouter états vide, chargement, erreur, hors connexion pour les gestes du pitch, sans inventer des fonctionnalités secondaires.

---

## 5. Scénario recommandé pour FrancoTech — 3 minutes

**Cas d'usage à optimiser : un maquis de Cocody débloque « Maquis Master ».** Le projet contient un badge « Initié du Braisé » dans la famille « Maquis Master » initialisé à 4/5 pour déclencher sa récompense visuelle sur la visite suivante. Cela doit être **assumé comme scénario fictif de démonstration**.

| Temps indicatif | Action du présentateur | Ce que voit le jury |
|---|---|---|
| 0:00–0:25 | Ouvrir CHKPT → fil « Pour toi » | Application sociale jeune, publication d'un ami et recommandation locale |
| 0:25–0:55 | Aller sur Carte, filtrer « Maquis » | Découverte de lieux de Cocody et aperçu clair des filtres |
| 0:55–1:15 | Ouvrir la fiche de **Maquis L'Étoile d'Abidjan** | Visuels, description, localisation, actions |
| 1:15–1:45 | Activer la **position simulée Cocody Saint-Jean**, puis « Check-in ici » | Lieu exact déjà sélectionné ; vérification explicitement simulée |
| 1:45–2:05 | Confirmer | +XP, compteur synchronisé, badge « Initié du Braisé » / Maquis Master débloqué |
| 2:05–2:30 | Publier une photo et un message | Publication facultative créée puis visible dans Accueil et Profil |
| 2:30–2:50 | Aller dans Sortir et cliquer « J'y serai » | Découverte d'une sortie ou activité culturelle à Cocody |
| 2:50–3:00 | Revenir au Profil | Publications et progression cohérentes ; message final « Sors. Check. Partage. » |

**Avant une nouvelle présentation :** seule la personne autorisée peut déclencher le reset, et vérifier que l'état est bien revenu au départ. Prévoir une **vidéo locale courte de secours** si le Wi-Fi, la géolocalisation ou un service distant tombent en panne.

### Deuxième récit : partenaires / investisseurs

Utiliser le **même prototype** mais changer le discours. Présenter CHKPT comme porte d'entrée d'une communauté de découverte urbaine, puis RED LOOP comme structure d'exploitation et modèle économique futur : établissements, organisateurs, publicité non cliquable, partenaires et extension nationale. **Ne pas fabriquer de traction, contrats, volumes ou chiffre d'affaires réels.** Les statistiques montrées sont de démonstration.

---

## 6. Définition du « prototype prêt à présenter »

Le jalon est accepté si :

1. Le front se lance et les écrans essentiels s'affichent sans erreur visible.
2. L'utilisateur démo peut ouvrir **Accueil → Carte → fiche → Check-in** et la fiche transmet toujours le **bon ID de lieu**.
3. Le lieu simulé sélectionné est dans le rayon autorisé ; le parcours se termine sans dépendre du GPS réel du jury.
4. La validation crée **une seule** visite, crédite **une seule fois** les XP et déclenche le badge prévu.
5. Une publication peut être créée ou ignorée sans perdre le check-in ; lorsqu'elle est créée elle apparaît en Accueil et en Profil.
6. Les filtres « Maquis » et les intentions « J'y serai » fonctionnent et restent cohérents pendant la démo.
7. Le reset remet réellement l'état démo à zéro et ne peut être appelé par un visiteur non autorisé.
8. La bascule de persona n'ouvre aucun compte admin sans autorisation côté serveur ; les données privées restent protégées.
9. Les images du parcours ne cassent pas ; les événements affichés sont datés convenablement.
10. Sur smartphone et ordinateur : interface lisible, fluide, sans débordement bloquant.
11. Une liste de **fonctionnalités simulées** est disponible pour Ingrid afin de répondre avec précision aux questions du jury.
12. Une vidéo de secours et une procédure de réinitialisation existent.

### Vérifications techniques demandées

- `npm install`, `npm run lint`, `npm run build`, `npm run dev`, puis `npm test` **sur une copie isolée de `.data/chkpt_db.json`** lorsque l'environnement le permet ; observer les erreurs, corriger et relancer.
- Ajouter des tests spécifiques **au-delà des 11 annoncés** : refus de `switch-demo` vers `redloop_admin` dans un serveur public ; refus de reset anonyme ; refus de simulation côté serveur public ; transmission correcte du lieu présélectionné ; séquence check-in → badge → publication → reset ; absence de données privées lors d'un changement de persona.
- Ne jamais dire qu'un test est passé si cette nouvelle IA ne l'a pas lancé et constaté.

---

## 7. Ordre d'exécution imposé pour la suite

**Lot A — Fiabilité et sécurité du prototype :** identifier et corriger les P0, ajouter les contrôles de serveur non contournables, protéger la réinitialisation et le scénario, fixer le lieu présélectionné.

**Lot B — Démonstration reproductible :** jeu de données synthétique cohérent, Maquis Master, publication, badges, parcours Sortir, reset et dates fiables. Toutes les interactions peuvent être simulées **honnêtement**.

**Lot C — Finition UX/UI :** images stables, palette CHKPT, animations sobres, lisibilité mobile/desktop, intégration du vrai logo s'il est fourni.

**Lot D — Livrables de présentation :** instructions de lancement, guide de pitch 3 min pour Ingrid, résumé de valeur pour financeurs, checklist avant jury, vidéo de secours si réalisable, ZIP final propre.

**Exclusions dans cette phase :** réécriture React Native, migration PostgreSQL, paiement, infrastructure nationale scalable, quarante badges complets, tout le registre des 130 écrans, back-office de production complet. Ces sujets restent dans la roadmap.

---

## 8. Ce que la nouvelle IA doit remettre

1. **Diagnostic bref** : changements V3 confirmés, points faibles, risques du pitch.
2. **Correctifs appliqués** : fichiers modifiés précisément identifiés, aucune régression.
3. **Preuves de test** : commandes et résultats, ou obstacles techniques honnêtement mentionnés.
4. **Nouveau ZIP source** : propre et réimportable, sans secrets ni doublons inutiles si la génération de fichiers est possible.
5. **Guide opératoire** : démarrage, compte présentateur, lieu à sélectionner, badge à montrer, reset sécurisé, plan B si connexion indisponible.
6. **État des lieux final** : ce qui est réellement opérationnel, ce qui reste une simulation et ce qui est reporté après financement.

---

## 9. Message prêt à coller dans la nouvelle conversation

> Je reprends CHKPT by RED LOOP avec **la troisième archive du code** (`chkpt-by-red-loop (2).zip`) et ce document de passation V3.
>
> Lis **les deux pièces jointes intégralement**. Ne repars pas de zéro. Le ZIP est la version actuelle du code, le Markdown transmet nos décisions et les points de vigilance identifiés par inspection statique.
>
> Mon objectif immédiat est un **prototype haut de gamme, fiable et interactif** pour le projet d'Ingrid à FrancoTech Cocody et pour de futurs financeurs. Je ne demande pas encore une application de production.
>
> Commence par analyser le code et vérifier les anomalies P0 : changement de persona administrateur, reset non protégé et lieu incorrect dans la modale de check-in. Préserve le travail utile, puis améliore le scénario de présentation de 3 minutes fondé sur Cocody et le badge Maquis Master.
>
> Exécute les tests/build si possible, **sans effacer de données hors environnement isolé**. Indique clairement tout test non exécuté. Travaille par lots, fournis le code corrigé et des instructions simples pour essayer le prototype.

---

**Règle de continuité :** ne modifier aucun choix produit validé sans demande explicite. Le but est de faire passer l'application de **prototype fonctionnel mais fragile** à **démonstrateur crédible, élégant et répétable**.
