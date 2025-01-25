'use strict';

const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/order-repository');
const guid = require('guid');
const authService = require('../services/auth-service');

// tratamento de erros
const handleError = (res, e, message = 'Falha ao processar a requisição') => {
    res.status(500).send({
        error: e.message || e,
        message,
    });
};


// CRUD - métodos

exports.get = async (req, res, next) => {

    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        handleError(res, e);
    }

}

exports.post = async (req, res, next) => {

    try {
        // recupera o token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decodifica o token
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        })
        res.status(201).send({ message: 'Pedido cadastrado com sucesso!' });

    } catch (e) {
        handleError(res, e);
    }

}
