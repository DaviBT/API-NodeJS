'use strict';

const mongoose = require('mongoose');
const Customer = mongoose.model('Customer');
const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/customer-repository');
const md5 = require('md5');

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
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter ao menos 3 caracteres');
    contract.isEmail(req.body.email, 'Email inválido');
    contract.hasMinLen(req.body.password, 3, 'A senha deve conter ao menos 3 caracteres');

    // se os dados forem invállidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }


    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY), // criptografa a senha
            roles: ["user"]
        })

        console.log('SALT_KEY usada:', global.SALT_KEY);
        console.log('Senha original:', req.body.password);


        // servico de email para o usuario cadastrado
        // emailService.send(
        //     req.body.email,
        //      'Bem-vindo ao nosso serviço',
        //       global.EMAIL_TMPL.replace('{0}', req.body.name)
        //     )

        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });

    } catch (e) {
        handleError(res, e);
    }
}

// ---------------------------------------------
exports.authenticate = async (req, res, next) => {

    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }


        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        })

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
            }
        });

    } catch (e) {
        handleError(res, e);
    }
}


exports.refreshToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
        })

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name,
                roles: customer.roles
            }
        });

    } catch (e) {
        handleError(res, e);
    }

    console.log(res.error)
}
