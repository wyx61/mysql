CREATE DATABASE IF NOT EXISTS week5_db DEFAULT CHARSET utf8mb4;

USE week5_db;

DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS categories;

CREATE TABLE sales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    month VARCHAR(20),
    amount INT
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50),
    value INT
);

INSERT INTO sales (month, amount) VALUES
('1月', 120),
('2月', 200),
('3月', 150),
('4月', 300),
('5月', 250),
('6月', 400);

INSERT INTO categories (name, value) VALUES
('食品', 35),
('服装', 25),
('电子产品', 20),
('生活用品', 15),
('其他', 5);

SELECT * FROM sales;
SELECT * FROM categories;
