DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE employees(
  id INT auto_increment PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT default 0,
  manager_id INT default 0
);
CREATE TABLE roles(
  id INT auto_increment,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

CREATE TABLE departments(
  id INT auto_increment,
  name VARCHAR(30),
  PRIMARY KEY (id)
);

INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
values(id,"tim", "tom", 1, 1);
INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
values(id,"jim", "john", 2, 2);
INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
values(id,"kim", "vin", 3, 3);


INSERT INTO roles(id, title, salary, department_id)
values(id, "Engineer", 150000, 2);
INSERT INTO roles(id, title, salary, department_id)
values(id, "Counselor", 60000, 3);
INSERT INTO roles(id, title, salary, department_id)
values(id, "CEO", 1000000000, 1);

INSERT INTO departments(id, name)
values(id, "Management");
INSERT INTO departments(id, name)
values(id, "Engineering");
INSERT INTO departments(id, name)
values(id, "Human Resources");





