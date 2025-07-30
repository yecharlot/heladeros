'use strict';
const express = require('express');
const router = express.Router();
const {Confirmation}=require('./AplicationDbContext.js');

// Obtener todas las cargas
router.get('/', async (req, res) => {
  try {
      const confirmations = await Confirmation.findAll();
      res.json(confirmations);
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
});


module.exports = router;