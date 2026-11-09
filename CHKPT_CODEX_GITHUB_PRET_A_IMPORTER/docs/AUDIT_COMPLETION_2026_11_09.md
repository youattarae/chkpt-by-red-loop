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
