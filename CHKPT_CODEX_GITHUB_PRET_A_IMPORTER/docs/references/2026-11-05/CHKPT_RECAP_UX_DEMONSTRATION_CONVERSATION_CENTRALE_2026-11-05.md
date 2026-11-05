# CHKPT — RÉCAPITULATIF COMPLET DES DÉCISIONS UX ET DE LA DÉMONSTRATION

**Date :** 5 novembre 2026  
**Produit :** CHKPT, prononcé « Checkpoint »  
**Écosystème :** RED LOOP  
**Slogan :** « Sors. Check. Partage. »  
**Destination :** à ajouter à la conversation centrale CHKPT.  
**Périmètre :** consolidation des échanges sur l’expérience utilisateur, les en-têtes, la navigation, la Carte, les publications, le partage, les Messages et le parcours de démonstration.

> Ce document transmet les décisions de conception et leurs dernières corrections. Il ne constitue pas une preuve de développement, de test ou de mise en production. Les arbitrages récents explicitement formulés remplacent les anciennes propositions contradictoires sur les mêmes éléments d’interface. Les autres parties du document maître restent à conserver.

## 1. Comment intégrer ce récapitulatif

Ce récapitulatif complète le document produit `03_CHKPT.md` et la synthèse générale `CHKPT_RECAP_COMPLET_CONVERSATION_CENTRALE_2026-11-05.md`.

Il apporte des précisions décisives qui manquaient dans la synthèse générale :

- L’Accueil conserve uniquement **Pour toi / Amis** ; **Tendances est retiré de cet écran**.
- La navigation flottante devient **Accueil · Carte · ＋/Check · Sortir · Messages**.
- Le Profil reste accessible, mais sort de la barre du bas.
- Le **social et la Carte sont les deux piliers du produit**.
- La Carte devient immersive, bord à bord, avec des commandes flottantes.
- Le symbole CHKPT apparaît **uniquement dans l’en-tête de l’Accueil**.
- Les notifications quittent l’en-tête et passent dans le menu latéral.
- Leur puce apparaît **sur le bouton du menu uniquement**, jamais sur la photo de profil.
- Sur son profil, une **flèche retour remplace le bouton du menu**.
- Le partage est organisé en **deux rangées : interne en haut, externe en bas**.
- Une séquence de Messages est validée pour la démonstration.

**Distinction de périmètre à préserver :** la présence de Messages dans la démonstration et sa navigation est retenue dans les échanges récents. Le document produit antérieur indique que la messagerie n’était pas validée pour la première version publique. Ces échanges valident son expérience de démonstration ; ils ne suffisent pas à fixer tout le périmètre technique et opérationnel de la messagerie au lancement réel.

### Statuts utilisés

| Statut | Signification |
|---|---|
| **Retenu** | Choix de conception arrêté ou conservé dans les échanges récapitulés. |
| **Retenu pour la démo** | Comportement à montrer dans le prototype, sans présumer son existence dans le code actuel. |
| **Contexte antérieur** | Règle provenant du cadrage produit précédent, rappelée sans nouvelle validation. |
| **Proposé / à préciser** | Détail qui reste à spécifier ou recommandation qui n’est pas un arbitrage définitif. |
| **Ultérieur** | Évolution à conserver dans la vision, hors de l’expérience actuelle. |
| **À vérifier dans le code** | État réel non établi par cette conversation. |

## 2. Vision et priorité de l’expérience

### Ce qu’est CHKPT

CHKPT permet de découvrir des lieux et événements, de voir des expériences partagées, de confirmer sa présence dans un lieu et de raconter son expérience.

**Retenu : le social et la Carte constituent les deux piliers de CHKPT.** La Carte n’est pas un écran secondaire. L’utilisateur a insisté sur son importance, potentiellement équivalente à celle du réseau social.

- **Le social** donne envie de découvrir, de sortir et de partager.
- **La Carte** permet de trouver concrètement où aller et ce qui existe autour de soi.
- **Le check** relie la découverte à une présence dans un lieu.
- **La publication** permet de raconter un moment, avec ou sans check préalable.

**Conséquence de conception :** la Carte doit avoir de la valeur même pour une personne qui ne publie pas encore et ne suit personne.

### Objectif immédiat

Construire une démonstration fluide et compréhensible par l’usage :

**Découvrir → consulter → checker → partager → retrouver son activité.**

La priorité est un parcours complet et cliquable. Une succession de maquettes isolées ne suffit pas.

### Contexte produit conservé

- CHKPT est le produit grand public ; RED LOOP est l’écosystème.
- Le référencement initial est centré sur Cocody, dans une ambition nationale.
- La direction visuelle reste **Urban Premium / street chic** : bleu nuit, bleu clair, bordeaux en accent, noir et blanc.
- Le symbole officiel repose sur le passage et le mouvement ; les symboles illustratifs des maquettes ne deviennent pas automatiquement le logo définitif.
- Les badges doivent être découverts progressivement.
- Aucun paiement intégré à la V1 n’est ajouté par cette conversation.

