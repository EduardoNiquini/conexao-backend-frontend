-- Active: 1744304571931@@127.0.0.1@3306@protecmax
CREATE DATABASE ProtecMax;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (nome, email, senha) VALUES ("Isac", "isacakk@gmail.com", "123456")