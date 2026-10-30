import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
export async function checkRadarMap(url:string){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined});
  try{
    const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});
    // Deterministic blank raster tile: tests geometry and interaction, not OSM availability.
    await context.route('https://tile.openstreetmap.org/**',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256"><rect width="256" height="256" fill="#e9eef3"/><path d="M0 128H256M128 0V256" stroke="#d5dde7" stroke-width="2"/></svg>'}));
    const page=await context.newPage();await page.goto(url);await page.getByRole('button',{name:'Carte',exact:true}).click();
    const map=page.getByRole('region',{name:'Carte interactive d’Abidjan',exact:true});
    await map.getByRole('button',{name:'Mon radar · 250 m',exact:true}).click();
    await page.waitForFunction(()=>!!document.querySelector('.leaflet-overlay-pane path')&&document.querySelector('.leaflet-overlay-pane path')!.getBoundingClientRect().width>150);
    assert.equal(await page.locator('.leaflet-overlay-pane path').count(),2);
    await map.getByRole('button',{name:'Centrer Yopougon',exact:true}).click();
    await map.getByRole('button',{name:'Centrer Riviera',exact:true}).click();
    await map.getByRole('button',{name:'Mon radar · 250 m',exact:true}).click();
    // Text search opens a dedicated page; map geometry stays controlled by chips and filters.
    await map.getByRole('button',{name:"Choisir Maquis L'Étoile d'Abidjan",exact:true}).waitFor();
    await page.waitForFunction(()=>{const circle=document.querySelector('.leaflet-overlay-pane path')?.getBoundingClientRect();const map=document.querySelector('.leaflet-container')?.getBoundingClientRect();return !!circle&&!!map&&circle.width>150&&Math.abs(circle.x+circle.width/2-(map.x+map.width/2))<5;});
    // Successful tiles must expose the same no-results state as the illustrated fallback.
    const search=page.getByRole('combobox',{name:'Rechercher un établissement',exact:true});
    for(const mode of ['Carte interactive','Carte illustrée']){
      await page.getByRole('button',{name:mode,exact:true}).click();
      await page.getByRole('button',{name:'Filtres',exact:true}).click();const filters=page.getByRole('region',{name:'Filtres de la carte'});await filters.getByRole('combobox',{name:'Catégorie de lieu'}).selectOption('clubs');await filters.getByRole('button',{name:'Appliquer les filtres'}).click();
      await page.getByRole('heading',{name:'Aucun lieu ne correspond à votre recherche',exact:true}).waitFor();
      assert.equal(await page.getByRole('button',{name:/^Choisir /}).count(),0);
      assert.equal(await page.getByRole('button',{name:'Détails',exact:true}).count(),0);
      await page.getByRole('button',{name:'Afficher tous les lieux',exact:true}).click();
      assert.equal(await search.inputValue(),'');
      await page.getByRole('button',{name:'Détails',exact:true}).waitFor();
    }
    await page.getByRole('button',{name:'Carte interactive',exact:true}).click();

    if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'radar-test-390.png')});}
    await page.getByRole('button',{name:'Carte illustrée',exact:true}).click();assert.equal(await map.count(),0);
    await context.close();
    const offline=await browser.newContext({viewport:{width:320,height:700}});await offline.route('https://**/*',route=>route.abort());
    const fallback=await offline.newPage();await fallback.goto(url);await fallback.getByRole('button',{name:'Carte',exact:true}).click();
    await fallback.getByText('Fond de carte indisponible : carte illustrée de secours active.',{exact:true}).waitFor();
    await fallback.getByRole('button',{name:"Choisir Maquis L'Étoile d'Abidjan",exact:true}).click();
    assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await offline.close();
  }finally{await browser.close();}
}
