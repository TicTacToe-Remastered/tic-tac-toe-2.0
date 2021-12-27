require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(helmet());
app.use(cors());
app.use('/', (req, res) => res.end('🚀 Hello World! 🚀'));

const http = require('http').createServer(app);

module.exports = http;