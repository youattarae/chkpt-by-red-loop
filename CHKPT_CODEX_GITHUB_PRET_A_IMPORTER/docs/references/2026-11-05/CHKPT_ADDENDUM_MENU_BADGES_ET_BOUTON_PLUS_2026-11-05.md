# CHKPT — ADDENDUM UX : MENU LATÉRAL, BADGES ET BOUTON CENTRAL « + »

**Date :** 5 novembre 2026  
**Projet :** CHKPT by RED LOOP  
**Destination :** conversation Codex existante, mission globale des lots 0 à 8 déjà en cours  
**Statut :** décisions UX explicites du porteur, à intégrer au code existant

> **Consigne générale :** ce document complète les deux récapitulatifs CHKPT du 5 novembre et l’addendum Stories/défilement. Il **intègre aussi la correction du bouton central « + »**, pour que les trois sujets menu / badges / bouton central soient dans un seul fichier. Il ne lance pas un nouveau projet et ne remplace pas les décisions antérieures non contradictoires. Préserver les fonctionnalités, données, autorisations, API et tests existants. Ne pas modifier silencieusement le moteur de badges, ses seuils ou ses grades provisoires.

---

## 1. MENU LATÉRAL — ORDRE EXACT VALIDÉ

### 1.1. Bloc d'identité en haut

Conserver le bloc d'identité de la personne connectée, avec :
- photo de profil ou avatar ;
- nom affiché ;
- identifiant utilisateur ;
- accès **direct au profil** quand on touche le bloc.

Le bloc d'identité **n'est pas un élément numéroté du menu**. La commande « Mon compte » ci-dessous reste distincte de l'accès au profil (compte / réglages de compte selon le comportement existant).

### 1.2. Entrées à présenter, dans cet ordre sans réorganisation

1. **Notifications**
2. **Mon compte**
3. **Badges et progression**
4. **Enregistrés**
5. **Historique privé**
6. **Récompenses fictives** (intitulé de démonstration : ne pas suggérer que de véritables récompenses partenaires existent déjà)
7. **Classement**
8. **Aide**
9. **Réglages**

### 1.3. Suppression d'une entrée devenue redondante

- **Retirer « Messages privés » du menu latéral.**
- **Messages** dispose déjà de sa propre entrée dans la barre de navigation flottante du bas : `Accueil · Carte · + · Sortir · Messages`.
- Ne pas supprimer la messagerie existante : seule son entrée redondante dans le menu est à retirer.

### 1.4. Notifications

- L'entrée **Notifications** arrive **en première position**.
- Afficher son nombre non lu si supérieur à zéro, avec un libellé compréhensible (exemple : `Notifications · 1`).
- La puce de notifications sur les pages principales reste sur le **bouton du menu**, jamais sur la photo de profil.
- Aucun compteur de messages ne doit être confondu avec celui des notifications.
- Ouvrir le menu seul ne marque aucune notification comme lue.
- La cloche n'est pas réintroduite dans l'en-tête.

### 1.5. Présentation et interaction

- Menu ouvrant depuis la **gauche**, conformément à la dernière décision UX.
- Conserver ouverture au bouton et par glissement depuis le bord gauche, fermeture accessible sans geste obligatoire.
- Conserver des zones tactiles adaptées aux petits écrans et les fonctions déjà présentes.
- Sur son propre Profil, la flèche de retour remplace le bouton menu visible ; le menu reste accessible par glissement selon la décision UX générale.

---

## 2. PAGE PRINCIPALE « BADGES ET PROGRESSION » — NOUVELLE PRÉSENTATION

### 2.1. Vision

L'écran ne doit **plus ressembler à un tableau de statistiques**, une liste de seuils ou une grille de petites fiches d'objectifs.

Il doit évoquer **une collection de récompenses de jeu vidéo** : badges illustrés, visuels valorisants, plaisir de collectionner et mystère sur les prochaines récompenses.

### 2.2. Huit familles officielles

