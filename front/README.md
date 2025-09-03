A banco de dados informacao 

-- Criar a base de dados
CREATE DATABASE IF NOT EXISTS house
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE house;

-- Criar tabela de utilizadores
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'customer') DEFAULT 'user',
    avatar VARCHAR(255) DEFAULT 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de casas
CREATE TABLE cad_house (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    descricao TEXT,
    address VARCHAR(255) NOT NULL,
    regularPrice DECIMAL(10,2) NOT NULL,
    discountPrice DECIMAL(10,2),
    bathroom INT DEFAULT 0,
    bedroom INT DEFAULT 0,
    parking BOOLEAN DEFAULT FALSE,
    type ENUM('venda', 'arrendamento') NOT NULL,
    offer BOOLEAN DEFAULT FALSE,
    imageUrl TEXT,
    userRef INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY (userRef) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE cad_house (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  descricao TEXT,
  address VARCHAR(500),
  regularPrice DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discountPrice DECIMAL(10, 2) NULL,
  bathroom INT NOT NULL DEFAULT 1,
  bedroom INT NOT NULL DEFAULT 1,
  kitchen INT NOT NULL DEFAULT 1,
  parking BOOLEAN NOT NULL DEFAULT FALSE,
  type ENUM('rent', 'sale') NOT NULL DEFAULT 'rent',
  offer BOOLEAN NOT NULL DEFAULT FALSE,
  imageUrls TEXT, -- Armazena JSON array de URLs
  userRef INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userRef) REFERENCES users(id) ON DELETE CASCADE
);