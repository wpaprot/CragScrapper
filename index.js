const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.
const playwright = require('playwright');


const config = {
    url: 'http://topo.portalgorski.pl/Jaskinia-Mamutowa,Dolina-Kluczwody,Jura-Krakowsko-Cz%C4%99stochowska,skala,',
    startIndex: 1,
    endIndex: 1024,
    gotoOptions: { timeout: 60 * 1000, waitUntil: 'domcontentloaded' }
};


async function getCrag(page, id) {
    if (Number.isNaN(id)) {
        console.log('[GetCrag] Input parameter is NaN');
        return;
    }
    if (page == undefined) {
        console.log('[GetCrag] Page is null');
        return;
    }

    await page.goto(`${config.url}${id}`, config.gotoOptions);
    if ((await page.title()).includes('Błąd')) {
        return {
            isSuccess: 'false',
            object: { id: id }
        }
    }
    
    console.log(await page.textContent('h1'));
    console.log(await page.textContent('.dataSm'));
    console.log(await page.textContent('span:above(.dataSm)'));

}

async function Run() {
    
    for (const browserType of ['chromium']) {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        await getCrag(page, 783);


        // await page.goto('http://topo.portalgorski.pl/Jaskinia-Mamutowa,Dolina-Kluczwody,Jura-Krakowsko-Cz%C4%99stochowska,skala,783', { timeout: 60 * 1000, waitUntil: 'domcontentloaded' });
        // console.log(await page.title());
        // await page.screenshot({ path: `example-${browserType}.png` });
        await browser.close();
    }
};

Run();