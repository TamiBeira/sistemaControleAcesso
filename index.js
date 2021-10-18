const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const PORT = 3030;
const Cadastros = require('./Cadastros.js');

app = express();
app.use(cors()); //Não dar erro do back e front
app.use(express.json());//Imprimir os dados em JSON

//Ambiente conexão banco de dados
mongoose.connect('mongodb://localhost:27017/controleAcesso', {useNewUrlParser: true, useUnifiedTopology: true}).then((conn =>{
    console.log('Conectado ao banco de dados!');
})).catch(err =>{
    console.log('Erro na conexão com banco de dados!');
});

//START CADASTROS
//ROTA - INICIAL
app.get('/', (req,res)=>{
    Cadastros.find().then(cadastros=>{
        res.statusCode = 200;
        res.json(cadastros);
    }).catch(err=>{
        res.statusCode=500;
        res.json({err:err});
    })
})
//ROTA - CADASTRO
app.post('/cadastro',(req,res)=>{
    var nome = req.body.nome;
    var cpf = req.body.cpf;
    var empresa = req.body.empresa;
    var ativo = req.body.ativo;

//VALIDAÇÃO DADOS ENVIADOS
if(nome === '' || nome === ' ' || nome === undefined){
    res.json({msg: 'Nome não pode ser vazio!'});
    return;
}else if((cpf === '' || cpf === ' ' || cpf === undefined)){
    res.json({msg: 'CPF não pode ser vazio!'});
    return;
}else if((empresa === '' || empresa === ' ' || empresa === undefined)){
    res.json({msg: 'Empresa não pode ser vazia!'});
    return;
}else if((ativo === '' || ativo === ' ' || ativo === undefined)){
    res.json({msg: 'Ativo não pode ser vazio!'});
    return;
}
//SALVAR BANCO DE DADOS
const cadastros = new Cadastros({
    nome,
    cpf,
    empresa,
    ativo,
    data:Date.now()
})
cadastros.save().then(()=>{
    res.statusCode = 200;
    res.json({msg: 'Cadastro realizado com sucesso!'})
}).catch(err=>{
    res.statusCode = 500;
    res.json({err: err})
})
})
//ROTA - DELETAR CADASTRO
app.delete('/deletar-cadastro/:id',(req,res)=>{
    let id = req.params.id;
    Cadastros.deleteOne({'_id':id}).then(deletar=>{
        res.statusCode=200;
        res.json({msg: 'Cadastro deletado com sucesso!'});
    }).catch(err=>{
        res.statusCode=500;
        res.json({err: err});
    })
})
//ROTA - EDITAR CADASTRO
app.patch('/editar-cadastro/:id',(req,res)=>{
    let id = req.params.id;
    Cadastros.updateOne({'_id':id},req.body).then(editar=>{
        res.json({msg:'Atualização realizada com sucesso!'})
    }).catch(err=>{
        res.statusCode=500;
        res.json({err:err});
    })
})
//ROTA - PESQUISAR CADASTRO
app.get('/pesquisar-cadastro/:cpf', (req,res)=>{
    let cpf = req.params.cpf;

    Cadastros.findOne({'cpf': cpf}).then(cpf=>{
        if(cpf != undefined){
            res.statusCode = 200;
            res.json(cpf);
        }else{
            res.json({msg: 'Cliente não localizado no banco de dados!'});
        }
    }).catch(err=>{
        res.statusCode = 500;
        res.json({err: err})
    })
})

//STOP CADASTROS


//SERVIDOR
app.listen(PORT, (err)=>{
    if(err)throw err;
    console.log(`Servidor rodando: http://localhost:${PORT}`);
})