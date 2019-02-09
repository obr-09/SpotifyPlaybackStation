const express = require('express');
const bodyParser = require('body-parser');
const storage = require('node-persist');
const path = require ('path');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.text({ type: 'text/plain' }));
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

async function loadStorage() {
    await storage.init({
        dir: 'tokens',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        ttl: false,
        forgiveParseErrors: false
    });
}

app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/player', async (req, res) => {
    res.render('pages/player', {
        tokens: await getTokens(),
        token: await getToken()
    })
});

app.get('/token', async (req, res) => {
    let token = await getToken();
    res.send(token);
});

async function getToken() {
    await loadStorage();
    return await storage.getItem('token');
}

app.post('/token', async (req, res) => {
    await loadStorage();
    await storage.setItem('token', req.body);
    res.send(req.body);
});

app.get('/tokens', async (req, res) => {
    let tokens = await getTokens();
    res.send(tokens);
});

async function getTokens() {
    await loadStorage();
    let tokens = {};
    await storage.forEach(async function(data) {
        if (data.key !== 'token') {
            tokens[data.key] = data.value;
        }
    });
    return tokens;
}

app.post('/tokens/:tokenKey', async (req, res) => {
    await loadStorage();
    await storage.setItem(req.params['tokenKey'], req.body);
    res.send(req.params['tokenKey']);
});

app.delete('/tokens/:tokenKey', async (req, res) => {
    await loadStorage();
    let removed = false;
    await storage.forEach(async function(data) {
        if (data.key === req.params['tokenKey']) {
           await storage.removeItem(data.key);
           removed = true;
        }
    });
    res.send(removed ? req.params['tokenKey'] : 'null');
});

app.listen(8000, () => {
    console.log('SpotifyPlaybackStation listening on port 8000!');
});