## 3. Navigation principale : barre flottante du bas

### Composition retenue

| Position | Entrée | Fonction |
|---|---|---|
| 1 | **Accueil** | Retrouver les fils Pour toi et Amis. |
| 2 | **Carte** | Explorer les lieux et les environs. |
| 3, au centre | **＋ / Check** | Ouvrir les actions Faire un check et Créer une publication. |
| 4 | **Sortir** | Découvrir les événements, les sélections et les contenus éditoriaux. |
| 5 | **Messages** | Retrouver les conversations de la démonstration. |

### Apparence et comportement

- Capsule arrondie et flottante, détachée des bords.
- Bouton central plus visible que les autres entrées.
- Barre conservée pendant le défilement du fil d’Accueil.
- Sur la Carte, le fond cartographique reste visible autour de la capsule.
- Un changement d’onglet doit conserver l’état de l’espace quitté.
- Le compteur des Messages non lus se situe sur l’icône Messages.

**À préciser :** visibilité de cette barre dans chaque écran secondaire en plein écran, notamment les fiches, l’éditeur et les conversations. La conversation fixe son maintien sur les espaces principaux, sans détailler tous les cas secondaires.

### Accès au Profil

Le Profil ne figure plus dans cette barre. Il s’ouvre :

- par appui sur la photo de profil des pages principales ;
- par appui sur le bloc identité du menu latéral.

## 4. Règles des en-têtes

### Règles générales retenues

| Élément | Règle finale |
|---|---|
| **Symbole CHKPT** | Présent uniquement dans l’en-tête de l’Accueil. |
| **Photo de profil** | Ouvre directement son profil ; absente du petit en-tête lorsqu’on est déjà sur son propre profil. |
| **Bouton du menu** | Très fin et discret, accessible sur les pages principales. |
| **Puce de notifications** | Uniquement sur le bouton du menu ; jamais sur la photo de profil. |
| **Cloche de notifications** | Retirée de l’en-tête. |
| **Recherche** | Remplace toute la première ligne lorsqu’elle est activée. |
| **Retour sur le Profil** | Flèche en haut à gauche à la place du bouton du menu. |

### Disposition de travail

La disposition proposée dans l’échange est :

- **À gauche :** bouton de menu fin, puis photo de profil.
- **Au centre :** symbole CHKPT sur l’Accueil uniquement.
- **À droite :** loupe.

Les fonctions de chaque élément sont retenues ; les espacements, tailles et positions au pixel restent à vérifier dans la maquette finale. Le bouton de menu doit rester mince visuellement, sans cercle ni gros fond décoratif, avec une zone tactile facile à toucher.

### Par écran

| Écran | Menu visible | Petite photo de profil | Symbole CHKPT en haut | Retour |
|---|---|---|---|---|
| **Accueil** | Oui, avec puce si nécessaire | Oui | Oui | Pas de retour principal défini ici |
| **Carte** | Oui, flottant | Oui, flottante | Non | Selon l’écran secondaire ouvert |
| **Sortir** | Oui | Oui selon l’en-tête commun | Non | Dans les fiches et articles ouverts |
| **Messages, liste** | Oui selon la règle des pages principales | Selon l’en-tête commun | Non | Dans une conversation |
| **Son propre Profil** | Non ; menu accessible par glissement | Non dans l’en-tête ; grande photo conservée dans le contenu | Non | Oui, en haut à gauche |

La composition détaillée des en-têtes de Sortir et de Messages reste à matérialiser. Ne pas réintroduire le symbole ou une cloche sur ces écrans.

## 5. Accueil : contenu, localisation et défilement

### Deux lignes en haut

**Première ligne :** commandes principales et symbole CHKPT selon les règles précédentes.

**Deuxième ligne :**

- **Pour toi** ;
- **Amis** ;
- une **icône de localisation seule**.

**Retenu :** pas d’onglet Tendances dans l’Accueil. Pas de barre « Quoi de neuf ? » ajoutée au-dessus du fil. « Autour de moi » reste dans la Carte.

### Localisation

- Le nom de la commune n’est pas affiché en permanence à côté de l’icône.
- Toucher l’icône ouvre le choix de la commune.
- Le choix affiche la commune actuelle et permet d’en explorer une autre.
- La position et les contenus de la démonstration sont simulés.
- **Changer la zone explorée ne crée jamais de check-in.**

Ce mécanisme de sélection n’ajoute pas des pages éditoriales distinctes par commune ou quartier.

### Comportement au défilement

- Quand l’utilisateur avance dans le fil et fait monter les publications, **les deux lignes de l’en-tête disparaissent ensemble**.
- Dès le premier petit mouvement inverse, **elles réapparaissent immédiatement**.
- Il n’est pas nécessaire de revenir en haut du fil pour retrouver les commandes.
- La barre flottante du bas reste visible.
- Revenir au fil après consultation d’un autre écran conserve la position de lecture.

