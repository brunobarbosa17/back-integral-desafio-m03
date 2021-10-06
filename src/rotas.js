const express = require('express');
const usuario = require('./controladores/usuario');
const verificarLogin = require('./filtros/verificarLogin');
const produto = require('./controladores/produtos')
const rotas = express();

rotas.post('/usuario', usuario.cadastrarUsuario);
rotas.post('/login', usuario.loginUsuario);
rotas.get('/usuario', verificarLogin, usuario.detalharUsuario);
rotas.put('/usuario', verificarLogin, usuario.atualizarUsuario);

//

rotas.get('/produtos', verificarLogin, produto.listarProdutos);
rotas.get('/produtos/:id', verificarLogin, produto.detalharProduto);
rotas.post('/produtos', verificarLogin, produto.cadastrarProduto);
rotas.put('/produtos/:id', verificarLogin, produto.atualizarProduto);
rotas.delete('/produtos/:id', verificarLogin, produto.excluirProduto);




module.exports = rotas;