# Messagerie et menu personnel — 2 novembre 2026

## Utilisation

- Ouvrir ☰ : le menu vient de la gauche, avec une photo ronde et le nom en haut.
- Choisir **Messages privés** pour voir les conversations et leurs compteurs non lus.
- Pour commencer : rechercher un profil dans Accueil, ouvrir sa page, toucher **Message**.
- Écrire puis **Envoyer**. Les messages sont conservés sur le serveur commun et retrouvés après rechargement ou depuis un autre appareil connecté au même serveur.
- La liste se rafraîchit toutes les cinq secondes lorsque la page est visible. Ouvrir une conversation marque ses messages reçus comme lus. Retour conserve les parcours par pages.

## Périmètre du prototype

Conversations texte à deux, 2 000 caractères maximum. Profils majeurs publics uniquement ; les comptes opérateur et les mineurs ne peuvent pas échanger. Le statut public du profil ne rend pas les messages publics : le serveur filtre chaque lecture par l'identité authentifiée. Le client ne choisit jamais l'expéditeur. Une nouvelle tentative identique évite le double envoi.

Pas de pièces jointes, groupes, appels, suppression, notifications push, blocage ou signalement spécifique aux messages dans ce lot. Pas de chiffrement de bout en bout : les administrateurs ayant accès à la base ou à ses sauvegardes peuvent lire les textes. Réserver cette version à la démonstration entre participants connus ; le blocage, le signalement et une politique de conservation sont nécessaires avant une ouverture plus large.

Limites : 20 envois par minute et par compte, 10 000 messages au total pour le prototype, 200 derniers messages affichés par conversation. Les sauvegardes chiffrées incluent les messages ; réinitialiser la démo les efface aussi. Une ancienne sauvegarde sans messagerie reste compatible et restaure une liste vide. Un hébergement gratuit sans disque persistant ne garantit toujours pas la conservation après redémarrage.

## Vérification

Tests API et navigateur ajoutés : authentification, isolation d'un tiers, refus mineur, longueur, anti-doublon, non lus, échange et rechargement, position gauche et portrait du menu. Voir le résultat final de la suite dans IMPLEMENTATION_STATUS.md.

Résultat local : lint, build et suite navigateur complète réussis, **45/45 groupes**. Guides PDF/PPTX régénérés avec 43 pages/diapositives et captures réelles du menu et de la conversation. Aucune base personnelle modifiée.

Fichiers principaux : `server/messages.ts`, `server/db.ts`, `server.ts`, `src/components/messages/MessagesPage.tsx`, `src/components/navigation/SideMenu.tsx`, `src/components/profile/OtherProfile.tsx`, `src/navigation/Navigation.tsx`, `src/App.tsx`, `tests/messages_browser.ts`, `tests/lot_a.test.ts`. Documentation, captures et guides mis à jour dans le même lot.
