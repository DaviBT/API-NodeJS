'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    // id é criado automaticamente
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'o slug é obrigatório'],
        unique: true,
        index: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    tags: [{
        type:String,
        required:true
    }], // array de string

    // imagem (azure)
    // image: {
    //     type: String,
    //     required: true,
    //     trim: true
    // }
 
});

module.exports = mongoose.model('Product', schema); // nome do model é product