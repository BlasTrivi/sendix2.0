// backend/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

// Whitelist para CORS
const whitelist = ['http://localhost:3000', 'https://*.netlify.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.some(w => {
      if (w.includes('*')) {
        // Soporte para subdominios Netlify
        const regex = new RegExp('^' + w.replace('*.', '[^.]+\\.') + '$');
        return regex.test(origin);
      }
      return origin === w;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/healthz', (req, res) => {
  res.json({ ok: true });
});

// Middleware de errores centralizado
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en puerto ${PORT}`);
});
