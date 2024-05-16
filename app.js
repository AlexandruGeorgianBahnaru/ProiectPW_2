function verificareUser()
{
    const user = document.getElementById('User');
    const password = document.getElementById('Password');
    const userVal = user.value;
    const passwordVal = password.value;
    if(userVal === "USER")
        console.log("ADEV");
}



const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const app = express();
const port = 6789;
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului

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
    res.render('index');
  });


// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția
app.get('/chestionar', (req, res) => {
 const listaIntrebari = [
    {
        intrebare: 'Cat de des faceti cumparaturi din industria frumusetii si ingrijirii?',
        variante: ['O data pe saptamana', 'O data pe luna', 'Deloc', 'Cand am nevoie'],
        corect: 0
    },
    {
        intrebare: 'Ati auzit despre produsele cosmetice coreene?',
        variante: ['Da', 'Nu sunt sigur', 'Nu', 'Nu ma intereseaza'],
        corect: 0
    },
    {
        intrebare: 'Ati procurat cel putin o data produse cosmetice coreene?',
        variante: ['Da', 'Nu sunt sigur', 'Nu', 'Nu ma intereseaza'],
        corect: 0
    },
    {
        intrebare: 'Ce produse cosmetice de ingrijire ati folosit?',
        variante: ['Gel de dus', 'Sampon antimatreata', 'Crema antirid', 'Crema de maini'],
        corect: 0
    },
    {
        intrebare: 'Ce marca de crema antirid ati folosit?',
        variante: ['Farmec', 'Avon', 'Nivea', 'Nu am folosit'],
        corect: 0
    },
    {
        intrebare: 'Din ce surse ati auzit de Farmec?',
        variante: ['Internet', 'Prieteni', 'Televizor', 'Nu am auzit'],
        corect: 0
    },
    {
        intrebare: 'Care este opinia dvs despre Farmec?',
        variante: ['Nesatisfacatoare', 'Buna', 'Satisfacatoare', 'Nu am o opinie'],
        corect: 0
    },
    {
        intrebare: 'Ce moment al zilei vi sa pare mai potrivi pentru aplicarea cremei UV?',
        variante: ['Dimineata', 'Seara', 'La pranz', 'Inainte de a iesi din casa'],
        corect: 0
    },
    
    {
        intrebare: 'Cat de des folositi crema de maini?',
        variante: ['In fiecare zi', 'Nu folosesc', 'O data pe saptamana', 'O data pe luna'],
        corect: 0
    },
 //...
 ];
 // în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care

 res.render('chestionar', {intrebari: listaIntrebari});
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
    res.send('Authentication successful!');// You can redirect or send a token here for further authentication
});

app.post('/rezultat-chestionar', (req, res) => {
 console.log(req.body);
 res.send("formular: " + JSON.stringify(req.body));
});

app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));


