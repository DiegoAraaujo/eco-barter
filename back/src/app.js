const express = require('express');
const app = express();
const usuarioRoutes = require('./routes/usuarioRoutes');



app.use(express.json());


app.get('/', (req, res) => {
    res.send('back');
});

app.use('/usuarios', usuarioRoutes);




module.exports = app;