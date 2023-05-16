INSERT INTO departments (department_name)
VALUES 
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES
('Sales Lead', 100000.00, 1),
('Salesperson', 80000.00, 2),
('Lead Engineer', 150000.00, 3),
('Software Engineer', 120000.00, 4),
('Account Manager', 160000.00, 5),
('Accountant', 125000.00, 6),
('Legal Team Lead', 250000.00, 7),
('Lawyer', 190000.00, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, 0),
('Mike', 'Chan', 2, 1),
('Ashley', 'Rodriguez', 3, 0),
('Kevin', 'Tupik', 4, 3),
('Kunal', 'Singh', 5, 0),
('Malia', 'Brown', 6, 5),
('Sarah', 'Lourd', 7, 0),
('Tom', 'Allen', 8, 7);
