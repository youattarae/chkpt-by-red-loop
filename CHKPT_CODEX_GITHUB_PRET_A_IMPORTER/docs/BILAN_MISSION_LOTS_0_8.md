# CHKPT — bilan de la mission intégrée du 5 novembre 2026

Branche : `feat/ux-demo-lots-0-8`. Base préservée : `de87f2f` et `6c4652a`. Dernier commit fonctionnel avant la recette finale : `d07f4b20416481fa68f4476755446f4ac3087619`. Des commits documentaires peuvent suivre ; le dernier hash exact est fourni dans le compte rendu de livraison.

**Aucun push, merge, changement de main, déploiement, achat ou réinitialisation de base personnelle.** Les serveurs de tests et de captures utilisent exclusivement des répertoires temporaires. Les remises à zéro exercées par les tests concernent ces bases jetables.

## Lots et résultat

| Lot | État logiciel | Livré et vérifié |
|---|---|---|
| 0 — Base | Terminé ; cause historique du timeout non démontrée | Branche dédiée, références prioritaires dans AGENTS, migrations additives, validation des nouvelles collections, sauvegardes et données conservées. Scénario de clic vérifié sans augmentation du délai ; aucune restauration de focus/scroll derrière un dialogue. |
| 1 — Navigation | Terminé | Capsule Accueil/Carte/＋/Sortir/Messages, point bordeaux, profil via photo/identité, retour propre, menu gauche par bouton ou geste ; compteurs séparés et symbole uniquement en en-tête Accueil. |
| 2 — Accueil/recherche | Terminé | Deux onglets, stories conservées, rédaction déplacée au ＋, recherche remplaçant la première ligne, en-tête directionnel, icône de commune ; exploration distincte de la position de preuve. États conservés pendant la navigation. |
| 3 — Carte/fiches | Terminé dans l’environnement testé | Leaflet pleine largeur, radar, capsules, zoom/recentrage, couleurs vert/gris, aperçu puis fiche, caméra/sélection conservées, secours illustré schématique et cibles accessibles. |
| 4 — Check/publication | Terminé | Deux actions centrales, check depuis fiche prérempli, audience explicite, contrôles/XP inchangés, publication facultative, éditeur commun et brouillons par compte ; quatre médias conservés. |
| 5 — Messages | Terminé pour le périmètre de démo | Textes et cartes lieu/événement, non-lus globaux, retour stable dans la discussion, conservation et reprise d’envoi, exemples fictifs, restrictions des participants maintenues. |
| 6 — Partage | Terminé ; capacités externes dépendantes du téléphone | Panneau commun à deux rangées, publication/amis réciproques en haut ; copier, WhatsApp, SMS et Plus en bas. Préparation puis confirmation d’envoi, liens sans preuve ni secret, indisponibilités gérées. |
| 7 — Parcours associés | Terminé, arbitrages publicitaires/badges conservés | Articles fictifs avec fiches citées, événements enregistrables/partageables, trois catégories d’enregistrés, notifications et préférences via menu, activité/cibles et lecture ; seuils et cadence Accueil inchangés. |
| 8 — Recette/livraison | Terminé côté logiciel ; répétition sur appareils réels à faire | Guides/captures régénérés ; PDF/PPTX 48 pages/diapositives, PDF rapide 10 étapes et HTML autonome 4 étapes ; accès privé gratuit documenté sans activation. La recette réelle iPhone/Windows/PowerPoint reste à faire avec Ingrid. |

## Fonctionnement réellement opérationnel

- Comptes et sessions serveur, rôle opérateur contrôlé, bascule de personnages et remise à zéro autorisées avec confirmation ; anciens accès prévisibles refusés.
- Publications libres ou liées à une visite/fiches, audiences, import et lecture de quatre médias maximum, likes/commentaires, stories 24 h.
- Profils publics autorisés, suivis, listes de relations, badges accessibles sans XP total ni historique d’autrui.
- Recherche par portées, suggestions et pages de résultats, filtres catégorie/distance ; moteur externe facultatif avec erreur claire sans configuration.
- Carte interactive et secours, aperçu/fiches, avis 1–5, favoris lieux, historique propriétaire.
- Visites contrôlées côté serveur, rayon 250 m, limite journalière, journal XP, reprise réseau sans crédit supplémentaire, moteur de badges provisoires.
- Messages textuels et références typées lieu/événement, participants imposés par session, non-lus, lecture en bas de conversation ; compteur séparé de l’activité.
- Partage de fiche en publication ou vers un ami réciproque avec confirmation ; liens externes dépourvus de jeton/coordonnées de preuve/historique.
- Enregistrements distincts de posts, lieux et événements sur le serveur ; anciennes listes de favoris lieux conservées.
- Notifications serveur de J’aime/commentaires autorisés et lecture de cible ; notifications locales de progression et préférences conservées.
- Brouillons de publication par compte sur cet appareil, thème clair/sombre, retours avec état de lecture, sauvegarde chiffrée et restauration protégée.