Les seuils techniques de détection du mouvement restent à régler pour éviter les tremblements. L’intention validée est un retour rapide de l’en-tête.

## 6. Recherche : remplacement de la première ligne

**Retenu :** toucher la loupe transforme toute la première ligne en une barre de recherche sur la largeur disponible.

### Séquence

1. L’utilisateur touche la loupe.
2. La photo, le symbole éventuel et les commandes de cette première ligne laissent place à la recherche.
3. Une flèche retour permet de quitter ce mode.
4. Le champ prend le focus ; l’ouverture du clavier est attendue sur téléphone.
5. L’utilisateur peut modifier sa saisie.
6. Fermer la recherche restaure la première ligne habituelle.

### Règles

- La recherche ne s’ajoute pas comme une barre supplémentaire sous l’en-tête.
- Elle ne s’ouvre pas comme une fenêtre indépendante pour ce comportement.
- Tant qu’elle est active, elle reste visible.
- Sur la Carte, elle prend la forme d’une **barre flottante**, avec la carte toujours présente derrière et autour.

**À préciser :** présentation détaillée des résultats, recherche globale ou contextuelle selon l’écran, et comportement exact de la deuxième ligne pendant la saisie.

## 7. Menu latéral : accès et contenu

### Ouverture et fermeture

Deux accès sur les pages principales :

- toucher le bouton de menu fin ;
- glisser depuis le bord gauche vers la droite.

Le menu :

- glisse depuis la gauche ;
- occupe une partie de l’écran ;
- laisse voir une bande de la page à droite ;
- se ferme par glissement inverse ou par appui sur la page encore visible.

Sur la Carte, le geste doit commencer au bord pour le distinguer du déplacement cartographique. Sur le Profil, le menu reste accessible par glissement malgré la disparition du bouton.

**À préciser techniquement :** coexistence avec le geste retour du téléphone et les gestes de déplacement de la carte.

### Bloc identité

En haut du menu : photo, nom et identifiant de l’utilisateur. Un appui sur ce bloc ouvre son profil.

### Contenu

| Entrée | Statut dans les échanges |
|---|---|
| **Notifications**, avec nombre non lu | Retenue. |
| Enregistrés | Proposée ; cohérente avec les actions d’enregistrement retenues. |
| Historique des visites | Proposé ; confidentialité à respecter. |
| Badges et progression | Proposés ; apparition progressive des badges à conserver. |
| Récompenses | Proposées lorsqu’elles sont effectivement disponibles. |
| Paramètres et confidentialité | Proposés. |
| Aide | Proposée. |

La liste complète, son ordre et les éventuels regroupements restent à finaliser. L’ajout des Notifications est acté ; il ne vaut pas validation de toutes les autres entrées.

## 8. Notifications : emplacement et parcours

### Emplacement final

- Aucune cloche dans l’en-tête.
- Les notifications se consultent depuis **Menu → Notifications**.
- Une petite puce chiffrée, par exemple **1, 2, 3…**, apparaît sur le bouton du menu en présence de notifications non lues.
- **Aucune puce sur la photo de profil.** L’appui sur la photo reste exclusivement un accès au profil.
- Sur son propre Profil, le bouton du menu est remplacé par le retour. Le menu demeure accessible par glissement ; l’emplacement d’une éventuelle alerte alternative sur ce seul écran n’est pas défini.

### Comportement retenu pour la démo

1. Afficher, par exemple, une puce « 2 » sur le bouton du menu d’une page principale.
2. Ouvrir le menu.
3. Toucher « Notifications · 2 ».
4. Afficher deux notifications fictives, par exemple un J’aime et un commentaire.
5. Toucher une notification pour ouvrir le contenu concerné.
6. Marquer cette notification comme lue et diminuer le compteur.
7. Revenir à l’écran précédent en conservant son état.

Ouvrir le menu seul ne marque pas automatiquement les notifications comme lues. La puce disparaît lorsqu’il ne reste aucune notification non lue.

### Distinction à maintenir

| Élément | Où se trouve le compteur ? | Où se consulte le contenu ? |
|---|---|---|
| **Notifications d’activité** | Bouton du menu latéral | Menu → Notifications |
| **Messages non lus** | Icône Messages dans la barre du bas | Messages → conversation |

Il n’y a pas de fonction de partage ajoutée à la liste des notifications par cette conversation. Le partage d’une fiche vers un ami appartient à la messagerie.

## 9. Carte : immersion, exploration et fiches

### Fond cartographique

**Retenu : la carte remplit tout l’écran, bord à bord, y compris derrière les commandes.**

- Pas de grand bandeau opaque découpant le haut de la carte.
- Pas de symbole CHKPT dans son en-tête.
- Centre du haut dégagé.
- Bouton du menu, photo et recherche flottants.
- Filtres sous forme de petites capsules défilantes.
- Bouton de recentrage flottant sur le côté.
- Navigation du bas en capsule flottante.
- **Aucune publicité sur la Carte.**

