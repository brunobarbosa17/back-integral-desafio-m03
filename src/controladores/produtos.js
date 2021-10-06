const conexao = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSegredo = require('../jwt')

const listarProdutos = async(req, res) => {
  const {usuario} = req;
  const {id} = usuario;

  try {
    const query = 'SELECT * FROM produtos where usuario_id = $1';
    const {rowCount: qntdProdutos, rows} = await conexao.query(query, [id]);

    return res.status(200).json(rows);

  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar com o servidor!"})
  }

}

const detalharProduto = async(req, res) => {
  const {usuario} = req;
  const {id} = usuario;
  const idProduto = Number(req.params.id);

  try {
    const query = `SELECT * FROM produtos WHERE usuario_id= $1 AND id= $2 `;
    const {rowCount: qntdProdutos, rows} = await conexao.query(query, [id, idProduto]);

    if (rows.length === 0) {
      return res.status(400).json({"mensagem": `Não existe produto cadastrado com ID ${idProduto}.`});
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar com o servidor!"})
  }

}

const cadastrarProduto = async(req, res) => {
  const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;

  if (quantidade < 0) { return res.status(401).json({"mensagem": "Informe a quantidade de produtos"})};
  if (!preco || preco < 0) { return res.status(401).json({"mensagem": "O preço do produto deve ser informado."})};
  if (!nome) { return res.status(401).json({"mensagem": "O nome do produto deve ser informado."})};
  if (!quantidade || quantidade < 0) { return res.status(401).json({"mensagem": "A quantidade do produto deve ser informado."})};
  if (!descricao) { return res.status(401).json({"mensagem": "A descricao do produto deve ser informado."})};
  
  const {usuario} = req;
  if(!usuario) { return res.status(401).json({"mensagem": "Para cadastrar um produto, o usuário deve estar autenticado."})};
  const {id} = usuario;

  try {
    const queryUsuario = 'SELECT * FROM usuarios WHERE id = $1';
    const {rows, rowCount } = await conexao.query(queryUsuario, [id]);
    const usuario = rows[0];

    const queryProduto = 'INSERT INTO produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7);';

    const produto = await conexao.query(queryProduto, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem])


    return res.status(200).json();

  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar ao servidor."})
  }

}


const atualizarProduto = async(req, res) => {
  const {nome, quantidade, categoria, preco, descricao, imagem} = req.body;
  const idProduto = Number(req.params.id);

  if (quantidade < 0) { return res.status(401).json({"mensagem": "Informe a quantidade de produtos"})};
  if (!preco || preco < 0) { return res.status(401).json({"mensagem": "O preço do produto deve ser informado."})};
  if (!nome) { return res.status(401).json({"mensagem": "O nome do produto deve ser informado."})};
  if (!quantidade) { return res.status(401).json({"mensagem": "A quantidade do produto deve ser informado."})};
  if (!descricao) { return res.status(401).json({"mensagem": "A descrição produto deve ser informado."})};
  
  const {usuario} = req;
  const {id} = usuario;

  try {
    const queryProduto = 'SELECT * FROM produtos WHERE id = $1';
    const {rows, rowCount } = await conexao.query(queryProduto, [idProduto]);
    const analisarProduto = rows[0];

    if (!analisarProduto) {return res.status(400).json({"mensagem": "Produto não encontrado."})}

    const queryAtualizarProduto = 'UPDATE produtos SET nome= $1, quantidade= $2, categoria= $3, preco= $4, descricao= $5, imagem= $6 WHERE id = $7 and usuario_id= $8;';

    const produto = await conexao.query(queryAtualizarProduto, [nome, quantidade, categoria, preco, descricao, imagem, idProduto, id])
    
    if (produto.rowCount === 0) {return res.status(400).json({"mensagem": "Produto não encontrado."})}

    return res.status(200).json();

  } catch (error) {
    return res.status(400).json(error.message)
  }



}
const excluirProduto = async(req, res) => {
  const idProduto = Number(req.params.id);

  const {usuario} = req;
  const {id} = usuario;

  try {
    const produto = await conexao.query['SELECT * FROM produtos WHERE id= $1 and usuario_id= $2', [idProduto, id]]

    const queryDeletarProduto = 'DELETE FROM produtos WHERE id= $1 and usuario_id= $2;';
    const produtoDeletado = await conexao.query(queryDeletarProduto, [idProduto, id]);


    if(produtoDeletado.rowCount === 0) { return res.status(404).json({"mensagem": `Não existe produto para o ID ${idProduto}.`})};

    return res.status(200).json();

  } catch (error) {
    return res.status(400).json(error.message)
  }

}






module.exports = {
  listarProdutos,
  detalharProduto,
  cadastrarProduto,
  atualizarProduto,
  excluirProduto
}




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibm9tZSI6IkJydW5vIiwiZW1haWwiOiJicnVubm9iYXJib3Nhc0BnbWFpbC5jb20iLCJub21lX2xvamEiOiJHb21vcyIsImlhdCI6MTYzMzQ0OTMxNSwiZXhwIjoxNjM2MDQxMzE1fQ.TUpwQO37hMAbHvPthiH7rEOhnYYpdhBp-wwVAs439Z4