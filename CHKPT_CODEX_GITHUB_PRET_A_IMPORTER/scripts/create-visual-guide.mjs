import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const docs=new URL('../docs/',import.meta.url);
const steps=[
 ['accueil','1. Découvrir CHKPT','Accueil : Pour toi et Amis, avec stories et recherche par la loupe.','La capsule du bas donne accès à Accueil, Carte, ＋/Check, Sortir et Messages. Le profil s’ouvre par votre photo.','Les personnes, lieux, contenus et publicités sont fictifs.'],
 ['carte','2. Explorer la Carte','Toucher un repère pour voir son aperçu, puis Voir le lieu.','Déplacement, zoom, radar de 250 m et filtres sont conservés. Le secours illustré est schématique et signalé.','Aucune publicité sur la Carte ; le vert et le gris distinguent les statuts.'],
 ['fiche-lieu','3. Consulter avant de sortir','La fiche présente les illustrations, informations, avis et actions.','Faire un check ouvre ce lieu déjà sélectionné. Enregistrer conserve la fiche ; Partager n’enregistre aucune visite.','Retour retrouve votre contexte de découverte.'],
 ['check-confirme','4. Simuler une visite autorisée','Confirmer le check, avec une visibilité explicite.','Dans le scénario du maquis, une visite admissible ajoute 75 XP ; la simulation et les paliers provisoires sont signalés.','Un doublon n’ajoute pas de points. Plus tard permet de continuer sans publier.'],
 ['check-publication','5. Publier volontairement','Créer une publication ouvre le même éditeur que le ＋.','Vérifier la visibilité, écrire et ajouter éventuellement quatre médias au maximum, puis Publier.','Quitter un contenu commencé propose de conserver le brouillon par compte.'],
 ['mon-profil','6. Retrouver son activité','Toucher sa photo ou son identité dans le menu pour ouvrir son profil.','Publications d’abord ; vos XP totaux restent personnels. Retour retrouve l’écran précédent.','L’historique privé et les enregistrés restent dans le menu gauche.'],
 ['partage','7. Partager une fiche','Rangée du haut : publier dans mon fil ou choisir un ami réciproque.','Ajouter un message facultatif puis confirmer l’envoi. La rangée du bas propose copier, applications compatibles et Plus.','Partager ne crée ni présence ni XP. Le destinataire doit accéder au même serveur privé.'],
 ['messagerie','8. Retrouver la carte dans Messages','Ouvrir la conversation et toucher la carte de fiche.','La fiche s’ouvre dans sa page ; Retour conserve la conversation et sa position. Les messages non lus ont leur compteur distinct.','Messages entre profils majeurs publics seulement dans ce prototype ; pas de chiffrement de bout en bout.'],
 ['notifications','9. Consulter les notifications','Ouvrir le menu portant une puce puis Notifications.','Toucher une activité ouvre son contenu et la marque lue. Ouvrir seulement le menu ne marque rien.','Les exemples de présentation sont identifiés comme fictifs ; les préférences restent locales.'],
 ['sortir','10. Préparer la prochaine sortie','Sortir propose une mise en avant, des guides et des événements fictifs.','Lire un article, ouvrir un lieu cité, enregistrer un événement ou choisir J’y serai.','Répéter sur les appareils d’Ingrid ; garder ce PDF et le support HTML sans connexion.'],
];
let body='';
for(let i=0;i<steps.length;i++){
 const [image,title,action,explanation,note]=steps[i];
 const png=(await readFile(new URL(`captures/guide-utilisation/${image}.png`,docs))).toString('base64');
 body+=`<section><header><b>CHKPT</b><span>Démonstration expliquée · données fictives</span></header><main><div><p class="eyebrow">VOTRE VISITE GUIDÉE</p><h1>${title}</h1><p class="action">${action}</p><p>${explanation}</p><aside>${note}</aside></div><figure><img src="data:image/png;base64,${png}" alt="Capture réelle : ${image}"/><figcaption>Écran du prototype · capture de recette</figcaption></figure></main><footer>À lire sans logiciel de programmation · prototype privé<span>${i+1} / ${steps.length}</span></footer></section>`;
}
const html=`<!doctype html><html lang="fr"><meta charset="utf-8"><title>CHKPT — démonstration pas à pas</title><style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#fff;color:#111d33}section{width:297mm;height:210mm;padding:12mm 16mm;break-after:page;position:relative}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #dfe5ee;padding-bottom:6mm}header b{font-size:19px}small{font-size:11px;color:#1763c6;margin-left:8px}header span{font-size:11px;color:#596880}main{height:162mm;display:grid;grid-template-columns:1fr 69mm;gap:15mm;align-items:center}h1{font-size:36px;line-height:1.14;letter-spacing:-1px;margin:15px 0 25px}.eyebrow{font-size:11px;letter-spacing:3px;color:#1763c6;font-weight:bold}.action{font-size:23px;color:#111d33;font-weight:bold}p{font-size:17px;line-height:1.65;color:#34435a}aside{border-left:3px solid #1763c6;padding:12px 16px;background:#edf4fd;font-size:14px;line-height:1.6;color:#34435a;margin-top:24px}figure{margin:0}img{width:100%;max-height:153mm;object-fit:contain;border-radius:16px}figcaption{font-size:8px;color:#596880;text-align:center;margin-top:5px}footer{position:absolute;bottom:8mm;left:16mm;right:16mm;color:#596880;font-size:10px;display:flex;justify-content:space-between}</style><body>${body}</body></html>`;
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined});
try{
 const context=await browser.newContext({offline:true});
 const page=await context.newPage();
 await page.setContent(html);
 await page.waitForFunction(()=>[...document.images].every(image=>image.complete && image.naturalWidth>0));
 await page.emulateMedia({media:'print'});
 const overflow=await page.locator('section').evaluateAll(sections=>sections.map((section,index)=>({step:index+1,overflow:section.scrollHeight>section.clientHeight+1})).filter(item=>item.overflow));
 if(overflow.length)throw new Error('Contenu débordant dans le guide : '+overflow.map(item=>item.step).join(', '));
 await page.pdf({path:fileURLToPath(new URL('DEMONSTRATION_PAS_A_PAS.pdf',docs)),printBackground:true,preferCSSPageSize:true});
 console.log(`Guide visuel créé : ${steps.length} étapes, captures réelles, aucune dépendance réseau.`);
}finally{await browser.close()}
