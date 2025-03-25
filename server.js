const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Setup session
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Routes
app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('home', { user: req.session.user });
});

app.get('/login', (req, res) => res.render('login', { error: null }));
app.post('/login', (req, res) => {
    const { email } = req.body;
    req.session.user = { email };
    res.redirect('/signup');
});

app.get('/signup', (req, res) => res.render('signup', { error: null }));
app.post('/signup', (req, res) => {
    req.session.user = { email: req.body.email };
    res.redirect('/');
});

app.get('/shop', (req, res) => res.render('shop'));
app.get('/vet', (req, res) => res.render('vet'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/cart', (req, res) => res.render('cart'));
app.get('/forgot-password', (req, res) => res.render('forgot-password', { error: null }));

app.post('/vet', (req, res) => {
    console.log('Vet Appointment:', req.body);
    res.send('Appointment booked successfully!');
});

app.post('/contact', (req, res) => {
    console.log('Contact Form:', req.body);
    res.send('Message sent successfully!');
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
