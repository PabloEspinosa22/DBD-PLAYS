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

router.get('/all', (req, res) => {
    res.json([...killers, ...survivors]);
});

module.exports = router;