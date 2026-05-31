const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public')); // Sirve el frontend
app.use('/api', apiRoutes); // Rutas backend

app.listen(PORT, () => {
    console.log(`Servidor de la Entidad corriendo en http://localhost:${PORT}`);
});