Déplacer la carte ne masque pas ses commandes. Le mécanisme de disparition au défilement de l’Accueil ne s’applique pas au déplacement cartographique.

### Repères et découverte

- **Vert : lieu vérifié / validé.**
- **Gris : lieu non vérifié / non validé.**
- Filtres simples par catégorie dans l’expérience actuelle.
- Recherche, déplacement, zoom et recentrage à faire fonctionner dans le parcours.
- Aucun avatar d’ami ni suivi de position n’est ajouté simplement parce qu’il figurait sur une image de référence.

Le statut vérifié reste distinct du statut commercial de partenaire ou d’abonné.

### Consultation en deux étapes

| Étape | Action | Résultat |
|---|---|---|
| **1. Aperçu** | Toucher un repère | Petit panneau montant du bas, laissant la carte largement visible. |
| **2. Fiche complète** | Toucher « Voir le lieu » | Ouverture de la fiche complète en plein écran. |

L’aperçu comprend :

- photo ;
- nom ;
- statut vérifié ou non ;
- localisation et/ou distance ;
- bouton « Voir le lieu ».

Toucher un autre repère actualise l’aperçu et met en évidence le lieu sélectionné.

La fiche complète réunit les informations du lieu, ses visuels et ses actions, dont **Faire un check**, **Enregistrer** et **Partager** selon les parcours retenus. Son organisation exhaustive reste à détailler.

### Continuité

- Revenir de la fiche retrouve le cadrage et le zoom de la carte.
- La sélection ne doit pas forcer une réinitialisation de l’exploration.
- La fiche s’ouvre en plein écran ; la première interaction avec un repère reste un aperçu compact.

### Calques futurs

**Ultérieur :** prévoir dans la vision des calques permettant d’afficher différentes familles de contenus : restauration, vie nocturne, autres catégories de lieux et amis partageant leur position.

- Un **calque** détermine une famille d’éléments affichés.
- Un **filtre** affine une sélection, par exemple selon un critère d’ouverture ou de budget, si ces données sont disponibles.
- Les calques avancés et les positions d’amis **ne sont pas à intégrer maintenant**.

**Recommandation formulée, à spécifier avant cette évolution :** partage de position volontaire, désactivé par défaut, limité dans le temps et contrôlé par l’utilisateur. Un check ne doit pas activer automatiquement un suivi de position.

## 10. Bouton central ＋ / Check

### Panneau d’actions

Un appui ouvre un panneau compact depuis le bas. La page reste visible derrière.

| Ordre | Action | Intention |
|---|---|---|
| **1, prioritaire** | **Faire un check** | Confirmer sa présence dans un lieu. |
| **2** | **Créer une publication** | Partager une découverte ou un moment sans présence obligatoire. |

Les formulations « Tu es où ? » et « Partage une découverte ou un moment » ont été proposées comme textes d’accompagnement ; elles ne constituent pas des textes définitifs imposés.

### Parcours de check

1. Choisir un lieu parmi les lieux proches ou le rechercher.
2. Pouvoir proposer le lieu s’il manque, selon les règles de validation du produit.
3. Choisir la visibilité.
4. Confirmer sa présence.
5. Voir une confirmation brève « Check effectué ».
6. Recevoir la proposition facultative d’ajouter une photo, une vidéo ou un avis.
7. Publier ou choisir « Plus tard » pour reprendre son exploration.

**Depuis la fiche d’un lieu, celui-ci est déjà sélectionné.** Ne pas le redemander.

### Présence réelle et démonstration

- Dans le scénario de démonstration convenu, la présence est **simulée et signalée comme telle**.
- Un changement de commune consultée ne crée pas de présence.
- Une publication libre ou le partage d’une fiche ne crée pas de check automatiquement.
- Les règles GPS de production et les conditions d’attribution de XP restent distinctes de cette simulation.
- Le contexte antérieur réserve la progression liée aux visites aux check-ins admissibles ; aucun nouveau barème n’est validé ici.

## 11. Créer une publication

### Un éditeur commun

Le même éditeur sert :

- à créer une publication depuis le ＋ ;
- à compléter une expérience après un check ;
- à préparer une publication partageant une fiche lieu ou événement.

### Contenu et visibilité

- Texte.
- Photo ou vidéo facultative.
- Lieu facultatif pour une publication simple.
- Lieu déjà associé après un check.
- Fiche concernée déjà associée lors d’un partage en publication.
- Choix de la visibilité.
- Bouton Publier.

### Résultat attendu

- La publication créée apparaît dans le fil et sur le profil.
- Le résultat reste visible pendant la session.
- La confirmation est discrète.
- Publier depuis une fiche ne transforme pas le partage en preuve de présence.
- Si l’utilisateur quitte l’éditeur avec un contenu commencé, proposer de conserver un brouillon, conformément au comportement décrit dans l’échange.

