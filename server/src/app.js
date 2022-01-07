require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const api = require('./api');

const app = express();

app.use(helmet());
app.use(cors());
app.use('/', (req, res) => res.end('🚀 Hello World! 🚀'));
app.use('/api/v1', api);

const http = require('http').createServer(app);

module.exports = http;