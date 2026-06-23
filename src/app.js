const express = require('express');
const cors = require('cors');
const path = require('path');

const whatsapp = require('./routes/AlertasClientesWhatsapp.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API funcionando correctamente'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api/whatsapp', whatsapp);

app.use(errorHandler);

module.exports = app;