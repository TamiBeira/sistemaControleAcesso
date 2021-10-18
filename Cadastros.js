const mongoose = require('mongoose');

const Cadastros = mongoose.model('Cadastros', 
    {
     nome: String,
     cpf : String, 
     empresa: String,
     ativo: String,
     data:Date
    });


module.exports = Cadastros;