Afficher **huit grands blocs visuels**, un par famille de badges du projet :

1. Explorateur
2. Foodie
3. Maquis Master
4. Culture Hunter
5. Event Hunter
6. Pionnier
7. Photographe
8. Multi-Explorer

**Ne pas remplacer ces huit familles par les intitulés illustratifs d'une maquette ou d'une image générée** (ex. « Éclaireur Urbain », « Créateur », « Communauté », « Découverte+ » ne sont pas des remplacements autorisés des familles).

### 2.3. Contenu de chaque bloc

- **En grand :** l'illustration du badge le plus avancé déjà débloqué dans cette famille.
- **En dessous :** le nom de la **famille**, clairement lisible.
- Une famille sans badge débloqué doit présenter un **badge gris / verrouillé**, sans divulguer de condition future.
- Le bloc entier est cliquable et conduit à **la page de cette famille**.
- Adopter une présentation soignée, « Urban Premium / street chic », compatible avec les thèmes clair et sombre, les couleurs bleu nuit / bleu clair et l'accent bordeaux de CHKPT.

### 2.4. À retirer de cette vue d'ensemble

- Les cartes d'objectifs textuels du type « Visiter X lieux ».
- Les barres de progression vers un seuil de déblocage.
- Les compteurs de visites et les conditions à remplir.
- La grille actuelle avec progression en pourcentage au niveau de chaque badge.

Les données XP et le journal privé peuvent rester accessibles dans les espaces prévus ; cette décision porte sur **la présentation de la collection de badges**, pas sur la suppression du système de progression.

---

## 3. À L'INTÉRIEUR D'UNE FAMILLE DE BADGES

### 3.1. Composition de la page

À l'ouverture d'une famille, afficher :

1. **Retour** vers les huit familles.
2. **Nom de la famille** et, si approprié, un grand visuel représentatif.
3. **Compteur de collection**, par exemple `Badges débloqués : 2/5`.
4. **Tous les emplacements de badges de cette famille**, dans l'ordre de progression.
5. **Bloc « Badge actuel »** qui explique le dernier badge déjà obtenu à partir d'un accomplissement réellement connu.

### 3.2. Sens exact du compteur `2/5` ou `3/10`

**Règle impérative :** le numérateur et le dénominateur représentent uniquement le **nombre de badges débloqués / nombre total de badges de la famille**.

- `2/5` = 2 badges débloqués sur 5 badges existants dans cette famille.
- `3/10` = 3 badges débloqués sur 10 badges existants dans cette famille.
- Le dénominateur est tiré du **catalogue effectif** de la famille ; ne pas supposer arbitrairement que chaque famille comporte dix badges.
- **Cela ne signifie jamais** « 2 visites sur 5 » ou « 3 maquis sur 10 ».
- Placer le compteur **dans la page de la famille**, pas sur le grand bloc de la page des huit familles.

### 3.3. Badges déjà débloqués

- Affichage **en couleur**, avec leur véritable illustration.
- **Le vrai nom de chaque badge débloqué est visible juste en dessous**.
- Ne pas écrire sous ces badges les mots génériques **« Débloqué »** ou **« Actuel »** à la place de leur nom.
- Le badge le plus récent / le plus élevé est le **badge actuel** de la famille. Son détail est expliqué séparément dans le bloc « Badge actuel ».

### 3.4. Badges non débloqués

- Affichage **gris**, verrouillé, à la manière des personnages ou récompenses non encore accessibles d'un jeu vidéo.
- **Ne pas afficher leur nom sous leur illustration.**
- **Ne pas afficher leurs conditions de déblocage.**
- **Ne pas indiquer le nombre de visites / publications / événements restant pour les obtenir.**
- **Ne pas afficher de jauge, pourcentage ou barre de progression vers le prochain badge.**
- Les emplacements doivent montrer qu'il existe d'autres badges à collectionner, **sans dévoiler leurs secrets**.
- Préserver néanmoins une étiquette d'accessibilité non révélatrice, par exemple « Badge verrouillé », pour les lecteurs d'écran.

