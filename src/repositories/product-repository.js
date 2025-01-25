'use strict';
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require('../validators/fluent-validator');


// Métodos do product controller

exports.get = async () => {
    const res = await Product.find({
        active: true
    }, 'title price slug');

    return res;
}

exports.getBySlug = async (slug) => {
    const res = await Product
        .findOne(
            {
                slug: slug, // o parâmetro slug recebido
                active: true
            },
            'title description price slug tags'
        );
    return res;
};


exports.getById = async (id) => {
    const res = await Product
        .findById(id);
    return res;
}

exports.getByTag = async (tag) => {
    const res = Product
        .find({
            tags: tag,
            active: true
        }, 'title description tags');
    return res;
};

exports.create = async (data) => {
    var product = new Product(data);
    await product.save()
}


exports.update = async (id, data) => {
    await Product
        .findByIdAndUpdate(id, {
            $set: {
                title: data.title,
                description: data.description,
                price: data.price,
                slug: data.slug
            }
        });
}

exports.delete = async (id) => {
    await Product
        .findOneAndDelete(id);
};