**À préciser :** options exactes de visibilité, limites de médias, traitement des brouillons, erreurs de publication et articulation avec les règles de confidentialité déjà définies.

## 12. Interactions sociales sur les publications

Interactions à rendre opérantes dans la démonstration :

- aimer et retirer son J’aime ;
- ouvrir les commentaires ;
- écrire un commentaire et le retrouver ;
- enregistrer et désenregistrer ;
- toucher l’auteur pour ouvrir son profil ;
- toucher le lieu associé pour ouvrir sa fiche.

**Retenu pour la démo :** chaque action conserve son état pendant la session. Les compteurs et états visuels doivent rester cohérents entre le fil, le contenu détaillé et le profil.

Cette exigence ne prouve pas à elle seule une synchronisation serveur ou une persistance après fermeture complète de l’application.

## 13. Profil et retour

### Contenu du Profil

- Publications directement mises en avant, sous forme de fil.
- Grande photo et informations de profil conservées dans le contenu de la page.
- Éléments enregistrés et progression accessibles sans prendre la place principale des publications.
- Publication créée pendant la démonstration retrouvable ici.

### En-tête final de son profil

- **Flèche retour en haut à gauche.**
- **Aucun bouton visible du menu latéral à cet emplacement.**
- **Aucune petite photo de profil dans l’en-tête.**
- **Aucun symbole CHKPT dans l’en-tête.**
- Menu latéral toujours accessible par glissement depuis le bord gauche.

Ce choix corrige la proposition intermédiaire qui gardait un bouton menu sur le profil. L’utilisateur a demandé un retour explicite pour éviter une navigation lourde.

### Retour

La flèche ramène à l’écran depuis lequel le profil a été ouvert : fil, carte ou autre écran. Elle conserve la position ou le cadrage précédent.

## 14. Sortir

### Présentation conservée

- Grande mise en avant en ouverture.
- Rubriques illustrées ensuite.
- **Pas d’onglets supplémentaires en haut de Sortir.**
- Événements et contenus éditoriaux clairement identifiés.

### Rubriques proposées pour la démo

« Ce week-end », « À découvrir » et « Nos sélections » sont les exemples proposés. Les intitulés, le nombre de rubriques et leur contenu exact restent à finaliser.

### Interactions

- Toucher un événement ouvre sa fiche complète.
- « Ça m’intéresse », « J’y serai » et « Enregistrer » gardent leur état lorsqu’on revient.
- Toucher un article ouvre sa lecture.
- Les lieux cités dans un article donnent accès à leurs fiches.
- Le retour conserve la position de lecture dans Sortir.
- Les fiches événements utilisent le panneau de partage décrit ci-dessous.

## 15. Partage : décision finale et organisation exacte

### Périmètre

Le bouton **Partager** doit être disponible sur les fiches de lieux. Le même principe est retenu pour les événements.

### Présentation

- Un seul panneau arrondi monte depuis le bas.
- La page d’origine reste visible derrière.
- Le comportement visuel reprend la famille des panneaux utilisés pour l’aperçu d’un lieu sur la Carte.
- **Deux rangées horizontales défilantes**, et non deux colonnes.

### Première rangée : ce qui reste dans CHKPT

**Ordre retenu :**

1. **Publier dans mon fil.**
2. **Les amis de l’application**, sous forme de photos rondes avec leurs prénoms.

Toucher « Publier dans mon fil » prépare une publication contenant la fiche ; cela ne crée pas un check.

Toucher un ami prépare l’envoi de la fiche dans la conversation correspondante, avec possibilité d’ajouter un message avant de confirmer.

L’accès aux amis est direct dans cette rangée. Il ne se limite pas à une entrée générique « Message de l’application » qui imposerait d’abord un détour.

### Deuxième rangée : ce qui sort de CHKPT

- **Copier le lien.**
- Applications de partage disponibles, par exemple WhatsApp, Messenger et SMS.
- **Plus**, pour accéder aux autres possibilités de partage proposées par le système.

Instagram et ses modalités de partage ne doivent pas être présentés comme garantis : ils dépendent des capacités effectivement proposées par le téléphone et les applications installées.

### Tableau de référence

| Rangée | Contenu | Résultat |
|---|---|---|
| **Haut : interne** | Publier dans mon fil → avatars des amis | Préparer une publication CHKPT ou envoyer la fiche dans une conversation CHKPT. |
| **Bas : externe** | Copier le lien → applications disponibles → Plus | Copier ou transmettre un lien hors de CHKPT. |

**Correction impérative : « Publier dans mon fil » appartient à la rangée du haut.** Les propositions intermédiaires le plaçant dans la rangée du bas sont abandonnées.

### À préciser avant intégration réelle

- Liens de destination et ouverture de la fiche par un destinataire extérieur.
- Prévisualisation des liens.
- Actions disponibles selon le téléphone.
- Gestion des contenus privés, supprimés ou devenus indisponibles.
- Distinction entre une action extérieure réellement effectuée et un simple parcours illustratif dans le prototype.