## Simulations et fonctions reportées

Personnages/portraits, publications de départ, établissements, événements, articles, publicités et conversations de départ sont fictifs. Certains chiffres, la progression initiale, récompenses, propositions et actions de console restent des démonstrations. Les fixtures nouvelles sont ajoutées une seule fois aux personnages de démo ; elles ne remplacent ni ne suppriment les messages personnels.

La simulation de position est signalée et permise seulement dans une démo autorisée. Le GPS navigateur et le rayon serveur ne prouvent pas l’authenticité d’un signal terrain.

Reportés : lancement public, paiement/billetterie, revendication professionnelle complète, QR partenaire réel, calques avancés/position des amis, infrastructure de production, chiffrement de bout en bout, appels/fichiers joints/blocage et signalement complets des DM. La messagerie publique n’est pas arbitrée.

## Tests et preuves

### Résultats intermédiaires constatés

- Lint et build réussis.
- Première suite serveur : **25/25 groupes** (11 tests historiques compris).
- Tous les scénarios navigateur historiques adaptés réussis séparément, dont mode dev sans rechargement de données, thèmes/contrastes, profils/rechargement, visites, publication, Carte/radar/secours, avis, relations, historique privé, données et médias entre deux navigateurs, stories, cas limites, messages.
- Nouvelle recette intégrée réussie à **320, 390 et 1280 px** : partage puis cartes DM et retours, brouillon/publication, article, check de fiche prérempli, reprise sans double XP. Partage/publication libre/exploration n’ajoutent pas de visite.
- Nouvelles assertions serveur ajoutées pour événement partagé, expéditeur forgé, tiers/mineurs refusés, activité lue par propriétaire, enregistrements séparés, contacts réciproques et limitation des envois. Exécution comprise dans la relance finale.

### Résultat global après les dernières modifications

**TypeScript et build réussis ; suite complète : 48/48 groupes réussis, aucun échec dans la recette finale.** Suite historique de 11 tests comprise. [Journal complet, versions et empreintes](verification-2026-11-05/README.md). Exécution sur Chromium Linux ; les six configurations Stories comprennent clavier et toucher émulé, sans test physique Safari/Windows.

Commande :

```sh
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
```

Les assertions historiques liées à l’ancienne navigation ont été adaptées à la nouvelle référence, sans suppression des vérifications de droits, audiences, doublons, médias et sauvegardes. Les échecs intermédiaires ont révélé des cibles superposées dans le secours, un double Retour, un chargement affichant transitoirement les données de seed, des sorties de compte/console et des panneaux restant ouverts ; correctifs consignés dans `MISSION_LOTS_0_8.md`. Les échecs d’anciens libellés ne sont pas présentés comme des réussites. Une relance après l’addendum a aussi révélé une hypothèse fragile du test Amis : il supposait les relations vides avant une réponse réseau, malgré les relations de démonstration. Le scénario crée désormais explicitement cet état vide par l’API protégée sur sa base jetable, puis vérifie le contenu du fil ; aucune durée d’attente n’a été augmentée.

Le timeout du 5 novembre observé avant développement n’a pas de cause démontrée unique. Les scénarios ont été rejoués sans relever simplement leur délai ; ne pas le présenter comme une panne de serveur définitivement expliquée.

## Conservation des données

Aucune base personnelle n’a été ouverte ou réinitialisée par les tests. Tables d’origine conservées. Champs optionnels de fiche dans les messages/posts et collections `saved_content`/`activity` ajoutés avec valeurs par défaut pour les anciennes données. Les sauvegardes restent chiffrées et compatibles, les sessions sont révoquées à restauration comme auparavant. Une table nouvelle invalide refuse le chargement avant écriture ; les tests vérifient les octets inchangés du fichier endommagé.

Avant mise à jour sur votre ordinateur, garder l’ancien dossier complet et préserver `.env` et `.data`. La présence de tests ne dispense pas de conserver une sauvegarde réelle avant remplacement.

## Documents et supports actualisés

- [Guide Ingrid, lancement Mac/Windows et téléphone](GUIDE_PRESENTATION.md)
- [Guide PDF complet — 48 pages](GUIDE_UTILISATION_COMPLET.pdf)
- [Guide PowerPoint — 48 diapositives modifiables](GUIDE_UTILISATION_COMPLET.pptx)
- [Sommaire et génération](guide-utilisation/README.md)
- [PDF rapide — 10 étapes](DEMONSTRATION_PAS_A_PAS.pdf)
- [HTML de secours autonome](DEMO_SECOURS.html)
- [Captures actuelles](captures/guide-utilisation)
- [Accès privé gratuit préparé](ACCES_PRIVE_DISTANCE.md)
- [Audit de départ, matrice et plan validé](AUDIT_REPRISE_ET_PLAN_2026_11_05.md)

