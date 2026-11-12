-- Criação do Banco de Dados da Fazenda Sabiá
CREATE DATABASE IF NOT EXISTS fazenda_sabia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fazenda_sabia;

-- Tabela de Usuários Administrativos
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir usuário administrador padrão (senha temporária: admin123)
INSERT INTO usuarios (email, senha) VALUES ('admin@fazendasabia.com.br', '$2b$10$ExemploHashSenhaAdminPlaceholder');

-- Tabela de Animais (Plantel e Comercialização com suporte a até 5 fotos e vídeo)
CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tatuagem VARCHAR(50) NOT NULL UNIQUE,
    categoria ENUM('reprodutor', 'matriz', 'embriao', 'exposicao') NOT NULL,
    status_venda BOOLEAN DEFAULT FALSE, -- TRUE se estiver à venda
    premio VARCHAR(150),
    nascimento DATE,
    pai VARCHAR(100),
    mae VARCHAR(100),
    descricao TEXT,
    foto_1 VARCHAR(255),
    foto_2 VARCHAR(255),
    foto_3 VARCHAR(255),
    foto_4 VARCHAR(255),
    foto_5 VARCHAR(255),
    video_url VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```[cite: 8]