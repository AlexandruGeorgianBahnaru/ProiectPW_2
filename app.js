

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


const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const app = express();
const port = 6789;
const path = require('path');
const fs = require('fs/promises');
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în
app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello

// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', function(req, res) {
    autentificat = false;
    res.render('index', {autentificat});
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
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

app.get('/autentificare', function(req, res) {
    res.render('autentificare');
  });

app.post('/verificare-autentificare', (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    // Find user by username
    console.log(users);
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).send('User not found.');
    }

    // Check if password matches
    if (user.password !== password) {
        return res.status(401).send('Incorrect password.');
    }

    // Authentication successful
    const autentificat = true; // Replace with actual authentication logic

    if (autentificat) {
        res.redirect('/?message=Autentificare reușită');
    } else {
        res.redirect('/?message=Nu sunteti autentificat');
    }
    
});

app.post('/rezultat-chestionar', (req, res) => {
 console.log(req.body);
 res.send("formular: " + JSON.stringify(req.body));
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));


