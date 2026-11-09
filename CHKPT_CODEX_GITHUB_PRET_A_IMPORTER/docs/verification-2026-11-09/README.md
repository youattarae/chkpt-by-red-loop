# Preuves de vérification — 9 novembre 2026

Branche locale `feat/audit-completion-2026-11-09`, base `b962dfb`. Aucune modification de main, aucun push, merge ou déploiement. Node 24.19, Chromium système `/usr/bin/chromium`, Linux. Données temporaires sous `/tmp/chkpt-*`, secrets de test aléatoires ; aucune base personnelle ouverte ou remise à zéro.

## Résultat final exécuté

**53/53 groupes réussis**, commande `npm run test:browser` terminée avec code 0. TypeScript et build réussis. Audit des dépendances d’exécution : **0 vulnérabilité signalée**. Code et tests au commit local `ac5186f` ; la suite comprend le test de réouverture Compte, l’import/fusion par l’interface et la synchronisation des XP sans rechargement imposé. Le journal complet est [recette-53.txt](recette-53.txt).

Preuves : [TypeScript](lint.txt), [compilation](build.txt), [audit npm](audit-dependances.txt), [services externes bloqués](services-externes.txt), [échec de reproduction avant correctif Compte](auth-fermeture-avant.txt), [réussite ciblée après correctif](cibles-nov9.txt). Aucune exécution GitHub Actions n’est revendiquée : pas de push autorisé.

## Baseline préalable

Avant modification : TypeScript, build et 49/49 groupes historiques réussis. Journal `baseline-49.txt`. Ces succès ne valident pas les nouvelles exigences.

## Commandes de recette

```sh
npm ci
npm run lint
npm run build
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser
npm audit --omit=dev --audit-level=high
```

Le cache npm de travail est `/tmp/chkpt-nov9-npm-cache`. Le navigateur Playwright installé par CI convient aussi, sans variable d’exécutable. `npm run test:nov9 -- social places retro browser` permet des tests ciblés avec bases jetables. Ne jamais diriger ces tests vers une base personnelle.

## Couverture nouvelle

- Import API et CLI sans écriture en dry-run ; provenance synthétique distincte d’OSM, rerun, version source, correction locale conservée, propositions et rapprochement manuel, fusion et anciens liens, redémarrage sans remplacement des lieux.
- Check en attente/0 XP, refus hors rayon et doublon, deux vérifications concurrentes, rejet, déplacement du centre, approbation manuelle encadrée, répétition après redémarrage, visites sur deux jours à 75/50 XP, faux doublon historique et mauvaise précision sans crédit.
- Publication → DM, repost idempotent sans copie des médias/réactions ; original privé/supprimé masqué. Story → DM, confidentialité, mauvais destinataire, mineur, blocage, média direct refusé, expiration et texte conservé.
- Choix serveur de badges acquis uniquement, ordre et persistance ; profil inline à 320/390/1280 px et deux thèmes, trois maximum.
- Carrousel réel 1/2/4 médias : largeur d’un média, points sans compteur numérique, clavier, geste tactile synthétique, vidéo générée pour le test et muette par défaut.
- Carte MapLibre effectivement rendue avec WebGL logiciel : style local synthétique, marqueurs canoniques, radar recentré, géométrie de 250 m, sept variantes, sponsor non vérifié, retrait des anciens raccourcis, panne du fournisseur et secours.
- Parcours opérateur depuis Réglages, décision de vérification, retour utilisateur avec crédit unique ; historique en attente privé.

## Échecs intermédiaires et corrections

Le premier essai MapLibre compilé ne démarrait pas son worker. L’import Vite explicite du worker corrige le défaut. Le point de position pouvait intercepter le clic sur un lieu aux mêmes coordonnées : il ignore maintenant les événements de pointeur. Plusieurs tests historiques attendaient Leaflet, six lieux ou un bloc de badges séparé : ils suivent les nouvelles décisions et gardent les assertions d’accès, de navigation et de persistance. Le test du panneau Carte a aussi été corrigé pour distinguer ses deux listes dépliantes. Une première répétition a dépassé son délai sous plusieurs suites simultanées ; la répétition isolée a réussi aux deux largeurs, sans augmentation du délai. Les journaux définitifs sont distingués de ces essais intermédiaires.

## Limites des preuves

Les captures `../captures/2026-11-09` sont des émulations Chromium, pas des captures d’iPhone réel. Le fond local est synthétique, pas un extrait réel de carte ; les imports de test sont fictifs, pas des établissements vérifiés de Cocody. Les erreurs 403 des sites externes sont archivées séparément. Aucun succès de téléchargement/fourniture réelle ne doit être déduit des tests.

Safari/iPhone, Chrome Android, GPS HTTPS réel, faible réseau, ouverture des applications de partage et répétition sur le matériel d’Ingrid restent à essayer. Les conditions actuelles du fournisseur et les obligations ODbL avant exploitation publique restent à vérifier. Le build signale la taille du module cartographique chargé à la demande ; sa fluidité sur un téléphone ancien n’est pas démontrée par l’émulation.

Le test de conciliation a révélé qu’une source secondaire fusionnée pouvait reprendre la position de la fiche conservée au prochain import. L’identité de la fiche cible est maintenant protégée comme correction locale. Le test contrôle la stabilité des coordonnées, les événements après alias et leur crédit de présence. L’import CLI est indépendant du chargement de la base applicative : les tables de comptes/sessions et tous les contenus personnels sont comparés à l’identique avant/après.

Le parcours de crédit différé est aussi essayé entièrement par l’interface : sélection de la position fictive de l’hôtel dans GPS, ＋ → Faire un check → confirmation à 0 XP, historique privé, décision opérateur et synchronisation du profil sans rechargement imposé, puis rechargement pour vérifier la persistance. Deux positions fictives sont ajoutées aux commandes GPS uniquement lorsque leurs fiches existent.

Un défaut de fermeture différée du panneau Compte a été reproduit avec une horloge de navigateur contrôlée : après connexion, fermeture manuelle puis réouverture, l’ancien délai fermait le nouveau panneau. Le même test échoue avant correction et réussit après annulation du délai à la fermeture/réouverture/démontage. Le changement ne touche pas les mots de passe, rôles ou permissions. La transition de compte dans le test multiappareil attend aussi la fermeture effective du panneau.

Les boutons de l’opérateur ont été essayés avec le JSON synthétique : fichier → aperçu → application de trois lignes admissibles → fusion explicite → ouverture de l’ancien lien vers la fiche conservée. Ces actions ne portent jamais sur des lieux personnels ou un import réel.
