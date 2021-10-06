const conexao = require('../conexao');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtSegredo = require('../jwt')

const cadastrarUsuario = async(req, res) => {
  const { nome, email, senha, nome_loja } = req.body;

	if (!nome || !email || !senha || !nome_loja) {
		return res.status(404).json({"mensagem": "Todos os campos são obrigatórios!"});
	}

  try {
    const query = 'SELECT * FROM usuarios where email = $1';
    const {rowCount: qntdUsuarios} = await conexao.query(query, [email])
    if (qntdUsuarios > 0) {
      return res.status(404).json({"mensagem": "Este email já foi cadastrado!"});
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const queryCadastrar = 'INSERT INTO usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';

    const usuarioCadastrado = await conexao.query(queryCadastrar, [nome, email, senhaCriptografada, nome_loja]);

    if(usuarioCadastrado.rowCount === 0) {
      return res.json(400).json({"mensagem": "Falha ao cadastrar o usuário!"})
    }

    return res.status(200).json();


  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar com o servidor!"})
  }
  

}


const loginUsuario = async(req, res) => {
  const { email, senha } = req.body;

	if (!email || !senha) {
		return res.status(404).json({"mensagem": "Todos os campos são obrigatórios!"});
	}

  try {
    const query = 'SELECT * FROM usuarios where email = $1';
    const {rows, rowCount} = await conexao.query(query, [email])
      if (rowCount === 0)
        return res.status(404).json({"mensagem": "Email ou senha incorretos!"});
    
    const usuario = rows[0];
    const senhaVerificada = await bcrypt.compare(senha, usuario.senha);
      if(!senhaVerificada) { return res.status(400).json({"mensagem": "Email e/ou senha incorretos!"})};

    const token = jwt.sign({id: usuario.id, nome: usuario.nome, email: usuario.email, nome_loja: usuario.nome_loja}, jwtSegredo, {expiresIn: '30d'});

    return res.status(200).json({"token": token})

  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar com o servidor!"})
  }
  
}

const detalharUsuario = async(req, res) => {
  const {id} = req.usuario;

    try{
        const infoUsuario = await conexao.query('select * from usuarios where id = $1', [id]);

        if(infoUsuario.rowCount == 0){
          return res.status(401).json({mensagem: "Usuario não autorizado"});
        }
        
        return res.status(200).json(req.usuario);
    }catch(error){
        return res.status(400).json({"mensagem": error.message});
    }
}


const atualizarUsuario = async(req, res) => {
  const {usuario} = req;
  const {id} = usuario;
  const {nome, email, senha, nome_loja} = req.body;

	if (!nome || !email || !senha || !nome_loja) {
		return res.status(404).json({"mensagem": "Todos os campos são obrigatórios!"});
	}


  try {
    const query = 'SELECT * FROM usuarios where email = $1';
    const {rowCount: qntdUsuarios} = await conexao.query(query, [email])
    if (qntdUsuarios > 0) {
      return res.status(404).json({"mensagem": "O e-mail informado já está sendo utilizado por outro usuário."});
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryAtualizar = 'UPDATE usuarios SET nome = $1, email = $2, senha = $3, nome_loja= $4 WHERE id = $5';
    const usuarioCadastrado = await conexao.query(queryAtualizar, [nome, email, senhaCriptografada, nome_loja, id]);
    
    if(usuarioCadastrado.rowCount === 0) {
      return res.json(400).json({"mensagem": "Falha ao atualizar o usuário!"})
    }
    
    return res.status(200).json();

  } catch (error) {
    return res.status(400).json({"mensagem": "Falha ao se conectar com o servidor!"})
  }
  

}

module.exports = {
  cadastrarUsuario,
  loginUsuario,
  detalharUsuario,
  atualizarUsuario
}