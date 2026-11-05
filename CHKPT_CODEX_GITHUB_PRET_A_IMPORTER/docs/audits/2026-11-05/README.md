# Preuves de l’audit du 5 novembre 2026

Base auditée : `6c4652a311d180da4c6cdda084e6604ea40d4860`.

- `observations-ux.json` : mesures Chromium 390 et 1280 px sur base temporaire ; mode illustré forcé par refus des tuiles externes. Lecture des commandes et parcours, pas modification de l’application.
- `non-regression.txt` : commande `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:browser`, arrêt au groupe 27 après 26 groupes réussis. Timeout au clic de confirmation en 1280 px.
- `check-cible.txt` : nouvelle exécution de la fonction existante `checkBrowser` de `tests/lot_a_browser.ts` sur un autre serveur/base isolés, 390 et 1280 px réussis. Aucun délai ni code changé. Origine de l’instabilité non établie.

Lint et build ont réussi avant ces essais. Les groupes 28–45 n’ont pas été exécutés dans la suite interrompue. Aucun serveur de présentation existant ni aucune base personnelle ne sont utilisés dans ces essais.

Les dates/ports et chemins des journaux correspondent à des processus temporaires. Aucun mot de passe ou jeton de session n’y est publié.