Supports contrôlés : images intégrées, 48 pages PDF A4, texte extractible, absence de débordement détecté, export sans réseau, PPTX rouvert avec python-pptx et archive intègre sans macro. PDF complet et PPTX environ 3 Mo chacun, PDF rapide environ 1,7 Mo ; tous sous 40 Mo. Le rendu dans le logiciel Microsoft PowerPoint/Keynote lui-même n’a pas été testé ici.

## Risques et décisions restantes

- **Appareils réels :** gestes de bord Safari/retour système, clavier virtuel, autorisations GPS et menus de partage externes à répéter sur le téléphone d’Ingrid et son Windows. Aucun test physique annoncé comme réalisé.
- **Données :** fichier JSON et sauvegarde manuelle de prototype ; l’hébergement gratuit préparé peut dormir/perdre son disque. Aucun lien distant actif ni engagement payant.
- **GPS :** précision déclarée par le navigateur, pas antifraude de production ; simulation explicitement identifiée, preuves privées.
- **Mineurs/DM :** âge déclaré, profils mineurs privés et DM refusés ; sans vérification d’identité, chiffrement de bout en bout ou chaîne de modération de production. Démo entre participants connus.
- **Stockage :** 15 Mo par média, quota média existant ; 2 000 caractères par DM, 20 envois/minute et 10 000 messages au total, 200 derniers messages affichés par discussion. Pas de pagination d’archive de messagerie dans ce lot.
- **État local :** thèmes, intentions d’événements, certaines notifications, brouillons et récompense liés à l’appareil ; recherches/zoom/positions conservés lors de navigation, sans promesse de synchronisation de ces préférences entre appareils.
- **Arbitrages :** messagerie au lancement public (consentement, blocage/signalement, privés, mineurs, conservation), catalogue/grades/seuils officiels des badges, cadence définitive de publicité (5 conservé sur Accueil contre l’historique 10), emplacements Sortir/articles, exploitation réelle des récompenses.
- **Partage :** relations réciproques pour les avatars du panneau dans la démo ; cette règle n’est pas un arbitrage permanent de toutes les relations sociales. Les applications externes et l’accès du destinataire au serveur ne sont pas garantis.
- **Publication :** branche locale seulement ; accès GitHub/PR distante non modifié ni confirmé par cette mission. Le frontend livré demeure inspectable ; pas de promesse d’impossibilité de reverse engineering.

## Addendum Stories — intégré à la mission

Ordre implémenté : première ligne de commandes → bande de stories horizontale → Pour toi/Amis et GPS → contenus du fil. Les stories sont dans le flux normal et ne reviennent pas lors du simple rappel de l’en-tête. Le bandeau de bienvenue et l’annuaire sont conservés après les onglets.

Composants réutilisés : Stories/StoryAvatar, Welcome, Header, FeedView ; onglets/GPS extraits dans FeedTabs. Aucun second module de stories. Trois fixtures fictives ajoutées en démo privée uniquement, sans changement d’audience des personnes et sans remplacement de leurs contenus. Expiration réelle après 24 h, absence de renouvellement silencieux, préparation explicite réservée à l’opérateur. Médias expirés ou hors démo privée inaccessibles.

Vérification dédiée réussie dans six configurations Chromium : 320/390/1280 px × clair/sombre. Ordre, lecture, clavier/Échap, tap émulé, défilement horizontal, sortie de la bande au scroll, rappel des seules commandes et conservation de la position entre onglets. Captures dans `captures/ux-2026-11-05/stories-ordre-*.png`. Il ne s’agit pas de tests matériels Safari/iPhone.

La relance intégrée a trouvé un défaut réel après reset : une ancienne seconde purge vidait les médias que la base venait de recréer pour les stories fictives. Cette purge redondante a été supprimée ; le reset conserve maintenant uniquement les nouveaux médias de seed et supprime bien les anciens. Test serveur ajouté : trois fixtures lisibles avant/après reset et anciennes URL rendues indisponibles. Le scénario de défilement exige toujours le chargement réel du média protégé, sans accepter l’image de secours comme réussite.

Le contrôle des illustrations de présentation attend désormais, dans une seule observation, `complete` et des dimensions positives pour toutes les images. La propriété `complete` seule peut aussi décrire une image en erreur avant l’affichage de son secours. Les deux répétitions de présentation (390/1280) passent avec ce contrôle renforcé et le même délai. Journaux intermédiaires conservés dans `verification-2026-11-05` ; ils documentent les échecs corrigés et ne remplacent pas la recette finale.
