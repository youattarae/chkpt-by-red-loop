import {testStyle} from './map_fixture';
import {openGps} from './browser_ui';
import {openFilters} from './browser_ui';
import {searchField} from './browser_ui';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';
export async function checkRadarMap(url:string){
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||undefined,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
  try{
    const context=await browser.newContext({viewport:{width:390,height:950},reducedMotion:'reduce'});
    // Synthetic style: validates WebGL and canonical markers, not the live provider.
    await context.route('https://tiles.openfreemap.org/styles/**',r=>r.fulfill({json:testStyle}));
    const page=await context.newPage();await page.goto(url);await page.getByRole('button',{name:'Carte',exact:true}).click();
    const map=page.getByRole('region',{name:'Carte interactive d’Abidjan',exact:true});
    await map.locator('.maplibregl-canvas').waitFor();
    await map.getByRole('button',{name:"Choisir Maquis L'Étoile d'Abidjan",exact:true}).waitFor();
    assert.equal(await map.getByRole('button',{name:/^Centrer /}).count(),0);
    await page.getByText('Outils carte',{exact:true}).click();
    await page.getByRole('button',{name:'Voir les lieux affichés',exact:true}).click();
    await page.getByText('Outils carte',{exact:true}).click();
    await page.getByRole('button',{name:'Mon radar · 250 m',exact:true}).click();
    await page.waitForFunction(()=>{const dot=document.querySelector('[aria-label="Position du radar"]')?.getBoundingClientRect();const canvas=document.querySelector('.maplibregl-canvas')?.getBoundingClientRect();return !!dot&&!!canvas&&Math.abs(dot.x+dot.width/2-(canvas.x+canvas.width/2))<5;});
    // Successful tiles must expose the same no-results state as the illustrated fallback.
    const search=(await searchField(page,'Rechercher un établissement'));
    for(const mode of ['Carte interactive','Carte illustrée']){
      await openGps(page);await page.getByRole('button',{name:mode,exact:true}).click();
      await openFilters(page);const filters=page.getByRole('region',{name:'Filtres de la carte'});await filters.getByRole('combobox',{name:'Catégorie de lieu'}).selectOption('clubs');await filters.getByRole('button',{name:'Appliquer les filtres'}).click();
      await page.getByRole('heading',{name:'Aucun lieu ne correspond à votre recherche',exact:true}).waitFor();
      assert.equal(await page.getByRole('button',{name:/^Choisir /}).count(),0);
      assert.equal(await page.getByRole('button',{name:'Voir le lieu',exact:true}).count(),0);
      await page.getByRole('button',{name:'Afficher tous les lieux',exact:true}).click();
      assert.equal(await search.inputValue(),'');
      await page.getByText('Outils carte',{exact:true}).click();const list=page.locator('details[data-map-tools] details');if(!await list.evaluate((e:HTMLDetailsElement)=>e.open))await list.locator('summary').click();await page.locator('details[data-map-tools]').getByRole('button',{name:"Maquis L'Étoile d'Abidjan",exact:true}).click();await page.getByRole('button',{name:'Voir le lieu',exact:true}).waitFor();
    }
    await openGps(page);await page.getByRole('button',{name:'Carte interactive',exact:true}).click();

    if(process.env.CHKPT_CAPTURE_DIR){await mkdir(process.env.CHKPT_CAPTURE_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.CHKPT_CAPTURE_DIR,'radar-test-390.png')});}
    await openGps(page);await page.getByRole('button',{name:'Carte illustrée',exact:true}).click();assert.equal(await map.count(),0);
    await context.close();
    const offline=await browser.newContext({viewport:{width:320,height:700}});await offline.route('https://**/*',route=>route.abort());
    const fallback=await offline.newPage();await fallback.goto(url);await fallback.getByRole('button',{name:'Carte',exact:true}).click();
    await fallback.getByText('Fond de carte indisponible : carte illustrée de secours active.',{exact:true}).waitFor();
    await fallback.getByRole('button',{name:"Choisir Maquis L'Étoile d'Abidjan",exact:true}).click();
    assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await offline.close();
  }finally{await browser.close();}
}
