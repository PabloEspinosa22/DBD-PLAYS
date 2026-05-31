const express = require('express');
const router = express.Router();
const killers = require('../data/killers');
const survivors = require('../data/survivors');

// Ahora enviamos los arreglos completos
router.get('/killers', (req, res) => {
    res.json(killers);
});

router.get('/survivors', (req, res) => {
    res.json(survivors);
});

module.exports = router;