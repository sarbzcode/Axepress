const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
require('dotenv').config();

const validInvitationCode = 'AcadiaU@AxeConnect';

router.post('/signup', async (req, res) => {
    const { name, username, email, password, invitationCode } = req.body;
    if (invitationCode !== validInvitationCode) {
        return res.status(403).send('Invalid invitation code. Signup restricted.');
      }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3, $4)',
        [name, username, email, hashedPassword]
      );
      res.status(201).send('User registered successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user!');
    }
  });

router.post('/login', async (req, res)=> {
    const {username, password} = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if(result.rows.length === 0) {
            return res.status(400).send('User not found!');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).send('Incorrect password!');
        }
        req.session.user = {
          id: user.id,
          username: user.username,
          session_key: 'YES',
        };
        res.status(200).send('Login successful!');
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).send('Server Error');
    }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out!');
    }
    res.send('Logout successful!');
  });
});

module.exports = router;