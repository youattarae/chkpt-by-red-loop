import { readFile, writeFile } from 'node:fs/promises';

const docs = new URL('../docs/', import.meta.url);
const steps = [
  ['accueil', 'DÉCOUVRIR', 'Une ville. Mille découvertes.', 'CHKPT relie les envies de sortie aux expériences partagées. Le pilote présenté se concentre sur Cocody.', 'Sors. Check. Partage.'],
  ['checkin', 'SORTIR', 'Une visite, un petit pas de plus.', 'Le check-in de présentation est explicitement simulé. Ici, 75 XP et le badge Initié du Braisé illustrent la progression Maquis Master.', 'La publication reste facultative.'],
  ['profil', 'PARTAGER', 'Les bons moments restent.', 'Une publication créée volontairement apparaît dans le fil et sur le profil. Le scénario testé conserve les contenus après navigation et rechargement.', 'Publications locales au navigateur.'],
  ['sortir', 'SE RETROUVER', 'Et la prochaine sortie ?', 'L’intention « J’y serai » permet de préparer une prochaine sortie. Événements et participations restent des données fictives de démonstration.', 'Objectif : tester le parcours, puis valider un pilote.'],
];
let body = '';
for (const [i, [capture, label, title, copy, note]] of steps.entries()) {
  const image = (await readFile(new URL(`captures/${capture}-390.png`, docs))).toString('base64');
  body += `<section id="etape-${i + 1}" tabindex="-1"><div class="copy"><p class="eyebrow">0${i + 1} / ${label}</p><h1>${title}</h1><p>${copy}</p><p class="note">${note}</p><a href="#etape-${i < 3 ? i + 2 : 1}">${i < 3 ? 'Étape suivante →' : 'Revenir au début ↺'}</a></div><figure><img src="data:image/png;base64,${image}" alt="Capture réelle du prototype CHKPT : ${capture}"/><figcaption>Capture du parcours testé · données fictives</figcaption></figure></section>`;
}
const html = `<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHKPT — support de secours</title><style>
*{box-sizing:border-box}body{margin:0;background:#fff;color:#111d33;font-family:system-ui,sans-serif}header{position:fixed;top:0;left:0;right:0;padding:18px 6vw;background:#fffffff5;border-bottom:1px solid #dfe5ee;display:flex;justify-content:space-between;align-items:center;z-index:2}header strong{letter-spacing:.12em}header span{font-size:12px;color:#1759b5;max-width:60%;text-align:right}section{min-height:100vh;padding:100px 9vw 50px;display:grid;grid-template-columns:1fr 320px;gap:7vw;align-items:center}.copy{max-width:650px}.eyebrow{color:#1759b5;letter-spacing:.2em;font-size:12px;font-weight:700}h1{font-size:clamp(32px,5vw,66px);line-height:1.05;letter-spacing:-.05em;margin:25px 0}p{font-size:18px;line-height:1.7;color:#34435a}.note{color:#892c4d;font-size:14px}a{display:inline-block;background:#1759b5;color:#fff;padding:14px 20px;border-radius:12px;text-decoration:none;font-weight:700;margin-top:20px}a:focus-visible{outline:3px solid #892c4d;outline-offset:4px}figure{margin:0}figure img{width:100%;max-height:72vh;object-fit:contain;border-radius:22px;box-shadow:0 10px 40px #14274418}figcaption{font-size:10px;text-align:center;color:#596880;margin-top:10px}@media(max-width:750px){section{grid-template-columns:1fr;padding:100px 7vw 40px;gap:30px}figure{max-width:300px;margin:auto}figure img{max-height:none}header span{font-size:10px}p{font-size:16px}}@media print{header{position:static}section{break-after:page;min-height:0}}
</style><body><header><strong>CHKPT</strong><span>Support préenregistré · données fictives<br>Captures du prototype, pas une session en direct</span></header>${body}</body></html>`;
await writeFile(new URL('DEMO_SECOURS.html', docs), html);
console.log('Support autonome actualisé : quatre captures réelles intégrées.');
