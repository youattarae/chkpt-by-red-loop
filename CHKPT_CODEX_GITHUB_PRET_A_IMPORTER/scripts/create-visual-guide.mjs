import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
const docs=new URL('../docs/',import.meta.url);
const steps=[
 ['accueil','1. Voici l’accueil','Vous voyez le point de départ de CHKPT.','Le bandeau indique toujours « données fictives ». En bas : Accueil, Carte, Check-in, Sortir et Profil.','Pour la répétition, l’opérateur a déjà préparé la démo. Vous n’avez aucun code à lire.'],
 ['carte','2. Nous cherchons un maquis','On appuie sur « Carte », puis sur le repère du Maquis L’Étoile.','La carte est illustrée. La fiche résumée montre le nom et le quartier Saint-Jean, à Cocody.','Le geste suivant : appuyer sur « Détails ».'],
 ['fiche','3. Voici le lieu choisi','On consulte sa fiche, puis on appuie sur « Faire un check-in ici ».','Le même lieu doit être repris à l’étape suivante. Les prix, informations et illustrations appartiennent au jeu fictif.','On ne prétend pas certifier un établissement réel pendant cette démonstration.'],
 ['checkin','4. Nous simulons la visite','Le bouton « Simuler ma visite » confirme une visite fictive.','Le résultat annonce +75 XP et le badge Initié du Braisé, de la famille Maquis Master. Les quatre premières visites du badge sont préchargées pour la démo.','Rien n’est publié automatiquement. On peut s’arrêter avec « Plus tard ».'],
 ['publication','5. Nous choisissons de partager','On appuie sur « Créer une publication », puis on écrit son message.','Une illustration du lieu est proposée. On peut garder cette image de présentation et appuyer sur « Publier le checkpoint ».','Publier reste facultatif et ne crée pas de points de visite supplémentaires.'],
 ['profil','6. Le souvenir est bien conservé','On ouvre « Profil » : voici la publication et les points.','Le scénario passe de 1240 à 1315 XP. La publication, le badge et les préférences survivent au rechargement dans ce même navigateur.','Ce prototype ne synchronise pas ces publications entre plusieurs personnes ou appareils.'],
 ['sortir','7. Nous préparons la prochaine sortie','On ouvre « Sortir » et on appuie sur « J’y serai ».','Le bouton sélectionné confirme l’intention. L’événement et les participants sont fictifs ; il n’y a ni achat ni billetterie.','Après cela, on peut revenir à l’accueil ou au profil.'],
 ['accueil','8. Nous sommes prêts à répéter','Sors. Check. Partage.','Pour recommencer, l’opérateur se reconnecte et choisit « Démarrer la démo ». Le parcours revient à son état de départ.','Ce document montre des captures réelles du prototype testé. C’est une démonstration illustrée, pas une application interactive ni une preuve de traction réelle.']
];
let body='';
for(let i=0;i<steps.length;i++){
 const [image,title,action,explanation,note]=steps[i];
 const png=(await readFile(new URL(`captures/${image}-390.png`,docs))).toString('base64');
 body+=`<section><header><b>CHKPT <small>by RED LOOP</small></b><span>Démonstration expliquée · données fictives</span></header><main><div><p class="eyebrow">VOTRE VISITE GUIDÉE</p><h1>${title}</h1><p class="action">${action}</p><p>${explanation}</p><aside>${note}</aside></div><figure><img src="data:image/png;base64,${png}" alt="Capture réelle : ${image}"/><figcaption>Écran du prototype · capture de recette</figcaption></figure></main><footer>À lire sans logiciel de programmation · prototype privé<span>${i+1} / ${steps.length}</span></footer></section>`;
}
const html=`<!doctype html><html lang="fr"><meta charset="utf-8"><title>CHKPT — démonstration pas à pas</title><style>@page{size:A4 landscape;margin:0}*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#080f20;color:#edf5ff}section{width:297mm;height:210mm;padding:12mm 16mm;break-after:page;position:relative}header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #34435a;padding-bottom:6mm}header b{font-size:19px}small{font-size:11px;color:#a1dcff;margin-left:8px}header span{font-size:11px;color:#c4d2e4}main{height:162mm;display:grid;grid-template-columns:1fr 69mm;gap:15mm;align-items:center}h1{font-size:36px;line-height:1.14;letter-spacing:-1px;margin:15px 0 25px}.eyebrow{font-size:11px;letter-spacing:3px;color:#a1dcff;font-weight:bold}.action{font-size:23px;color:#fff;font-weight:bold}p{font-size:17px;line-height:1.65;color:#c1d0e3}aside{border-left:3px solid #a1dcff;padding:12px 16px;background:#15243b;font-size:14px;line-height:1.6;color:#d1deec;margin-top:24px}figure{margin:0}img{width:100%;max-height:153mm;object-fit:contain;border-radius:16px}figcaption{font-size:8px;color:#a0aec5;text-align:center;margin-top:5px}footer{position:absolute;bottom:8mm;left:16mm;right:16mm;color:#9eb2cc;font-size:10px;display:flex;justify-content:space-between}</style><body>${body}</body></html>`;
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined});
try{
 const context=await browser.newContext({offline:true});
 const page=await context.newPage();
 await page.setContent(html);
 await page.waitForFunction(()=>[...document.images].every(image=>image.complete && image.naturalWidth>0));
 await page.pdf({path:fileURLToPath(new URL('DEMONSTRATION_PAS_A_PAS.pdf',docs)),printBackground:true,preferCSSPageSize:true});
 console.log('Guide visuel créé : 8 étapes, captures réelles, aucune dépendance réseau.');
}finally{await browser.close()}
