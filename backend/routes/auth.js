const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');
require('dotenv').config();

const validInvitationCode = process.env.VALID_INVITATION_CODE;

function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

router.post('/signup', async (req, res) => {
    const { name, username, email, password, invitationCode } = req.body;

    const isValidEmail = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email);
    if (!isValidEmail) {
        return res.status(400).send('Invalid email format');
    }

    if (invitationCode !== validInvitationCode) {
        return res.status(403).send('Invalid invitation code. Signup restricted.');
      }
    try {
      const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      if (userCheck.rows.length > 0) {
        return res.status(400).send('Username already taken.');
      }
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
        };
        res.status(200).json({message: 'Login successful!', user: {id: user.id, username: user.username}});
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
    res.status(200).send('Logout successful!');
  });
});

router.get('/admindashboard', ensureAuthenticated, (req,res) => {
  res.status(200).json({message: 'Welcome to the admin dashboard'});
});

router.get('/status', (req, res) => {
  if (req.session.user) {
    return res.status(200).json({loggedIn: true, user: req.session.user});
  } else {
    return res.status(200).json({loggedIn: false});
  }
});

module.exports = router;