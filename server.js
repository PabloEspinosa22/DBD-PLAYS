const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Importamos el archivo de rutas que acabas de modificar
const apiRoutes = require('./routes/api');

// 2. Sirve los archivos de la carpeta public (HTML, CSS, JS del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// 3. Conectamos las rutas. Todo lo que vaya a '/api' usará tu archivo api.js
app.use('/api', apiRoutes);

// 4. Iniciar el servidor
app.listen(port, () => {
    console.log(`La Entidad está escuchando en el puerto ${port}`);
});