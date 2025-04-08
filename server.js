const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const vetRoutes = require('./routes/vetRoutes');
const app = express();
const Appointment = require('./models/appointment');
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/petshopDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//routes
app.use('/api', vetRoutes);
// Define User schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Serve static files
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        req.session.user = user;
        res.redirect('/');
    } else {
        res.render('login', { error: 'Invalid email or password' });
    }
});

app.get('/signup', (req, res) => res.render('signup', { error: null }));

app.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { error: 'User already exists' });
        }
        const newUser = new User({ email, password });
        await newUser.save();
        req.session.user = newUser;
        res.redirect('/');
    } catch (error) {
        res.render('signup', { error: 'Signup failed. Try again.' });
    }
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
// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
res.render('vet.ejs', { user: req.session.user });
});

app.post('/vet', async (req, res) => {
    try {
      const { name, email, date, message } = req.body;
      const appointment = await Appointment.create({ name, email, date, message });
      console.log("📥 Saved to petshopdb:", appointment);
      res.send("✅ Appointment booked!");
    } catch (err) {
      console.error("❌ Error:", err);
      res.status(500).send("Something went wrong.");
    }
  });
  
  
// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
