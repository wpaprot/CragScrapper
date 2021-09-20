const { chromium } = require('playwright');  // Or 'firefox' or 'webkit'.
const playwright = require('playwright');
const fs = require('fs');


const config = {
    url: 'http://topo.portalgorski.pl/Jaskinia-Mamutowa,Dolina-Kluczwody,Jura-Krakowsko-Cz%C4%99stochowska,skala,',
    startIndex: 1,
    endIndex: 1024,
    gotoOptions: { timeout: 70 * 1000, waitUntil: 'domcontentloaded' }
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
        return null
        // {
        //     isSuccess: 'false',
        //     object: { id: id }
        // }
    }

    let data = {
        name: (await page.textContent('h1')).replace(/^\s+|\s+$/g, ''),
        gpsNumeric: (await page.textContent('.dataSm')).replace(/\s/g, ''),
        gps: (await page.textContent('span:above(.dataSm)')).replace(/\s/g, '')
    };

    let result = {
        name: data.name,
        location: {
            type: "Point",
            coordinates: [parseFloat(data.gpsNumeric.split(',')[0]), parseFloat(data.gpsNumeric.split(',')[1])]
        },
        gps: (await page.textContent('span:above(.dataSm)')).replace(/\s/g, '')
    }

    console.log((await page.textContent('h1')).replace(/^\s+|\s+$/g, ''));
    console.log((await page.textContent('.dataSm')).replace(/\s/g, ''));
    console.log((await page.textContent('span:above(.dataSm)')).replace(/\s/g, ''));

    console.log(result);
    return result;
}

async function Run() {

    for (const browserType of ['chromium']) {
        const browser = await playwright[browserType].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        const crags = [];
        for (let i = 1; i < 1024; i++) {
            console.log(`[Start] Feching site id ${i}`);
            try {
                let crag = await getCrag(page, i);
                if (crag) crags.push(crag)
            }
            catch (err) {
                console.log(`[Error] Feching site id ${i} ${err}`);
            }
        }

        let data = JSON.stringify(crags);
        fs.writeFileSync('./res/crags.json', data);

        // await page.goto('http://topo.portalgorski.pl/Jaskinia-Mamutowa,Dolina-Kluczwody,Jura-Krakowsko-Cz%C4%99stochowska,skala,783', { timeout: 60 * 1000, waitUntil: 'domcontentloaded' });
        // console.log(await page.title());
        // await page.screenshot({ path: `example-${browserType}.png` });
        await browser.close();
    }
};

Run();