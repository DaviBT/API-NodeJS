'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const config = require('./config');


const app = express();
const router = express.Router();

// conexão com BD
mongoose.connect(config.connectionString);


app.use(bodyParser.json(
    { limit: "5mb" }
));

app.use(bodyParser.urlencoded({ extended: false }));

// habilita o CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// MODELS
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');


// ROTAS
const indexRoute = require('./routes/index');
const productRoute = require('./routes/product');
const customerRoute = require('./routes/customer');
const orderRoute = require('./routes/order');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", indexRoute)
app.use("/products", productRoute)
app.use("/customers", customerRoute)
app.use("/orders", orderRoute)

module.exports = app;