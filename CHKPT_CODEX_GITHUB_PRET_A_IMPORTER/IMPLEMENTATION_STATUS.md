# IMPLEMENTATION_STATUS — CHKPT & RED LOOP

**Dernière mise à jour :** 26 octobre 2026  
**Version :** Lot P0 & Prototype Démo Haut de Gamme (FrancoTech Cocody & Investisseurs)  
**Projet :** CHKPT (application grand public) & RED LOOP (infrastructure & opérateur)  
**Suite de tests :** `npm test` -> 11/11 tests réussis (0 échecs)

---

## 1. Tableau d'avancement par verticale

| ID / Module | Intitulé & Périmètre | Statut | Détails & Implémentation |
|---|---|---|---|
| **P0-A / Auth** | Comptes, sessions, permissions & verrouillage opérateur | **Validé Serveur (Tests 1, 2, 8, 9)** | Inscription (`/api/auth/register`), connexion (`/api/auth/login`), sessions 256 bits, hachage `scrypt` avec sel. Détection mineurs (13-17 ans) forçant le profil privé. **Verrouillage strict de l'espace RED LOOP** : réservé aux rôles `admin` / `moderator` et protégé par middleware `requireOperator`. Séparation DÉMO / PRODUCTION. |
| **P0-B / Check-in** | Moteur de check-in vérifié, géolocalisation & transactions XP | **Validé Serveur (Tests 3, 4, 5)** | Calcul géodésique Haversine exécuté **côté serveur** (`POST /api/checkins`). Seuil strict de 250 mètres autour des coordonnées réelles du lieu. Protection anti-fraude en production. Idempotence journalière interdisant le double comptage et la duplication d'XP. Preuves isolées (`checkin_proofs`). |
| **P0-C / Médias** | Téléversement sécurisé, purge EXIF & audience stricte | **Validé Serveur (Tests 6, 7)** | `POST /api/media/upload` : déduction du propriétaire **exclusivement depuis le token de session** (impossible de falsifier un `ownerId`). Validation serveur MIME (`image/jpeg`, `image/png`, `image/webp`) et taille (<15 Mo). `GET /api/media/:assetId` : contrôle strict d'accès (403 Forbidden pour non-auteurs sur les médias privés). |
| **P0-Pitch Reset** | Réinitialisation instantanée du scénario de démonstration | **Validé Serveur (Test 11)** | `POST /api/demo/reset` : remise à zéro instantanée de l'état serveur et du cache navigateur (`resetDemoPitchState`), permettant de rejouer le pitch de 3 minutes à l'infini devant le jury sans blocage d'idempotence. |
| **P0-Persistance** | Base de données persistante & intégrité | **Opérationnel (Test 10)** | Moteur persistant sur disque (`server/db.ts` dans `.data/chkpt_db.json`) avec écritures atomiques. Schémas complets : `users`, `sessions`, `places`, `checkins`, `checkin_proofs`, `points_ledger`, `follows`, `reports`. Données préservées après redémarrage serveur. |
| **A01–A12** | Onboarding & profil utilisateur | **Fonctionnel** | Profil avec visibilité paramétrable, accès complet à l'historique des visites personnelles pour le propriétaire, jauge XP synchronisée avec le serveur. Modale de compte et de bascule de profil (`AuthModal.tsx`). |
| **B01–B10** | Accueil, flux Pour toi / Amis, publications & interactions | **Prototype Interactif** | Feed unifié avec publications de visites vérifiées, création de post libre ou post-visite, likes, commentaires, respect strict de la cadence publicitaire. |
| **C01–C10** | Carte interactive d'Abidjan & filtres | **Prototype Interactif** | Repères réels d'Abidjan (Cocody, Plateau, Marcory, Riviera) sur canvas interactif, marqueurs vérifiés (vert) vs non vérifiés (gris), aperçu fiche, zéro pub. |
| **D01–D08** | Fiche détaillée des lieux, horaires, budget, avis vérifiés | **Fonctionnel** | Fiche lieu complète avec statut d'exploitation, statut de vérification, avis conditionnés à visite vérifiée, signalement transmis au service de modération. |
| **F01–F09** | Sortir, rubriques éditoriales, sélections & cadences publicitaires | **Fonctionnel** | Structure d'annuaire éditorial : Aujourd'hui, Ce week-end, En ce moment, guides. Bannières non cliquables insérées selon la cadence stricte. Grounding Google Maps en direct via Gemini 3.8 Flash. |
| **G01–G06** | Événements, intentions « Ça m'intéresse » / « J'y serai » | **Fonctionnel** | Fiches événements, dates UTC avec fuseau Abidjan (GMT), bascule d'intentions réversibles. |
| **J01–J05** | Gamification, 8 familles de badges, journal de points (Ledger) | **Fonctionnel Démo** | 8 familles CHKPT (Explorateur, Foodie, Maquis Master, Culture Hunter, Event Hunter, Pionnier, Photographe, Multi-Explorer). Déblocage dynamique lors du check-in (ex: Maquis Master débloqué sur visite maquis avec alerte toast). |
| **I01–I03 / 13** | Notifications push locales & Préférences (I01/I02) | **Fonctionnel** | Service push conforme à la Section 13 & 21.16 : Web Notification API native doublée d'un bandeau interactif in-app (`InAppNotificationToast`). Plafond strict de rétention : max 3 pushs/semaine. Heures calmes (22h00 – 08h00). Toggles par catégorie. |
| **11.1** | Régie publicitaire RED LOOP non cliquable | **Fonctionnel** | Bannières visuelles non cliquables marquées « Publicité », rotation de campagnes, aucune publicité sur la Carte ni sur le Check-in. |
| **K01–K08** | Espace Pro mobile & abonnements 5 000 FCFA | **Futur (Roadmap)** | Prévu en phase ultérieure RED LOOP hors application grand public. |
| **Groupe** | Check-in collaboratif / partagé (« Avec qui ? ») | **Réservé (Désactivé)** | Conception conservée selon la consigne du fondateur, non activée au MVP. |
