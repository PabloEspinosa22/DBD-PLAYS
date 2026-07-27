const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// El '../' le dice que salga de la carpeta 'routes' y busque 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de las bases de datos (también saliendo un nivel con '../')
app.get('/api/killers', (req, res) => res.json(require('../data/killers')));
app.get('/api/survivors', (req, res) => res.json(require('../data/survivors')));
app.get('/api/perks', (req, res) => res.json(require('../data/perks')));

// Iniciar el servidor
app.listen(port, () => {
    console.log(`La Entidad está escuchando en el puerto ${port}`);
});