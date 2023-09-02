var express = require('express');
const conectarDB = require("./config/connection");
const cors = require('cors');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json())
app.use(express.json());
app.use(cors());
app.use('/api/v1', require('./routes/routes.js'))
conectarDB();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


module.exports = app