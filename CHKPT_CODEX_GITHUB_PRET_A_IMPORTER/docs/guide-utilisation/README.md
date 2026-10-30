# Guide complet de l’application actuelle

Version du 30 octobre 2026 : navigation par pages et corrections des dix cas limites incluses.

- [Lire le PDF — 41 pages, environ 2,6 Mo](../GUIDE_UTILISATION_COMPLET.pdf)
- [Ouvrir le PowerPoint modifiable — 41 diapositives, environ 2,7 Mo](../GUIDE_UTILISATION_COMPLET.pptx)

Le PDF s’ouvre dans un navigateur ou un lecteur PDF. Le PowerPoint s’ouvre avec Microsoft PowerPoint, Keynote ou un lecteur compatible. Aucun logiciel de programmation n’est nécessaire pour les lire. Tous les visuels et scénarios sont fictifs.

## Sommaire

| Page / diapositive | Sujet |
|---|---|
| 1 | CHKPT — guide d’utilisation complet |
| 2 | Les cinq boutons à connaître |
| 3 | Ce que montre cette version |
| 4 | Lancer sur Mac ou Windows |
| 5 | Utiliser le téléphone ou le hotspot |
| 6 | Se connecter ou créer un compte |
| 7 | Pour toi, Amis et publications |
| 8 | Chercher : suggestions ou résultats |
| 9 | Affiner les résultats |
| 10 | Réagir, commenter et enregistrer |
| 11 | Créer une publication |
| 12 | Jusqu’à quatre images ou vidéos |
| 13 | Choisir qui voit votre contenu |
| 14 | Trouver un lieu sur Carte |
| 15 | GPS : Simulateur ou GPS Réel |
| 16 | Lire et partager une fiche |
| 17 | Laisser un avis sur un lieu |
| 18 | Proposer un lieu manquant |
| 19 | Choisir le lieu et confirmer |
| 20 | Comprendre le résultat |
| 21 | Si la connexion se coupe |
| 22 | Partager après la visite |
| 23 | Ajouter une story |
| 24 | Lire une story depuis un profil |
| 25 | Votre profil compact |
| 26 | Voir et suivre une autre personne |
| 27 | Le menu reste toujours personnel |
| 28 | Retrouver vos lieux |
| 29 | Badges, progression et journal XP |
| 30 | Le classement des explorateurs |
| 31 | Sélections et événements |
| 32 | Essayer une récompense fictive |
| 33 | Thème, GPS et notifications |
| 34 | Partager les données entre appareils |
| 35 | Voir l’aperçu d’un établissement |
| 36 | Les outils opérateur |
| 37 | Sauvegarder et restaurer |
| 38 | Changer de personnage ou tout remettre à zéro |
| 39 | La répétition d’Ingrid en trois minutes |
| 40 | Les blocages les plus fréquents |
| 41 | Avant de partir présenter |

## Reprendre le guide

Le texte commun aux deux formats se trouve dans `contenu.json` et les captures dans `docs/captures/guide-utilisation`. Les captures proviennent d’un serveur/base temporaires : aucune remise à zéro de données personnelles.

Génération développeur : `python-pptx` doit être disponible dans Python 3, et Chromium pour Playwright. Exécuter depuis le dossier du prototype :

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/create-user-guide.mjs
```

Cette commande génère le PPTX puis le PDF depuis la même source, vérifie les images hors connexion, l’absence de débordement PDF et la limite de 40 Mo. Elle ne lance pas de serveur et ne modifie aucune base. Les prérequis concernent seulement la régénération des supports, pas leur lecture.
