const express = require('express');
const router = express.Router();
const killers = require('../data/killers');
const survivors = require('../data/survivors'); // <-- Nueva base de datos

// Ruta para asesinos
router.get('/random-killer', (req, res) => {
    const randomIndex = Math.floor(Math.random() * killers.length);
    res.json(killers[randomIndex]);
});

// Ruta para supervivientes
router.get('/random-survivor', (req, res) => {
    const randomIndex = Math.floor(Math.random() * survivors.length);
    res.json(survivors[randomIndex]);
});

module.exports = router;