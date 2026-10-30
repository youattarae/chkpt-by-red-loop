# CHKPT — angles morts, logique et fluidité

Revue du 30 octobre 2026, sur le code `541aada`. Objectif : fiabiliser un prototype de présentation, sans nouvelle application ni infrastructure de production.

## Résultat

**Dix comportements problématiques reproduits** sur une base temporaire fictive et un serveur isolé, sous Chromium à 390 px. Les pertes de réponse et erreurs réseau ont été provoquées volontairement pour observer la reprise. Aucune base personnelle ou de présentation n’a été réinitialisée.

La précédente suite de 43 groupes réussit ses scénarios ; elle ne couvre pas tous ces cas limites. Ce rapport ne transforme pas dix constats d’échec en dix tests réussis. **Ces défauts restent à corriger : cette revue ne modifie pas le comportement de l’application.**

[Résultats bruts des dix observations, sans secret ni jeton](audits/2026-10-30/resultats-cas-limites.json).

## P1 — à traiter avant une répétition avec des données à conserver

### 1. Des états personnels traversent le changement de compte

**Reproduction :** avec le compte A, valider le maquis pour obtenir des notifications de badges et sélectionner « J’y serai ». Se connecter ensuite avec un nouveau compte B dans le même navigateur. Dans Sortir, le choix reste sélectionné ; le centre de notifications montre encore trois notifications de progression provenant du premier compte.

**Conséquence :** attribution trompeuse d’une intention au nouveau compte et affichage local de notifications du compte précédent. Le fait que ces intentions soient locales ne justifie pas de les partager entre comptes. Cette observation ne démontre pas un contournement de l’API des historiques, qui reste une protection distincte.

**Cause :** le changement de session remet à zéro publications/visites/registre/favoris, mais pas les événements et notifications ; leur cache n’est pas propre au compte, et le centre affiche toutes les notifications sans filtrer leur destinataire.

**Sources :** [store.tsx](../src/services/store.tsx), lignes 150–155, 239–290, 323–347 et 667–694 ; [NotificationCenterModal.tsx](../src/components/common/NotificationCenterModal.tsx), ligne 107.

**Correction recommandée :** séparer les données locales par identifiant de compte, purger les états et toasts à chaque changement, filtrer les notifications par destinataire. Tester A → B → A ainsi que la déconnexion.

### 2. Un check privé est suivi d’une publication publique sans choix explicite d’audience

**Reproduction :** compte adulte public, laisser le check sur « Moi seul », confirmer puis écrire et publier le souvenir. Mesure serveur : visite `private`, publication liée `public`.

**Conséquence :** l’utilisateur peut croire conserver la confidentialité qu’il vient de choisir. Le check et sa preuve restent privés côté serveur ; c’est la publication volontaire suivante qui révèle le lieu. Il ne s’agit pas d’une publication automatique. Les mineurs et comptes privés restent soumis à la confidentialité forcée du serveur.

**Cause :** le formulaire de publication suivant le check ne transmet pas d’audience ; le serveur choisit public par défaut pour un adulte public. La publication ordinaire n’offre pas non plus ce choix.

**Sources :** [CheckinModal.tsx](../src/components/checkin/CheckinModal.tsx), lignes 120–131 ; [store.tsx](../src/services/store.tsx), ligne 623 ; [social.ts](../server/social.ts), ligne 32.

**Correction recommandée :** rendre l’audience visible et modifiable avant Publier ; après un check privé, proposer une audience privée par défaut, avec changement explicite si l’utilisateur veut partager publiquement. Conserver la distinction entre visite et publication et les contrôles serveur.

### 3. « Démarrer la démo » peut effacer bien plus que ce que l’écran laisse entendre

**Reproduction :** créer un compte fictif ajouté, vérifier sa connexion, puis actionner Démarrer la démo avec un opérateur autorisé. La connexion de ce compte retourne ensuite 401, car la base a été remplacée par le jeu de départ.

**Conséquence :** perdre les comptes et contenus préparés pour Ingrid en pensant simplement lancer la présentation. L’API est bien protégée ; le problème est la portée destructive et sa présentation. Les guides préviennent déjà, mais pas suffisamment le bouton lui-même.

**Cause :** l’action remplace toute la base par le seed, sans confirmation intermédiaire. Le texte du bouton de réinitialisation voisin parle des checks d’aujourd’hui, du fil et des points, sans annoncer la suppression des comptes ajoutés.