### 3.5. Bloc « Badge actuel »

Le bloc sous la collection porte le titre :

**Badge actuel**

Puis une explication de **ce qui a déjà été accompli pour obtenir ce badge**, par exemple :

> Vous avez débloqué votre badge actuel grâce à 10 maquis visités.

**Important :** ce texte est **un exemple illustratif**, pas une règle de déblocage nouvellement approuvée. Afficher une phrase fidèle aux accomplissements enregistrés et au badge effectivement obtenu ; ne pas inventer de nombre.

- La phrase **« Objectif du badge actuel » est supprimée**.
- Aucun deuxième compteur de type « 10/10 visites » n'est demandé.
- L'explication s'intéresse à **la réussite passée**, jamais au seuil requis pour le badge suivant.
- Si aucun badge n'a encore été obtenu dans la famille, montrer un état vide engageant sans inventer une réussite ni révéler les conditions futures.

---

## 4. EXEMPLE DE RENDU — MAQUIS MASTER (ILLUSTRATIF)

### Page des huit familles

`[Grand badge Explorateur]  [Grand badge Foodie]`  
`[Grand badge Maquis Master] [Grand badge Culture Hunter]`  
`[Grand badge Event Hunter] [Grand badge Pionnier]`  
`[Grand badge Photographe] [Grand badge Multi-Explorer]`

Chaque grand badge affiche le **nom de sa famille** dessous.

### Après clic sur « Maquis Master »

**MAQUIS MASTER**  
**Badges débloqués : 2/5**

- Badge 1 : illustration en couleur + **nom réel du badge 1**.
- Badge 2 : illustration en couleur + **nom réel du badge 2**.
- Badge 3 : illustration grise verrouillée + **aucun nom affiché**.
- Badge 4 : illustration grise verrouillée + **aucun nom affiché**.
- Badge 5 : illustration grise verrouillée + **aucun nom affiché**.

**Badge actuel**  
« Vous avez débloqué votre badge actuel grâce à 10 maquis visités. » *(texte de démonstration seulement si cohérent avec les données de ce personnage)*.

**Ne jamais afficher :** « Il vous reste X maquis pour atteindre le badge 3. »

---

## 5. CONTRAINTES D'INTÉGRATION POUR CODEX

1. **Réutiliser l'existant :** moteur de badges, familles, XP, historique serveur, règles anti-doublons, données du compte et permissions.
2. **Changer essentiellement les écrans et le contrat d'affichage**, pas les règles métier sans validation.
3. **Ne pas modifier silencieusement les seuils, le nombre de badges par famille ou les grades** : les noms / seuils provisoires du prototype restent distincts du catalogue officiel encore à consolider.
4. Les noms et illustrations figurant dans des visuels de référence ne constituent **pas** un nouveau catalogue officiel.
5. L'utilisateur ne doit pas pouvoir déduire les conditions du prochain badge via les libellés de l'interface, messages de progression ou info-bulles de ces pages.
6. Les données concernant l'historique personnel et les XP totaux restent soumises aux règles de confidentialité existantes, en particulier pour les profils privés et les mineurs.
7. Afficher les informations exactes connues : pas de badge fictivement débloqué sur un vrai compte ; seuls les personnages de démonstration explicitement identifiés peuvent avoir des données fictives préparées.
8. Conserver les retours, le focus et les positions de défilement.
9. Mettre à jour les tests ciblés des vues de menu, collection, verrouillage / déverrouillage et confidentialité ; mettre à jour les captures et guides après implémentation.
10. Ce complément doit être intégré **à la mission globale des lots 0 à 8 en cours**, sans repartir de zéro et sans attendre une validation intermédiaire pour les éléments explicites ci-dessus.

## 6. CHECKLIST D'ACCEPTATION

### Menu

