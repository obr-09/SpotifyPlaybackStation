const express = require('express');
const app = express();
const storage = require('node-persist');

var path = require ('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/player', async (req, res) => {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
    let currentToken = await storage.getItem('token');
    res.render('pages/player', {
        token: currentToken
    })
});

app.get('/tokens', async (req, res) => {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
    let tokens = [];
    await storage.forEach(async function(data) {
        if (data.key !== 'token') {
            tokens.append(data.value);
        }
    });
    res.send(tokens);
});

app.post('/tokens/:token', async (req, res) => {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
    let length = await storage.length();
    await storage.setItem(req.params['token'], req.params['token']);
    res.send(req.params['token']);
});

app.delete('/tokens/:token', async (req, res) => {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
    let removed = false;
    await storage.forEach(async function(data) {
        if (data.value === req.params['token']) {
           await storage.removeItem(data.key);
           removed = true;
        }
    });
    res.send(removed ? req.params['token'] : 'null');
});

app.post('/token/:token', async (req, res) => {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
    await storage.setItem('token', req.params['token']);
    res.send(req.params['token']);
});

app.listen(8000, () => {
    console.log('SpotifyPlaybackStation listening on port 8000!');
});