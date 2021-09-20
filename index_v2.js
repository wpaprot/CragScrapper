const axios = require('axios');

const url = 'http://topo.portalgorski.pl/topo/json/get/id'

const regions = [
    {
        name: 'Jura',
        id: 34
    }
    // {
    //     name: 'Sokoliki',
    //     id: 34
    // }
]

const types = {
    AREA: 'area',
    REGION: 'region',
    SECTOR: 'sector',
    ROCK: 'rock'
}

nameFromUrl = (url) => url.split(',')[0].replace('/', '').replace('-', ' ');

async function run() {
    for (const region of regions) {
        axios.get(`${url}/${region.id}`)
            .then(response => {
                region.location = {
                    type: "Point",
                    coordinates: [parseFloat(response.data.objectData.lat), parseFloat(response.data.objectData.lng)]
                }
                let area = {
                    location: {
                        type: "Point",
                        coordinates: [parseFloat(response.data.objectData.lat), parseFloat(response.data.objectData.lng)]
                    },
                    id: region.id,
                    name: nameFromUrl(response.data.results[0].url), 
                    type: types.AREA
                }
                console.log(area);
                return;
                for (const obj of response.data.results.filter(i => i.url && i.url.toString().includes('region'))) {
                    let id = obj.url.split(',')[3];
                    console.log(`ID: ${id}`)
                    axios.get(`${url}/${id}`)
                        .then(response => { console.log(response.data) });
                    break;
                }

                // console.log(response.data.results.filter(i => i.url && i.url.toString().includes('region')));
            })
            .catch(error => {
                console.log(error);
            });
    }
}

run();