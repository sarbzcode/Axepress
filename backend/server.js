const express = require('express');
const session = require('express-session');
const cors = require('cors');
//const mongoose = require('mongoose');
const pool = require('./db');
const noticesRoutes = require('./routes/notices');
const usersRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const categoriesRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000 * 60},
}));
app.use(express.urlencoded({extended:true}));

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL! Message:', err.message);
    } else {
        console.log('Successfully connected to PostgreSQL!');
    }
});

//will expand onto mongoose if project demands it
//mongoose
//.connect(process.env.MONGO_URI)
//.then(() => console.log('Connected to MongoDB successfully!'))
//.catch((err) => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.use('/api/notices', noticesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/auth/login', (req, res) => {
    const {username, password} = req.body;
    req.session.user = {username};
    res.send('Login successful', username);
});

app.get('/api/admin/admindashboard', (req, res) => {
    if (req.session.token) {
        res.status(200).send('User is authenticated');
    } else {
        res.status(401).send('Unauthorized.');
    }
});