## 16. Messages : expérience de démonstration validée

### Fonctionnement présenté

- Liste de conversations fictives.
- Ouverture d’une conversation.
- Envoi d’un message de démonstration.
- Réception ou affichage d’une fiche lieu/événement sous forme de carte cliquable.
- Ouverture de la fiche complète depuis cette carte.
- Retour à la même conversation et à la même position.
- Compteur de non-lus sur l’icône Messages du bas.

### Séquence approuvée

1. Ouvrir une fiche lieu.
2. Toucher Partager.
3. Choisir un ami dans la première rangée.
4. Ajouter éventuellement un message et confirmer.
5. Ouvrir Messages puis la conversation.
6. Retrouver la fiche envoyée sous forme de carte.
7. Toucher la carte pour rouvrir la fiche complète.
8. Revenir dans la conversation sans perdre sa position.

Cette séquence a été expressément acceptée pour la démonstration.

**À définir séparément pour une version réelle :** destinataires autorisés, confidentialité, blocage, signalement, stockage, synchronisation, gestion des erreurs et fonctionnement multi-utilisateurs. Aucun choix de protocole ou de serveur de messagerie n’a été arrêté dans cet échange.

## 17. Badges et publicités : règles à conserver

### Badges

- Découverte progressive.
- Pas de présentation immédiate de tout le catalogue.
- Introduire une progression ou un badge à un moment pertinent après une action.
- Ne pas surcharger la démonstration ou détourner l’attention de la découverte et du partage.

Le catalogue, les seuils et les barèmes relèvent des fiches de gamification antérieures ; ils ne sont pas redéfinis ici. Aucun nombre de XP supplémentaire n’est fixé par cette conversation.

### Publicités

- Conserver les emplacements prévus pour l’Accueil et Sortir.
- Bannières identifiées par la mention « Publicité ».
- Bannières non cliquables, conformément au cadrage rappelé.
- **Aucune publicité sur la Carte.**

La cadence historique rappelée dans la synthèse générale est :

| Emplacement | Référence historique |
|---|---|
| Accueil | Une bannière avant le fil, puis toutes les 10 publications. |
| Sortir | Une au début, puis après 3 rubriques. |
| Dans une rubrique | Une après 3 lieux/événements. |
| Articles | Bannières intégrées. |

**Statut de cette cadence :** référence antérieure à réconcilier avec la fiche publicitaire, comme le demandait le document produit. La conversation récente demande de conserver les emplacements déjà décidés ; elle ne fournit pas un nouveau recalcul détaillé de la cadence.

## 18. Continuité : ce qui doit être conservé

La fluidité repose sur la mémoire des écrans et des actions pendant la session.

| Élément | État à retrouver |
|---|---|
| Fil Accueil | Position de lecture, onglet et zone consultée. |
| Carte | Cadrage, zoom et sélection utile. |
| Sortir | Position dans la page et actions sélectionnées. |
| Publication | J’aime, commentaires et enregistrement. |
| Lieu ou événement | État enregistré et intentions sélectionnées. |
| Check | Lieu choisi, visibilité et résultat cohérent. |
| Éditeur | Lieu ou fiche associés ; contenu commencé selon le parcours de brouillon. |
| Profil | Publication créée et retour vers l’écran d’origine. |
| Messages | Conversation, carte envoyée, message et position. |
| Notifications | État lu/non lu et compteur correspondant. |

**À vérifier dans le code :** la persistance après rechargement, fermeture ou changement d’appareil. Le minimum retenu ici est la conservation pendant la session et au retour d’un écran.

## 19. Scénario complet de démonstration

### Étape 1 — Découvrir l’Accueil

Je découvre des publications fictives crédibles dans Pour toi. Je peux passer à Amis. Je vois le symbole CHKPT uniquement sur cet écran. L’icône de localisation permet d’explorer une autre commune, sans créer de check.

### Étape 2 — Vérifier le défilement et la recherche

Je fais défiler : les deux lignes du haut disparaissent. Au premier mouvement inverse, elles reviennent. La navigation flottante reste visible. Je touche la loupe : toute la première ligne devient une recherche. Je ferme et retrouve l’en-tête normal.

### Étape 3 — Explorer la Carte

J’ouvre Carte. Elle remplit l’écran derrière les commandes flottantes. Il n’y a ni symbole CHKPT en haut, ni publicité. Les lieux apparaissent en vert ou gris selon leur statut. Je peux déplacer, zoomer et me recentrer.

### Étape 4 — Découvrir un lieu

Je touche son repère : l’aperçu compact apparaît en bas. Je touche « Voir le lieu » : la fiche complète s’ouvre en plein écran. Un retour me rend le même cadrage cartographique.

### Étape 5 — Faire un check

