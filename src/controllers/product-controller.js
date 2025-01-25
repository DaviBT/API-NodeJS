// MVC - Crontroller
'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator')
const repository = require('../repositories/product-repository');
// const azure = require('azure-storage'); imagem  (azure)
// const guid = require('guid'); imagem  (azure)
// const config = require('../config'); imagem  (azure)


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
        let data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        handleError(res, e);
    }

}



exports.getBySlug = async (req, res, next) => {
    try {
        let data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        handleError(res, e);
    }
}

exports.getById = async (req, res, next) => {
    try {
        let data = await repository.getById(req.params.id);
        res.status(200).send({ data });
    } catch (e) {
        handleError(res, e);
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        const data = await repository.getByTag(req.params.tag)
        res.status(200).send({ data });
    } catch (e) {
        handleError(res, e);
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter ao menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter ao menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter ao menos 3 caracteres');

    // se os dados forem invállidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }


    try {
        //           imagem  (azure)
        // cria o blob service 
        /* const blobSvc = azure.createBlobService(config.userImagesBlobConnectionString);
 
         let filename = guid.raw().toString() + '.jpg';
         let rawdata = req.body.image;
         let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
         let type = matches[1];
         let buffer = new Buffer(matches[2], 'base64')
 
         // salva a imagem
         await blobSvc.createBlockBlobFromText('product-images', filename, buffer, {
             contentType: type
         }, function(error, result, response){
             if (error) {
                 filename = 'default-product.png'
             }
         }); 
         */


        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags
            // image: 'https://nodestr.blob.core.windows.net/product-images + filename
        })
        res.status(201).send({ message: 'Produto cadastrado com sucesso!' });

    } catch (e) {
        handleError(res, e);
    }
}


// exports.put = (req, res, next) => {
//         const id = req.params.id;
//         res.status(200).send({
//             id:id,
//             item: req.body
//         });
//     };

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body)
        res.status(200).send({
            message: 'Produto atualizado com sucesso!'
        })
    } catch (e) {
        handleError(res, e);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({
            message: 'Produto removido com sucesso!'
        });
    } catch (e) {
        handleError(res, e);
    }
};

// exports.delete = (req, res, next) => {
//     res.status(200).send(req.body);
// }
// -------
