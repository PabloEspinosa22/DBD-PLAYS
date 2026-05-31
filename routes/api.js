const express = require('express');
const router = express.Router();
const killers = require('../data/killers');

// Ruta para obtener un personaje aleatorio
router.get('/random-killer', (req, res) => {
    const randomIndex = Math.floor(Math.random() * killers.length);
    const selectedKiller = killers[randomIndex];
    res.json(selectedKiller);
});

module.exports = router;