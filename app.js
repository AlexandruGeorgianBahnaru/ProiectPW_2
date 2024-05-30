const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs/promises');

const app = express();
const port = 6789;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



function requireAdmin(req, res, next) {
  if (req.session.role !== 'admin') {
      return res.status(403).send('Access denied');
  }
  next();
}

app.get('/', (req, res) => {
    const db = new sqlite3.Database('cumparaturi.db');
    db.all('SELECT * FROM produse', (err, rows) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Server Error');
        }
        const userSession = req.session.user;
        res.render('index', { user: userSession, products: rows });
    });
    db.close();
});

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

app.get('/autentificare', function(req, res) {
    res.render('autentificare');
});

app.post('/verificare-autentificare', async (req, res) => {
  const { username, password } = req.body;
  try {
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

      req.session.user = username;
      req.session.role = user.role;
      res.cookie('username', username);
      if( user.role === 'admin')
        res.redirect(`/admin?message=${username}`);
      else
        res.redirect(`/?message=${username}`);
  } catch (err) {
      console.error('Error reading users file:', err);
      res.status(500).send('Server Error');
  }
});

app.get('/admin', requireAdmin, (req, res) => {
  res.render('admin');
});

app.post('/admin/add-product', requireAdmin, (req, res) => {
  const { name, price } = req.body;
  const db = new sqlite3.Database('cumparaturi.db');

  db.run('INSERT INTO produse (name, price) VALUES (?, ?)', [name, price], function(err) {
      if (err) {
          console.error('Error adding product:', err);
          return res.status(500).send('Server Error');
      }
      res.redirect('/admin');
  });

  db.close();
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

app.post('/rezultat-chestionar', (req, res) => {
    res.redirect(`/rezultat-chestionar?message=${req.session.user}`);
});

app.get('/rezultat-chestionar', function(req, res) {
    res.render('rezultat-chestionar');
});

// Route for creating the database and table
app.get('/creare-bd', (req, res) => {
    const db = new sqlite3.Database('cumparaturi.db');
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS produse (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL)', (err) => {
            if (err) {
                console.error('Error creating table:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/');
        });
    });
    db.close();
});

// Route for inserting data into the database
app.get('/inserarebd', (req, res) => {
    const db = new sqlite3.Database('cumparaturi.db');
    const produse = [
        { name: 'Produs1', price: 10.99 },
        { name: 'Produs2', price: 20.49 },
        { name: 'Produs3', price: 5.99 },
        { name: 'Produs4', price: 10.99 },
        { name: 'Produs5', price: 20.49 },
        { name: 'Produs6', price: 5.99 },
    ];

    db.serialize(() => {
        const stmt = db.prepare('INSERT INTO produse (name, price) VALUES (?, ?)');
        for (const produs of produse) {
            stmt.run(produs.name, produs.price, (err) => {
                if (err) {
                    console.error('Error inserting product:', err);
                }
            });
        }
        stmt.finalize((err) => {
            if (err) {
                console.error('Error finalizing statement:', err);
                return res.status(500).send('Server Error');
            }
            res.redirect('/');
        });
    });
    db.close();
});

app.get('/vizualizare-cos', (req, res) => {
  if (!req.session.cart) {
      req.session.cart = [];
  }

  const db = new sqlite3.Database('cumparaturi.db');
  const placeholders = req.session.cart.map(() => '?').join(',');
  const query = `SELECT * FROM produse WHERE id IN (${placeholders})`;

  db.all(query, req.session.cart, (err, rows) => {
      if (err) {
          console.error('Error fetching cart products:', err);
          return res.status(500).send('Server Error');
      }
      res.render('vizualizare-cos', { cartProducts: rows });
  });
  db.close();
});


app.post('/adaugare_cos', (req, res) => {
    const productId = req.body.id;
    if (!req.session.cart) {
        req.session.cart = [];
    }
    req.session.cart.push(productId);
    res.redirect('/');
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
