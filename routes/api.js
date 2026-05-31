const express = require('express');
const router = express.Router();
const killers = require('../data/killers');
const survivors = require('../data/survivors');

router.get('/killers', (req, res) => {
    res.json(killers);
});

router.get('/survivors', (req, res) => {
    res.json(survivors);
});

// NUEVO: Ruta para obtener absolutamente todos los personajes mezclados
router.get('/all', (req, res) => {
    res.json([...killers, ...survivors]);
});

module.exports = router;