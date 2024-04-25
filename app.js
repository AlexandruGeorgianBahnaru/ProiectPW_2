const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')
const app = express();
const port = 6789;
// directorul 'views' va conține fișierele .ejs (html + js executat la server)
app.set('view engine', 'ejs');
// suport pentru layout-uri - implicit fișierul care reprezintă template-ul site-ului

app.use(expressLayouts);
// directorul 'public' va conține toate resursele accesibile direct de către client

app.use(express.static('public'))
// corpul mesajului poate fi interpretat ca json; datele de la formular se găsesc în

app.use(bodyParser.json());
// utilizarea unui algoritm de deep parsing care suportă obiecte în obiecte
app.use(bodyParser.urlencoded({ extended: true }));
// la accesarea din browser adresei http://localhost:6789/ se va returna textul 'Hello

// proprietățile obiectului Request - req - https://expressjs.com/en/api.html#req
// proprietățile obiectului Response - res - https://expressjs.com/en/api.html#res
app.get('/', (req, res) => res.send('Hello George'));
// la accesarea din browser adresei http://localhost:6789/chestionar se va apela funcția

app.get('/chestionar', (req, res) => {
 const listaIntrebari = [
 {
 intrebare: 'Întrebarea 1',
 variante: ['varianta 1', 'varianta 2', 'varianta 3', 'varianta 4'],
 corect: 0
 },
 //...
 ];
 // în fișierul views/chestionar.ejs este accesibilă variabila 'intrebari' care
 res.render('chestionar', {intrebari: listaIntrebari});
});
app.post('/rezultat-chestionar', (req, res) => {
 console.log(req.body);
 res.send("formular: " + JSON.stringify(req.body));
});
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:`));