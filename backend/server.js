const express = require('express');
const session = require('express-session');
const cors = require('cors');
const pool = require('./db');
const noticesRoutes = require('./routes/notices');
const usersRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 60000 * 60},
}));

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL! Message:', err.message);
    } else {
        console.log('Successfully connected to PostgreSQL!');
    }
});

app.use('/api/notices', noticesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});