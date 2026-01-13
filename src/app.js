const express = require('express');
const routes = require('./routes');

// Importar configuração do Supabase para inicializar teste ao subir
require('./config/supabase');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/', routes);

module.exports = app;
