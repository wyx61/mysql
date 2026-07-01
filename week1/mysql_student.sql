CREATE DATABASE student_db;

USE student_db;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20),
    name VARCHAR(50),
    height FLOAT
);

INSERT INTO students (student_id, name, height)
VALUES
('2023001', 'Zhang San', 168.5),
('2023002', 'Li Si', 172.0),
('2023003', 'Wang Wu', 165.5);

SELECT * FROM students;

UPDATE students
SET height = 170.0
WHERE student_id = '2023001';

DELETE FROM students
WHERE student_id = '2023003';
