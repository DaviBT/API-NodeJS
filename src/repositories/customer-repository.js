'use strict';
const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const ValidationContract = require('../validators/fluent-validator');


// Métodos do customer controller
exports.get = async () => {
    const res = await Customer.find({}, 'name email ');

    return res;
}

exports.create = async (data) => {
    var customer = new Customer(data);
    await customer.save()
}

exports.authenticate = async (data) => {
    const res = await Customer.findOne({
        email: data.email,
        password: data.password
    });
    return res;
}

exports.getById = async (id) => {
    const res = await Customer.findById(id);
    return res;
}