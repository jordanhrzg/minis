const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

function parseName(url){
    let result = {};
    let name = url.split('COY_')[1].split('.')[0];
    name = name.split('_');
    result.bpm = name.filter(n => n.endsWith('bpm'))[0];
    result.key = name.filter(n => n.length <= 2 || n.endsWith('7'))[0];
    result.name = name.filter(n => !n.endsWith('bpm') && n.length > 2 && !n.endsWith('7')).join(' ');

    return result;
}


app.get('/', cors({'Access-Control-Allow-Origin': 'http://localhost:3000'}), (req, res) => {
    //read local file names & serve in json format {name: {name, bpm, key}, location}
    let sounds = fs.readdirSync('./assets/sounds/');
    sounds = sounds.map(s => {
        return{
            name: parseName(s),
            location: s
        }
    });

    res.send(sounds);
    console.log(`Sending ${sounds.length} track listings to ${req.headers.origin}`);
});

app.get('/track', cors({'Access-Control-Allow-Origin': 'http://localhost:3000'}), (req, res) => {
    let requestedResource = req.query.location;
    let file = fs.readFileSync(`./assets/sounds/${requestedResource}`);
    res.set({'content-type': 'wav'});
    res.send(file);
    console.log(`Sending ${requestedResource} to ${req.headers.origin} ...`);
});

app.listen(3001);
