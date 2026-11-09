# Audit et complétion CHKPT — 9 novembre 2026

Base : b962dfbeb27856e1604464ef47b00a03b3b4776a ; dépôt propre avant intervention, branche dédiée `feat/audit-completion-2026-11-09`. Aucun push/merge/déploiement autorisé. Référence intégrale archivée dans `references/2026-11-09`.

## État initial constaté avant modifications

TypeScript, build et **49/49 groupes historiques exécutés avec succès** : `verification-2026-11-09/baseline-49.txt`. Ces succès ne prouvent pas les nouvelles décisions du 9 novembre.

| ID | Fonction | État initial | Code / preuve initiale |
|---|---|---|---|
| R01 | Conservation du travail | FAIT + TESTÉ, défaut de conservation des lieux à corriger | Git propre, HEAD b962dfb ; db.load remplace places par CANONICAL_PLACES |
| R02 | Barre basse | FAIT + TESTÉ | BottomNav, menu_badges_plus_browser et visual_direction_browser |
| R03 | Deux actions ＋ | FAIT + TESTÉ | App, menu_badges_plus_browser |
| R04 | Menu exact | FAIT + TESTÉ | SideMenu, menu_badges_plus_browser |
| R05 | Stories/scroll/24 h | FAIT + TESTÉ | Stories, stories_test, stories_scroll_browser |
| R06 | Collection badges | FAIT + TESTÉ | BadgesView/BadgeArt, menu_badges_plus_browser ; moteur conservé |
| R07 | Nettoyage carte/outils | PARTIEL | DynamicMap garde cinq Centrer ; radar hors panneau Outils carte |
| R08 | Texte bas gauche | À FAIRE | MapView et DynamicMap affichent les deux textes à retirer |
| R09 | Pictogrammes | À FAIRE | Marqueurs circulaires génériques, hôtel/événement absents |
| R10 | Statut/sponsor | PARTIEL | Gris/vert existants ; sponsoring absent |
| R11 | Carte personnalisée | À FAIRE | Leaflet/tuiles OSM raster avec POI ; pas de style filtré |
| R12 | Import OSM | À FAIRE | Aucun import/provenance ; accès externe actuellement 403 |
| R13 | Fiche canonique/doublons | PARTIEL | IDs stables des seeds ; imports, propositions persistantes et conciliation absents |
| R14 | Check non vérifié | À FAIRE | checkinEngine crédite actuellement tout lieu admissible, même non vérifié |
| R15 | Crédit rétroactif | À FAIRE | pending_validation existe comme type, pas comme parcours métier |
| R16 | Profil → DM | PARTIEL | Bouton Message présent, refus serveur protégés ; visibilité UI à aligner |
| R17 | Story → DM | À FAIRE | Aucun champ de réponse ni référence Story dans les DM |
| R18 | Partage DM | PARTIEL | Place/événement opérationnels et testés ; publication absente |
| R19 | Repost référencé | À FAIRE | Post ne contient pas de référence à une publication source |
| R20 | Externe réel | PARTIEL | Natif/copie/WhatsApp/SMS testés pour fiches ; publication absente |
| R21 | Trois badges près du lieu | À FAIRE | OtherProfile liste les badges dans un bloc séparé |
| R22 | Choix persistant | À FAIRE | Pas de préférence serveur de badges du profil |
| R23 | Carrousel | À FAIRE | PublicationCard affiche une grille 2 colonnes |
| R24 | Recette nouvelle | FAIT, TEST À COMPLÉTER | 49 groupes historiques réussis ; décisions nouvelles non couvertes |

## Ordre et critères de réalisation

1. Conserver les éléments R02–R06 ; nettoyer la Carte, puis carrousel, préférences de badges et contrats sociaux. Tester chaque delta, propriétaire/tiers/mineur/source expirée ou privée inclus.
2. Ajouter la provenance et l’import OSM idempotent avec dry-run, contrôle des doublons et conciliation conservant les corrections locales. Préserver les lieux existants au chargement et les relations lors d’une fusion explicite.
3. Migrer progressivement le fond vectoriel, avec style sans POI commerciaux et secours. Les marqueurs restent des fiches CHKPT indépendantes du fournisseur.
4. Checks en attente sur lieu non vérifié, vérification opérateur, crédit unique selon le barème existant et notifications privées ; tests de redémarrage, preuves suspectes, fusion et double appel.
5. Recette complète, captures et matrice finale avec états réellement obtenus. Bases temporaires uniquement, aucun reset de base personnelle.

## Blocages externes constatés

