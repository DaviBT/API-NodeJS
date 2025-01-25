const { connection } = require("mongoose");

global.SALT_KEY = '2d34fa7f8839b0c7df87c501d8d01292f6316ac8fc7493d1bf9088adfcb21dc6';
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem-vindo ao nosso serviço';

module.exports = {
    connectionString: 'mongodb+srv://',
    // sendgridKey: 'TBD',                   servico de email para o usuario cadastrado
    // containerConectionString: 'TBD'       imagem  (azure)
}