**Sources :** [AuthModal.tsx](../src/components/auth/AuthModal.tsx), lignes 156–172 et 358–376 ; [db.ts](../server/db.ts), lignes 503–506.

**Correction recommandée :** distinguer « Ouvrir la démo existante » et « Remettre toute la base à zéro », avertissement complet et confirmation explicite pour la seconde. Proposer une sauvegarde avant effacement ; conserver les rôles serveur. Ne pas remettre les données à zéro pour résoudre un simple problème de connexion.

### 4. Un cache local abîmé peut produire un écran blanc au démarrage

**Reproduction :** cache `chkpt_abidjan_v1_events` contenant un JSON invalide, puis rechargement. Résultat : exception de lecture JSON et racine de l’application vide. Un cache d’une mauvaise forme, par exemple un objet à la place d’une liste, constitue un autre cas à couvrir.

**Conséquence :** application inutilisable avant même d’offrir un bouton d’aide. Un serveur sain n’empêche pas cette panne locale.

**Cause :** plusieurs lectures de localStorage exécutent directement `JSON.parse`, sans validation ni repli. La protection du cache historique ne couvre pas ces autres clés. Il n’y a pas de frontière d’erreur React au démarrage.

**Sources :** [store.tsx](../src/services/store.tsx), lignes 160–162, 239–240, 248–290 ; [main.tsx](../src/main.tsx).

**Correction recommandée :** lecture défensive et validation minimale de chaque cache, repli sur les données sûres, gestion des échecs d’écriture de stockage. Offrir une récupération locale ciblée sans effacer la base serveur, les sessions ou tous les favoris par défaut.

### 5. Réponse de check perdue : visite enregistrée, écran d’échec et publication bloquée

**Reproduction :** laisser le serveur traiter le check, puis interrompre uniquement sa réponse. L’interface affiche Présence non confirmée, alors que le serveur contient une visite vérifiée et 75 XP. Fermer, recommencer sur le même lieu : refus « déjà validée » et aucun bouton Créer une publication.

**Conséquence :** incompréhension devant le jury et perte de la suite du parcours. L’anti-doublon fonctionne : il ne faut surtout pas le désactiver pour résoudre cela.

**Sources :** [store.tsx](../src/services/store.tsx), lignes 503–520 et 613–620 ; [CheckinModal.tsx](../src/components/checkin/CheckinModal.tsx), lignes 99–118.

**Correction recommandée :** représenter « résultat inconnu, vérification en cours » plutôt qu’un refus de présence ; rapprocher la tentative des visites serveur du propriétaire et reprendre sa confirmation/publication sans nouveaux points. Prévoir aussi la fermeture de la fenêtre pendant une requête en cours.

## P2 — cohérence et confort à corriger ensuite

### 6. La saisie et les résultats peuvent porter sur deux personnes différentes

**Reproduction :** rechercher Ingrid ; dans les résultats, remplacer le champ par Georges sans valider, puis Filtres → Profils → Appliquer. Le champ contient Georges mais le statut indique **« 1 résultat pour Ingrid »**.

**Cause :** la barre garde sa saisie locale, tandis qu’Appliquer remplace la route avec l’ancienne requête validée.

**Source :** [SearchExperience.tsx](../src/components/search/SearchExperience.tsx), lignes 34–40 et 55–57.

**Correction recommandée :** distinguer clairement saisie non validée et recherche affichée, ou valider la saisie courante lors d’Appliquer. Champ, titre, URL et résultats doivent rester cohérents, y compris au retour.

### 7. Appliquer une distance supprime la catégorie choisie par puce

**Reproduction :** Carte → Maquis : deux lieux. Filtres → distance de 10 km → Appliquer : six lieux et disparition du bandeau de catégorie active, sans avoir demandé d’enlever Maquis.

**Cause :** le traitement d’Appliquer vide systématiquement les catégories sélectionnées, même si seule la distance a changé.

**Source :** [MapView.tsx](../src/components/map/MapView.tsx), ligne 87.

**Correction recommandée :** une source d’état commune aux puces et au panneau ; conserver les puces lors d’un changement de distance/tri. Définir explicitement le remplacement si le menu déroulant choisit une autre catégorie. Les puces ont aussi besoin d’un état sélectionné accessible, pas seulement d’une couleur.

### 8. Un favori peut rester coché sans avoir été enregistré

**Reproduction :** bloquer l’écriture du favori et la resynchronisation, puis Enregistrer le lieu. Le bouton devient Retirer des favoris, avec `aria-pressed=true`, alors que le serveur n’a aucun favori correspondant. Une alerte globale existe ; le bouton continue néanmoins d’affirmer l’état enregistré.

