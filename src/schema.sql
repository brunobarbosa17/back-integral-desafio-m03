DROP DATABASE IF EXISTS markte_cubos;
CREATE DATABASE market_cubos;
DROP TABLE if exists usuarios;
CREATE TABLE usuarios(
  id SERIAL UNIQUE PRIMARY KEY,
  nome TEXT,
  nome_loja TEXT,
  email TEXT UNIQUE,
  senha TEXT
);
DROP TABLE if exists produtos;
CREATE TABLE produtos(
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  nome text NOT NULL,
  quantidade SMALLINT NOT NULL,
  categoria TEXT,
  preco INTEGER NOT NULL,
  descricao TEXT,
  imagem TEXT,
  FOREIGN KEY (usuario_id) references usuarios (id)
)