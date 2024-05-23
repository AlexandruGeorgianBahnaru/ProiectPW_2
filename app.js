
function verificareUser()
{
    const user = document.getElementById('User');
    const password = document.getElementById('Password');
    const userVal = user.value;
    const passwordVal = password.value;
    if(userVal === "USER")
        console.log("ADEV");
}

var autentificat = false;
var userAutentificat;
var nrIncercari = 0;
var messIncercari = null;
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 6789;
const path = require('path');
const fs = require('fs/promises');
const { TIMEOUT } = require('dns');
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(cookieParser());

app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello

app.use(session({
    secret: 'secret', // Schimbați cu o cheie secretă reală
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', function(req, res) {
    const userSession = req.session.user;
  res.render('index', { user: userSession });
  });


// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția
app.get('/chestionar', async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'intrebari.json');
        const data = await fs.readFile(filePath, 'utf8');
        const listaIntrebari = JSON.parse(data);
        res.render('chestionar', { intrebari: listaIntrebari });
    } catch (err) {
        console.error('Error reading questions file:', err);
        res.status(500).send('Server Error');
    }
});
//verificare user manual

app.get('/autentificare', function(req, res) {
    res.render('autentificare');
  });

app.post('/verificare-autentificare', async (req, res) => {
    const { username, password } = req.body;
    try{
        const filePath = path.join(__dirname, 'utilizatori.json');
        const data = await fs.readFile(filePath, 'utf8');
        const users = JSON.parse(data);
    if (!username || !password) {
        res.cookie('errorMessage', 'Username and password are required.', { maxAge: 3000 });
        return res.redirect('/autentificare');
    }

    const user = users.find(user => user.username === username);

    if (!user || user.password !== password) {
        res.cookie('errorMessage', 'Incorrect username or password.', { maxAge: 3000 });
        return res.redirect('/autentificare');
    }

    autentificat = true;
    userAutentificat = username;
    res.cookie('username', username);
    res.redirect(`/?message=${username}`);
    }
    catch(err){
        console.error('Error reading questions file:', err);
        res.status(500).send('Server Error');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });

app.post('/rezultat-chestionar', async (req, res) => {
    res.redirect(`/rezultat-chestionar?message=${userAutentificat}`);
});

app.get('/rezultat-chestionar', function(req, res) {
    res.render('rezultat-chestionar');
  });

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));