Le 9 novembre, accès aux pages officielles OpenFreeMap (accueil/quick start/style), copyright OSM et documentation Overpass : `Tunnel connection failed: 403 Forbidden`. Ne pas prétendre avoir vérifié leurs conditions actuelles, ni avoir importé des établissements réels. Les sources locales déterministes seront étiquetées synthétiques. Les validations du fournisseur en ligne et les obligations juridiques ODbL avant exploitation publique sont distinguées des développements vérifiables localement.


## Matrice de réalisation du 9 novembre

Les résultats ci-dessous distinguent code livré et dépendances externes. Le détail des commandes et résultats définitifs est dans `verification-2026-11-09/README.md`. Les colonnes de tests désignent les suites, pas une promesse de service externe.

| Fonction | État initial | Modifications | Tests concernés | État final | Limites |
|---|---|---|---|---|---|
| R01 Conservation | Partiel : remplacement des lieux au chargement | Chargement conservateur, migration additive, transactions, alias | nov9_places, historique migration/persistance | Implémenté | Base JSON, une instance écrivante |
| R02 Navigation | Implémenté/testé | Conservée | menu_badges_plus, visual_direction, ux_lots | Conservé | Émulation mobile |
| R03 Deux actions ＋ | Implémenté/testé | Conservées | menu_badges_plus, stories_browser | Conservé | Aucune action ajoutée au menu ＋ |
| R04 Menu exact | Implémenté/testé | Conservé | menu_badges_plus | Conservé | Pas de nouvelle rubrique |
| R05 Stories/scroll | Implémenté/testé | Module réutilisé pour référence DM | stories_test, stories_scroll, nov9_social | Conservé et étendu | 24 h serveur, aucun archivage public |
| R06 Collection | Implémenté/testé | Conservée ; choix des badges du profil séparé | menu_badges_plus, nov9_browser | Conservé | Barème provisoire existant |
| R07 Outils carte | Partiel | Retrait des cinq Centrer, radar et liste dans Outils carte | radar_browser, nov9_browser | Implémenté | Fond réel externe à vérifier |
| R08 Texte bas gauche | Absent | Deux blocs retirés ; indications de simulation conservées dans les commandes | nov9_browser | Implémenté | Secours explicitement schématique |
| R09 Pictogrammes | Absent | Sept variantes communes aux deux cartes | nov9_places, nov9_browser | Implémenté | Hôtel/événement = affichage sous catégorie autre |
| R10 Statut/sponsor | Partiel | Gris/vert + ✓/? ; halo rouge indépendant ; pas d’annonce cliquable | nov9_places, nov9_browser | Implémenté/simulé | Sponsors de démonstration fictifs |
| R11 Fond CHKPT | Absent | MapLibre, worker local, style filtré, caméra et secours | nov9_browser, radar_browser | Partiel externe | Style de test synthétique ; fournisseur réel bloqué 403 |
| R12 OSM | Absent | Import API/CLI, dry-run, provenance, source versionnée, attribution | nov9_places | Partiel externe | Aucun extrait réel importé ; licence/conditions à valider avant usage public |
| R13 Fiche canonique | Partiel | Propositions persistantes, correspondances manuelles, corrections prioritaires, fusion et alias | nov9_places | Implémenté | Pas d’automatisation de rapprochement douteux |
| R14 Check non vérifié | Absent | En attente, 0 XP, publication facultative sans mention vérifiée | nov9_retro, nov9_browser | Implémenté | Distance et contrôles inchangés |
| R15 Rétrocrédit | Absent | Décision opérateur, preuve historique, registre unique, notification privée, examen manuel | nov9_retro, nov9_browser | Implémenté | Mois du crédit conservé, pas de réécriture des mois passés |
| R16 Profil → DM | Partiel | Bouton autorisé par le serveur, blocages symétriques | nov9_social, messages_browser | Implémenté | Périmètre majeur/public existant conservé |
| R17 Story → DM | Absent | Réponse dans messagerie existante, référence dynamique, média masqué après expiration | nov9_social, nov9_browser | Implémenté | Texte DM conservé après expiration |
| R18 Partage DM | Partiel | Publication/Story ajoutées aux fiches lieu/événement | nov9_social, nov9_browser, ux_lots | Implémenté | Source toujours recontrôlée |
| R19 Repost | Absent | Référence canonique, auteur/source, accès original, aucun média/réaction copié | nov9_social, nov9_browser | Implémenté | Source indisponible masquée |
| R20 Externe | Partiel | Publication ajoutée aux liens natifs/copie/WhatsApp/SMS | sharing_history_browser, nov9_browser | Implémenté | L’ouverture d’applications tierces sur téléphone reste matérielle |
| R21 Badges près du lieu | Absent | Trois symboles acquis maximum, inline, nom au toucher | nov9_browser, demo_profiles_browser | Implémenté | Aucun XP total public |
| R22 Choix badges | Absent | Prestige automatique ou choix ordonné persistant, serveur propriétaire | nov9_social, nov9_browser | Implémenté | Seulement les badges déjà acquis |
| R23 Carrousel | Absent | Composant commun, 1–4 médias, points, glissement/clavier, vidéo muette | nov9_browser, post_media_browser | Implémenté | Codecs et gestes Safari à vérifier sur appareil |
| R24 Recette | Ancienne baseline seulement | Suites serveur et navigateur étendues, captures datées | recette complète et journal daté | Voir résultat définitif | Émulation Chromium, pas un téléphone physique |