Depuis la fiche, je choisis Faire un check. Le lieu est déjà sélectionné. Je choisis la visibilité et confirme la présence simulée, explicitement identifiée comme telle. Je vois une confirmation brève.

### Étape 6 — Publier ou continuer

Je peux ajouter une photo, une vidéo ou un avis, ou choisir Plus tard. Si je publie, le lieu est déjà associé. Je retrouve le contenu dans le fil et sur mon profil. Le ＋ permet également une publication sans check.

### Étape 7 — Interagir

J’aime une publication, j’ajoute un commentaire et je l’enregistre. Je peux retrouver ces actions et annuler le J’aime ou l’enregistrement. Toucher l’auteur ouvre son profil ; toucher le lieu ouvre sa fiche.

### Étape 8 — Partager la fiche

J’ouvre Partager. Je vois en haut « Publier dans mon fil » et les amis ; en bas « Copier le lien » et les applications extérieures disponibles. Je choisis un ami, complète éventuellement un message et confirme.

### Étape 9 — Retrouver le partage dans Messages

J’ouvre Messages puis la conversation. La fiche apparaît comme une carte cliquable. Je l’ouvre puis reviens à la même conversation. Le compteur Messages reste distinct de celui des notifications.

### Étape 10 — Consulter mon profil

Ma publication figure dans le fil du profil. En haut, une flèche retour remplace le bouton du menu. Il n’y a ni petite photo ni symbole CHKPT dans l’en-tête. Le menu reste accessible par glissement.

### Étape 11 — Revenir à mon point de départ

La flèche retour retrouve l’écran précédent. Les onglets principaux retrouvent leur état. Les publications, messages, J’aime, commentaires et éléments enregistrés demeurent présents pendant la session.

### Parcours complémentaire — Notifications

Depuis une page principale, j’ouvre le bouton menu portant une puce, puis Notifications. Je touche une activité fictive ; le contenu concerné s’ouvre et le compteur s’actualise. Cette séquence est distincte du partage et de Messages.

### Parcours complémentaire — Sortir

Je découvre une mise en avant, ouvre un événement, sélectionne « J’y serai » ou « Ça m’intéresse », enregistre et partage. Je retrouve ces choix au retour. Un article peut conduire vers une fiche lieu.

## 20. Corrections à appliquer aux anciens documents et visuels

| Ancienne proposition ou ambiguïté | Référence actuelle |
|---|---|
| Pour toi / Tendances / Amis | Pour toi / Amis seulement sur l’Accueil. |
| Profil dans la barre du bas | Messages dans la barre ; profil via photo ou identité du menu. |
| Symbole CHKPT dans plusieurs en-têtes | Symbole uniquement dans celui de l’Accueil. |
| Symbole en haut de la Carte | Retiré. |
| Carte encadrée par de grands bandeaux | Carte bord à bord et commandes flottantes. |
| Recherche ajoutée sous la ligne habituelle | Recherche remplaçant toute la première ligne. |
| Commune affichée en permanence | Icône seule ; commune visible dans le sélecteur. |
| En-tête accessible seulement en remontant tout en haut | Retour dès le premier petit mouvement inverse. |
| Photo de profil ouvrant le menu | Photo ouvrant directement le profil. |
| Menu accessible uniquement par glissement | Bouton fin sur les pages principales et glissement. |
| Bouton de menu sur son propre profil | Flèche retour ; menu conservé par glissement. |
| Cloche en haut | Notifications dans le menu latéral. |
| Puce de notification sur la photo | Puce sur le bouton du menu uniquement. |
| Détour par le profil pour consulter les notifications | Accès direct par le bouton menu des pages principales. |
| Fiche complète dès le premier appui sur un repère | Aperçu compact, puis « Voir le lieu » en plein écran. |
| Tous les badges présentés d’emblée | Découverte progressive. |
| Calques et amis géolocalisés dans la version actuelle | Évolutions ultérieures. |
| Publication dépendant obligatoirement d’un check | Publication libre possible. |
| Partage en deux colonnes | Deux rangées horizontales défilantes. |
| Publier dans mon fil rangé avec les applications externes | Action placée dans la première rangée, avec les amis. |
| Partage confondu avec les notifications | Partage vers publication, conversation ou extérieur. |
| Un compteur unique pour toute l’activité | Notifications sur menu ; messages non lus sur Messages. |
| Navigation réinitialisant chaque écran | Retour et changement d’onglet conservant les états. |

Les maquettes qui contredisent ces règles servent désormais d’historique, pas de référence finale.

## 21. Points qui restent ouverts

### Conception à préciser

- Liste définitive et ordre des entrées du menu latéral.
- Composition finale des en-têtes, dimensions et espacements.
- Résultats de recherche et comportement selon l’écran.
- Contenu exhaustif des fiches lieux et événements.
- Options exactes de visibilité et traitement des brouillons.
- Présence de la barre flottante dans chaque écran secondaire.
- Intitulés et contenu définitifs des rubriques Sortir.
- Articulation des gestes de menu, retour système et déplacement cartographique.
- Détails de la lecture des notifications et de leurs cas limites.

