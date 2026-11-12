CREATE DATABASE IF NOT EXISTS fazenda_sabia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fazenda_sabia;

-- Tabela de Usuários/Administradores
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Hash de senha (bcrypt/argon2)
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Animais (Poll Dorset)
CREATE TABLE IF NOT EXISTS animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    registro VARCHAR(50), -- Registro da associação/ABCO
    sexo ENUM('Macho', 'Femea') NOT NULL,
    tipo ENUM('Animal', 'Embriao') DEFAULT 'Animal',
    categoria ENUM('Exposicao', 'Venda') NOT NULL DEFAULT 'Exposicao',
    status ENUM('Disponivel', 'Vendido', 'Reservado') DEFAULT 'Disponivel',
    preco DECIMAL(10,2) NULL, -- Preço opcional
    descricao TEXT,
    
    -- Relacionamento com Pai e Mãe
    pai_id INT NULL,
    mae_id INT NULL,
    
    -- Se os pais não estiverem cadastrados no sistema, permite o nome direto
    nome_pai VARCHAR(100) NULL,
    nome_mae VARCHAR(100) NULL,
    
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pai_id) REFERENCES animais(id) ON DELETE SET NULL,
    FOREIGN KEY (mae_id) REFERENCES animais(id) ON DELETE SET NULL
);

-- Tabela de Fotos dos Animais
CREATE TABLE IF NOT EXISTS fotos_animais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    caminho_imagem VARCHAR(255) NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (animal_id) REFERENCES animais(id) ON DELETE CASCADE
);