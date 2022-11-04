const { writeFileSync } = require('fs');
const { join } = require('path');
const axios = require('axios');
const blend = require('@mapbox/blend');
const argv = require('minimist')(process.argv.slice(2));
const {
    greeting = 'Hello', who = 'You',
    width = 400, height = 500, color = 'Pink', size = 100,
} = argv;
const url1 = `https://cataas.com/cat/says/${greeting}?width=${width}&height=${height}&color=${color}&s='${size}`;
const url2 = `https://cataas.com/cat/says/${who}?width=${width}&height=${height}&color=${color}&s=${size}`;

(async () => {
    try {
        const firstRes = await axios.get(url1, { responseType: 'arraybuffer' });
        const secondRes = await axios.get(url2, { responseType: 'arraybuffer' });
        blend([
            { buffer: Buffer.from(firstRes.data,'binary'), x: 0, y: 0 },
            { buffer: Buffer.from(secondRes.data,'binary'), x: width, y: 0 }
        ],
            { width: width * 2, height: height, format: 'jpeg', },
            (err, data) => {
                const fileOut = join(process.cwd(), `/cat-card.jpg`);
                writeFileSync(fileOut, data, 'binary');
                console.log("The file was saved!");
            });
    } catch (error) {
        console.log(error);
    }
})();