# CHKPT — ADDENDUM UX : STORIES ET DÉFILEMENT DE L’ACCUEIL

**Date :** 5 novembre 2026  
**Destination :** conversation Codex en cours — mission globale des lots 0 à 8  
**Nature :** précision UX ciblée, à intégrer aux lots concernant l’Accueil et sa recette, **sans recommencer ni interrompre l’ensemble du travail**.

## 1. Décision de conception à intégrer

La rangée des **Stories** doit être visible à l’ouverture de l’Accueil, sous la première ligne de commandes et **immédiatement au-dessus des onglets « Pour toi » / « Amis »**.

- Stories présentées en **cercles d’avatars**, défilant **horizontalement**.
- Premier cercle : **« Votre story »**, avec accès clair à l’ajout d’une story.
- Cercles suivants : Stories actives des autres profils que l’utilisateur a le droit de voir.
- **Aucune autre rubrique** (répertoire de profils, recherche, encart éditorial, publicité ou formulaire de publication) ne doit être intercalée **entre les Stories et « Pour toi / Amis »**.
- Ne pas supprimer le répertoire de profils existant s’il reste utile : le **déplacer** à un emplacement cohérent, sans occuper cet intervalle.
- Conserver le module Stories existant : lecture, création, médias, durée de 24 h, confidentialité, droits des mineurs et suppression par l’auteur.

**Ordre visuel au début de l’Accueil :**

1. Première ligne de commandes (menu, avatar, symbole CHKPT uniquement sur Accueil, recherche selon les dernières règles UX).
2. Rangée horizontale des Stories.
3. Ligne « Pour toi / Amis » et icône de localisation.
4. Publications du fil.

## 2. Comportement au défilement — décision nouvelle

**Quand l’utilisateur descend dans le fil (il fait défiler les publications vers le bas), la rangée des Stories disparaît de l’écran avec le contenu qui défile.**

- Les Stories **ne doivent pas rester épinglées / sticky / flottantes** pendant la lecture des publications.
- Elles ne doivent pas réapparaître par-dessus une publication, ni réduire durablement l’espace de lecture.
- Elles redeviennent visibles lorsque l’utilisateur **remonte effectivement jusqu’à leur emplacement** dans le haut du fil.
- Le retour sur l’onglet Accueil doit préserver autant que possible la position de lecture déjà choisie, sans renvoyer systématiquement aux Stories.

**À distinguer de la règle déjà validée sur l’en-tête :** lors d’un défilement descendant, les lignes de commandes/onglets se masquent ; au premier mouvement inverse significatif, elles réapparaissent rapidement. **Cette réapparition rapide des commandes ne doit pas faire réapparaître artificiellement les Stories** si leur position dans le fil n’est pas atteinte.

> Sens de « glisser vers le bas » ici : **parcourir le fil vers ses publications plus basses**, indépendamment du sens physique du doigt sur l’écran.

## 3. Démonstration : montrer de vraies interactions, avec données fictives identifiées

- Prévoir **plusieurs Stories fictives actives et visibles** dans le scénario de démo, afin que la rangée ne semble pas vide et qu’on comprenne immédiatement sa fonction.
- Employer les comptes/personnages fictifs déjà disponibles, sans écraser les Stories ou publications créées par de vrais comptes de test.
- Respecter les règles de visibilité : aucune story privée ou réservée à un autre public ne doit être rendue visible simplement pour remplir la rangée.
- Si un jeu de démonstration est préparé, il doit être **identifié comme fictif**, idempotent, limité au contexte privé de démo et compatible avec l’expiration à 24 h ; éviter tout contournement silencieux des règles serveur.
- Un appui sur un cercle ouvre la Story correspondante ; « Votre story » permet de créer/consulter sa propre Story selon son état.

## 4. Consignes d’intégration dans la mission Codex déjà lancée

- **Ne pas démarrer une nouvelle application ni abandonner les lots 0 à 8.** Ajouter cette précision au lot Accueil / en-têtes / défilement, et à la recette finale.
- Réutiliser prioritairement `StoryStrip`, `StoryAvatar`, le composant Accueil et les composants de navigation/scroll déjà présents.
- Ne pas supprimer les fonctionnalités de stories implémentées, les protections serveur, les stories des comptes existants ni les tests historiques.
- Adapter les tests uniquement là où leur ancienne attente contredit cette décision ; conserver tous les tests de non-régression métier et sécurité.
- Documenter tout conflit avec les dernières règles d’en-tête, sans inventer une nouvelle navigation.

## 5. Critères d’acceptation à tester

- [ ] Sur smartphone, à l’ouverture de l’Accueil, les cercles Stories sont bien **juste au-dessus** de « Pour toi / Amis ».
- [ ] Les Stories sont défilables horizontalement et leurs cercles déclenchent les actions attendues.
- [ ] En descendant dans le fil, les Stories **sortent de l’écran** et ne restent ni collées en haut ni flottantes.
- [ ] Un petit mouvement inverse peut faire revenir l’en-tête/les onglets, **sans faire réapparaître les Stories** au milieu du fil.
- [ ] Les Stories réapparaissent lorsque l’utilisateur revient réellement à leur emplacement initial.
- [ ] Changer d’onglet puis revenir à Accueil ne provoque pas de saut de position inattendu.
- [ ] La démonstration montre plusieurs Stories fictives actives et autorisées, avec mention explicite du caractère fictif.
- [ ] Les protections de visibilité, la limite de 24 h, la création, la lecture et la suppression continuent de fonctionner.
- [ ] Vérifications sur 320 px, 390 px et 1280 px, modes clair et sombre, clavier et écran tactile quand disponible.

## 6. Retour attendu de Codex

Dans le bilan final de la mission globale, indiquer brièvement :

- les composants modifiés pour cet addendum ;
- le résultat des tests spécifiques « ordre des Stories / disparition au scroll / retour en haut » ;
- les limites résiduelles éventuelles, en distinguant ce qui a été réellement essayé sur un appareil de ce qui l’a été uniquement dans le navigateur automatisé.

**Fin de l’addendum — ne remplace pas les deux Markdown maîtres du 5 novembre 2026.**