**Cause :** mise à jour visuelle anticipée sans retour à l’état précédent en cas d’échec ; la correction dépend d’une relecture réseau ultérieure qui peut échouer elle aussi.

**Source :** [store.tsx](../src/services/store.tsx), lignes 657–664.

**Correction recommandée :** état en cours, confirmation explicite ou retour arrière sur refus ; en cas de réponse perdue, réconciliation avant d’affirmer le résultat. Garder le message d’erreur près de l’action et pas seulement en haut de la page.

### 9. Un profil correctement rechargé conserve son ancienne erreur

**Reproduction :** première ouverture d’Ingrid avec une réponse 503, retour puis retour avant du navigateur avec une réponse correcte. Son profil apparaît mais **« Profil indisponible »** reste affiché.

**Cause :** la réussite met à jour le profil, sans effacer l’erreur précédente.

**Source :** [OtherProfile.tsx](../src/components/profile/OtherProfile.tsx), lignes 21–29.

**Correction recommandée :** états de chargement/erreur/succès cohérents, réessai visible, effacement de l’erreur après réussite. Distinguer aussi un ancien contenu mis en cache d’une réponse récente confirmée.

### 10. Échap ne ferme pas le check-in

**Reproduction :** ouvrir le check-in, appuyer sur Échap : la fenêtre reste visible. Cette observation a été répétée après un résultat de validation refusé. Les stories utilisent déjà un dialogue natif avec gestion de la fermeture ; le check-in utilise une autre convention.

**Source :** [CheckinModal.tsx](../src/components/checkin/CheckinModal.tsx), ligne 155.

**Correction recommandée :** conventions cohérentes entre fenêtres : Échap, focus au bon endroit et retour au bouton déclencheur, navigation clavier contenue. Définir séparément le comportement pendant une écriture ou avec un brouillon, pour ne pas perdre le contenu silencieusement. L’absence de fermeture par Échap est reproduite ; un audit complet au lecteur d’écran reste à faire.

## Hypothèses fragiles et limites à garder distinctes des dix reproductions

1. **GPS réel supposé précis et simulation supposée toujours choisie.** La précision envoyée est fixée à 15 m, au lieu d’utiliser celle du navigateur ; un échec GPS bascule automatiquement en simulation. Sources : `store.tsx`, lignes 398–425 et 512–516. Lecture du code, sans nouvel essai physique GPS. Proposer explicitement le simulateur et expliquer une précision insuffisante ; ne pas revendiquer une présence antifraude de production.
2. **Compteurs d’abonnés supposés correspondre aux listes.** Les totaux préchargés (389, 142…) sont fictifs, les listes montrent les relations réelles accessibles du prototype. C’est un choix de démo documenté, pas un bug d’API. Rendre cette différence plus visible ou afficher les compteurs réels du petit jeu de personnes.
3. **Hébergement gratuit supposé conserver le travail.** Le stockage éphémère peut perdre les ajouts. La sauvegarde est manuelle, l’hébergement n’est pas encore activé. Il faudra vérifier export/restauration et prévenir clairement l’animateur.
4. **Chromium supposé représenter Safari et Windows.** Les dix reproductions portent sur Chromium Linux. Un vrai essai sur les appareils d’Ingrid et du porteur reste nécessaire, surtout vidéos, autorisations GPS, partage natif, clavier et connexion par hotspot.
5. **Quarante pages supposées borner toute la mémoire.** Les pages montées sont bornées, mais les tables de défilement et de focus gardent des entrées sans éviction. Lecture de `Navigation.tsx`, lignes 35–41 ; aucune mesure de fuite mémoire ou de ralentissement n’est revendiquée. Vérifier une session longue et libérer les références des pages retirées.

## Ordre de correction recommandé

1. Isoler les comptes et clarifier l’audience des publications.
2. Sécuriser l’usage de la remise à zéro et le démarrage avec un cache imparfait.
3. Reprendre un check après une réponse perdue sans doublon de points.
4. Unifier recherche, puces et filtres ; rendre les favoris et erreurs honnêtes.
5. Harmoniser fermeture/focus, puis répéter sur les vrais appareils avant activation distante.

Chaque correction doit ajouter le scénario de non-régression correspondant aux contrôles existants. Aucun besoin de réécrire la stack, d’ajouter tous les badges ni d’activer un hébergement payant pour traiter ces points.
