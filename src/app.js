const express = require('express')
const bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());

const routes = require('./routes/index')
app.use('/', routes)

module.exports = app;