- [ ] Le menu latéral présente les neuf entrées **dans l'ordre exact** : Notifications, Mon compte, Badges et progression, Enregistrés, Historique privé, Récompenses fictives, Classement, Aide, Réglages.
- [ ] « Messages privés » est absent du menu ; Messages demeure dans la barre inférieure.
- [ ] Le bloc identité ouvre le Profil.
- [ ] Notifications affichent le compteur non lu correct, distinct de Messages.

### Page principale des badges

- [ ] Les huit **familles officielles** sont représentées par de grands blocs illustrés.
- [ ] Chaque bloc montre le dernier badge obtenu (ou un badge verrouillé s'il n'y en a aucun) et le nom de la famille.
- [ ] Aucun compteur de visites, seuil futur ou jauge de progression n'apparaît dans cette vue.

### Détail d'une famille

- [ ] Compteur de collection exact : `badges obtenus / total des badges de la famille`.
- [ ] Tous les badges obtenus sont en couleur avec **leur véritable nom** sous l'image.
- [ ] Tous les badges verrouillés sont gris, sans nom visible ni condition future.
- [ ] Aucun libellé générique « Débloqué » / « Actuel » ne remplace le nom d'un badge obtenu.
- [ ] Le bloc « Badge actuel » montre seulement la réussite passée connue ; « Objectif du badge actuel » est absent.
- [ ] Aucune jauge ni indication « il reste X » vers le prochain badge.
- [ ] Les états sans badge obtenu sont correctement gérés.
- [ ] Les règles XP / badges et les données existantes sont préservées, avec tests de non-régression réussis.

---

## 7. BOUTON CENTRAL « + » — CORRECTION VISUELLE OBLIGATOIRE

### 7.1. Décision explicite

Le bouton au centre de la barre de navigation du bas **ne doit plus afficher le logo ou le symbole CHKPT**.

- Afficher à la place **un grand signe plus « + »**, net et immédiatement reconnaissable.
- Donner au plus une **présence visuelle dominante**, supérieure à celle des pictogrammes ordinaires de la barre.
- Utiliser les **couleurs de CHKPT** (bleu nuit, bleu clair et/ou accent bordeaux selon l’équilibre visuel retenu), sans transformer le plus en logo complexe.
- Conserver une **capsule de navigation flottante** et un **bouton central bien dégagé**, accessible sur téléphone.
- Conserver le logo officiel CHKPT uniquement là où les règles d’en-tête l’autorisent, et **jamais comme remplacement du plus** dans le bouton d’action central.

### 7.2. Comportement du bouton

Un appui sur le « + » ouvre un **panneau d’actions compact** proposant dans cet ordre :

1. **Faire un check** ;
2. **Créer une publication**.

Ces deux actions doivent être réellement raccordées aux parcours existants ; il ne s’agit pas de boutons décoratifs. Le check ne doit pas être déclenché automatiquement au premier appui sur « + ».

### 7.3. À intégrer à l’exécution Codex en cours

- Mettre à jour le composant de barre inférieure, son style et son accessibilité.
- Préserver le fonctionnement des onglets **Accueil · Carte · + · Sortir · Messages**.
- Actualiser les tests visuels/fonctionnels concernés.
- Faire figurer le **grand plus** sur les prochaines captures et dans les supports finaux de démonstration.
- **Ne pas remettre le symbole CHKPT** dans ce bouton, même pour la version sombre.

### 7.4. Checklist d’acceptation

- [ ] Le centre de la barre du bas affiche un **grand « + »** et non le symbole CHKPT.
- [ ] Le plus utilise une déclinaison cohérente avec la palette CHKPT, lisible en thèmes clair et sombre.
- [ ] Le « + » ouvre un panneau proposant **Faire un check**, puis **Créer une publication**.
- [ ] Le parcours de check-in et celui de création de publication restent distincts.
- [ ] Les captures et guides régénérés utilisent la version corrigée.

---

**Fin de l’addendum consolidé — CHKPT / RED LOOP — 5 novembre 2026.**