## Composants réutilisés et décisions préservées

Navigation/pages/Retour, Header, SideMenu, Stories et ses 24 h, DM et compteurs, ShareSheet, EntityCard, PublicationCard, BadgeArt, BadgesView, Store et synchronisation serveur ont été prolongés. Les fichiers nouveaux isolent le style/marqueurs, le carrousel, les permissions de contenu, les sources de lieux et le crédit différé. React/TypeScript/Vite/Express, médias, comptes et catalogue de badges sont conservés. Aucune réinitialisation ni migration d’une base personnelle.

Décisions encore ouvertes : publicité au-delà de la cadence provisoire existante, catalogue/barème final des badges, ouverture publique de Messages, attribution éventuelle au mois historique de visite. Aucun de ces points n’est présenté comme arbitré par le développement. Aucun hébergement payant, push ou merge.

## Fichiers principaux par module

- Carte : `src/components/map/VectorMap.tsx`, `MapView.tsx`, `MarkerSymbol.tsx`, `shared/mapStyle.ts`, `shared/mapMarkers.ts`. Fond interchangeable, filtrage des libellés, statut et radar communs.
- Référentiel : `server/osmPlan.ts`, `placeRepository.ts`, `placeRoutes.ts`, `server/db.ts`, `scripts/import-osm.mts`, `PlaceAdminTools.tsx`, `PlaceProvenance.tsx`. Import sans effet secondaire sur les comptes, conservation au chargement, fusion explicite et provenance.
- Checks : `server/checkinEngine.ts`, `placeVerification.ts`, `server/events.ts`, `CheckinModal.tsx`, `VisitedPlaces.tsx`. Attente sans XP et crédit conditionné à la preuve ; événements conservés après alias.
- Social : `server/contentAccess.ts`, `social.ts`, `stories.ts`, `messages.ts`, `entities.ts`, `src/components/stories/Stories.tsx`, `EntityCard.tsx`, `ShareSheet.tsx`, `PublicationCard.tsx`. Réutilisation des DM et contrôles d’accès au contenu actuel.
- Profil/médias : `shared/profileBadges.ts`, `ProfileBadgeSymbols.tsx`, `ProfileBadgePicker.tsx`, `ProfileView.tsx`, `OtherProfile.tsx`, `MediaCarousel.tsx`, `SafeVideo.tsx`, `src/services/store.tsx`. Préférences serveur, placement compact et composant commun de lecture.
- Tests : `nov9_social.test.ts`, `nov9_places.test.ts`, `nov9_retro.test.ts`, `nov9_browser.ts`, intégrés à `tests/lot_a.test.ts`. Les tests historiques de radar, profils et recherche ont été adaptés aux nouvelles décisions ; le seuil de présence et les contrôles d’accès restent vérifiés.

Complément de fluidité : `src/components/auth/AuthModal.tsx` annule les fermetures différées devenues périmées, pour qu’une fenêtre Compte rouverte reste ouverte. Régression reproduite avant correction puis testée avec horloge contrôlée dans `tests/auth_modal_race.ts`, intégré à la recette du 9 novembre. `LocationControls.tsx` et `geoService.ts` proposent les deux positions fictives supplémentaires lorsque leurs fiches existent ; le check en attente est maintenant essayé par les boutons, et non uniquement par requête API.


## Résultat et prochaine étape justifiée

Recette finale **53/53 groupes réussis**, TypeScript et build réussis, audit des dépendances d’exécution sans vulnérabilité signalée. [Journal complet](verification-2026-11-09/recette-53.txt). Code testé : `ac5186f`. Les premières exécutions ont permis de corriger les défauts décrits dans les preuves ; aucune augmentation de délai ni désactivation de protection serveur pour obtenir le résultat final.

La prochaine étape utile est de vérifier le fournisseur réel depuis un réseau autorisé, examiner les conditions applicables, obtenir un petit extrait OSM autorisé de Cocody et passer son dry-run avant import, puis répéter sur le téléphone d’Ingrid. Pas de nouvelle refonte, pas de backend de production. Une publication GitHub ou un déploiement reste soumis à l’accord explicite du porteur.
