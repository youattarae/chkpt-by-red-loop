# Stories et DM du superviseur — 9 novembre 2026

## Règles confirmées

- Un DM entre adultes publics ne nécessite aucun abonnement ni suivi réciproque. Le bouton Message est disponible depuis le profil autorisé ; il ouvre la conversation existante.
- Le superviseur seed `usr_admin`, dont le profil reste privé, peut désormais envoyer et recevoir des DM dans la démo privée uniquement. Les autres profils privés, les mineurs, les blocages et la limitation d’envoi restent protégés. Cette exception ne donne aucun accès aux contenus privés des autres.
- Les stories publiques sont accessibles au superviseur connecté. Les stories « Abonnés » nécessitent un abonnement simple : leur auteur n’a pas besoin de suivre le lecteur en retour.
- Aucune relation n’est créée automatiquement entre les profils. Les compteurs et le classement Amis ne sont pas modifiés.

## Pourquoi les exemples pouvaient disparaître

Les stories restent limitées à 24 h, y compris les exemples fictifs. Une base sauvegardée plusieurs jours auparavant peut donc ne plus contenir d’exemple actif. Le démarrage ne renouvelle pas silencieusement ces contenus.

Quand aucune story d’un autre profil n’est disponible et que la lecture serveur est terminée, la rangée affiche un état vide explicatif. Le superviseur peut y utiliser **Préparer les stories fictives**. L’ancienne action dans **Profil → Gérer mon compte** est également conservée. Elle recrée explicitement les exemples expirés, sans réinitialiser comptes, publications, visites, XP, abonnements ou stories personnelles. Les exemples expirent à nouveau après 24 h.

## Fichiers et validation

`server/contentAccess.ts` : éligibilité du superviseur bornée à la démo privée. `src/components/stories/Stories.tsx` : état vide après chargement et action de préparation dans la rangée existante. Aucun bloc ajouté entre les stories et les onglets.

`tests/supervisor_stories_dm.test.ts` : tests serveur et navigateur mobile 390 px, base temporaire, exemples périmés, préparation par le bouton Accueil, ouverture d’un profil sans abonnement et bouton Message, échange dans les deux sens, refus privé/mineur/blocage, abonnement simple pour une story Abonnés, conservation des données personnelles et refus des DM opérateur hors démo privée.

Les règles de DM sans abonnement étaient déjà présentes pour les profils majeurs publics. Le changement répare le cas du superviseur ; il ne supprime pas les protections des autres comptes.

## Résultat exécuté

Recette complète : **54/54 groupes réussis**, TypeScript et build réussis. [Journal complet](verification-2026-11-09/recette-54-stories-dm.txt). Les tests ont utilisé des bases jetables, sans reset de données personnelles. Les exemples doivent être préparés manuellement sur la machine de présentation ; publier le code ne renouvelle pas les stories de cette machine.
