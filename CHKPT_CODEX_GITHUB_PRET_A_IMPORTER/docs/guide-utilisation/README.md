# Guide complet de l’application actuelle

Version intégrée du 5 novembre 2026 : navigation, partage interne, Messages, brouillons et notifications.

- [Lire le PDF — 48 pages](../GUIDE_UTILISATION_COMPLET.pdf)
- [Ouvrir le PowerPoint modifiable — 48 diapositives](../GUIDE_UTILISATION_COMPLET.pptx)
- [Guide de répétition et lancement Mac/Windows/téléphone](../GUIDE_PRESENTATION.md)

Les supports utilisent des captures actuelles d’un serveur/base temporaires et des données synthétiques, jamais une base personnelle. Chaque fichier reste inférieur à 40 Mo. Aucun logiciel de programmation n’est nécessaire pour les lire.

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
| 42 | Le menu personnel à gauche |
| 43 | Envoyer et retrouver ses messages privés |
| 44 | Le partage en deux rangées |
| 45 | Conserver sans publier |
| 46 | Lire une fiche et revenir au bon endroit |
| 47 | Deux compteurs, deux usages |
| 48 | Stories : ordre et défilement |

## Régénération développeur

Source commune : `contenu.json`. Captures : `docs/captures/guide-utilisation`. Python 3 avec python-pptx et Chromium Playwright sont requis seulement pour régénérer les fichiers.

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/capture-current-guide.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/create-user-guide.mjs
node scripts/create-presentation-support.mjs
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/create-visual-guide.mjs
```

Le premier script démarre puis supprime un serveur/base temporaires, sans remise à zéro d’une démo existante. Le générateur du PDF vérifie les images intégrées, le fonctionnement sans réseau, l’absence de dépassement et la limite de taille. Le rendu natif PowerPoint/Keynote et les gestes sur téléphone réel restent à essayer sur vos appareils.