### Production à arbitrer ou vérifier

- Périmètre de messagerie pour la première version publique.
- GPS réel, contrôles de présence et règles anti-abus.
- Barèmes de XP, seuils et catalogue de badges applicable.
- Cadence publicitaire définitive.
- Fonctionnement des liens externes et des partages natifs.
- Persistance serveur et fonctionnement entre comptes réels.
- Authenticité des contenus, droits des images et autorisations d’utilisation.
- Protection des mineurs et confidentialité des déplacements.

### Hors de la version actuelle

- Calques cartographiques avancés.
- Position des amis sur la Carte.
- Ajout automatique d’éléments vus sur une référence mais non retenus.

### État technique non établi ici

Cette conversation ne démontre pas que ces règles sont déjà intégrées dans le dépôt, qu’un site a été déployé ou que les tests ont réussi. Les images et descriptions sont des références de conception. Chaque comportement doit être rapproché du code actuel avant de le présenter comme disponible.

Les budgets, salaires, rôles juridiques, droits au capital et financements ne sont pas révisés par ce récapitulatif UX.

## 22. Plan d’exécution recommandé

### A — Mettre à jour les références

- [ ] Ajouter ce récapitulatif au contexte central.
- [ ] Reporter les corrections dans les fiches UX concernées, sans refondre le document maître.
- [ ] Conserver les règles antérieures qui ne sont pas remplacées.
- [ ] Distinguer pour chaque fonction : conception retenue, simulation, implémentation et vérification.

### B — Construire le parcours principal

- [ ] Appliquer les en-têtes et la navigation flottante.
- [ ] Faire fonctionner le menu, la recherche et le retour sur le profil.
- [ ] Rendre la Carte immersive et conserver son cadrage.
- [ ] Relier repère → aperçu → fiche → check → publication.
- [ ] Retrouver la publication dans le fil et sur le profil.
- [ ] Conserver les états des interactions.

### C — Compléter les parcours associés

- [ ] Installer le panneau de partage à deux rangées dans le bon ordre.
- [ ] Relier l’envoi à un ami à sa conversation de démonstration.
- [ ] Ouvrir la fiche depuis une carte reçue dans Messages.
- [ ] Séparer les compteurs Notifications et Messages.
- [ ] Ajouter Sortir, les fiches événements et la lecture d’article.
- [ ] Introduire les badges au moment pertinent.
- [ ] Appliquer les publicités prévues hors de la Carte.

### D — Vérifier l’expérience

- [ ] Rejouer le scénario complet sans explication orale indispensable.
- [ ] Vérifier chaque retour et chaque changement d’onglet.
- [ ] Vérifier l’absence de pertes de position ou de contenu.
- [ ] Vérifier que publication et partage ne créent pas de check.
- [ ] Vérifier que la simulation de présence est identifiable.
- [ ] Tester les gestes et les zones tactiles sur téléphone.
- [ ] Tester les actions externes sur l’environnement réellement utilisé.
- [ ] Relever les fonctions absentes ou simulées avant présentation.

## 23. Critères de réussite de la démonstration

La démonstration est cohérente si une personne peut :

1. Comprendre les deux piliers, social et Carte.
2. Découvrir un lieu sans connaître déjà d’autres utilisateurs.
3. Ouvrir son aperçu puis sa fiche complète.
4. Effectuer le check simulé sans ressaisir inutilement le lieu.
5. Publier ou refuser de publier après le check.
6. Retrouver sa publication et ses interactions.
7. Partager une fiche à un ami et la retrouver dans Messages.
8. Distinguer partage interne, partage externe et notifications.
9. Revenir au fil, à la Carte et aux conversations sans perdre sa place.
10. Utiliser le profil et les retours sans se retrouver bloquée.

## 24. Message de transmission à la conversation centrale

> Intègre ce récapitulatif UX du 5 novembre 2026 aux références CHKPT. Il précise les dernières décisions sur les en-têtes, le menu, les notifications, la navigation flottante, la Carte immersive, le Profil, les publications, le partage à deux rangées et la séquence Messages de la démonstration. Sur ces sujets, applique les corrections finales recensées plutôt que les anciennes propositions contradictoires. Conserve les autres parties du document maître et travaille module par module. Distingue l’expérience retenue pour la démonstration, le périmètre du lancement public et les fonctions effectivement vérifiées dans le code. La priorité est maintenant de réaliser et tester le parcours complet, avec conservation des états et des positions.

---

**Base de consolidation :** échanges de conception de cette conversation, notamment les corrections finales et le scénario écrit ; document produit `03_CHKPT.md` et synthèse générale du 5 novembre 2026 pour le contexte antérieur. Aucune nouvelle étude de marché ni vérification du dépôt n’a été effectuée pour ce récapitulatif.

**Fin — CHKPT / RED LOOP — 5 novembre 2026.**
