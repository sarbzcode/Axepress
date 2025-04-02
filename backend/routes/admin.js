const express = require('express');
const router = express.Router();

// Admin Dashboard - Protected Route using express-session
router.get('/admindashboard', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the Admin Dashboard, ${req.session.user.username}!`);
  } else {
    res.status(401).send('Unauthorized: Please log in.');
  }
});

module.exports = router;