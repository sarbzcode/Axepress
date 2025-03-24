const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const {Pool} = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.PG_URI,
});

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to PostgreSQL! Message:', err.message);
    } else {
        console.log('Successfully connected to PostgreSQL!');
    }
});

mongoose
.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB successfully!'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});