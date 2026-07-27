const express = require('express');
const router = express.Router();

// Como estamos dentro de la carpeta 'routes', usamos '../' para salir y entrar a 'data'
router.get('/killers', (req, res) => res.json(require('../data/killers')));
router.get('/survivors', (req, res) => res.json(require('../data/survivors')));
router.get('/perks', (req, res) => res.json(require('../data/perks')));

// Es obligatorio exportar el router para que server.js lo pueda leer
module.exports = router;