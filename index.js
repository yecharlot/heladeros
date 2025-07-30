'use strict';
const express = require('express');
const router = express.Router();
const db=require('./sqlite.js');

router.get('/', (req, res) => {
    const host=req.hostname;
    const ruta=req.path;
    

  });


module.exports = router;