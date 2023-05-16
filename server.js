const inquirer = require("inquirer");
const mysql = require("mysql2");

const connection = require("./db/connection") ({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "WangPerez198679!",
  database: "employeeTracker_db",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "Add Employee",
        "Update Employee Role",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "Quit",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          connection.end();
          console.log("Goodbye!");
          break;
      }
    });
}

function viewAllEmployees() {
  const query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    roles.title, 
    department.department_name AS department, 
    roles.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN roles ON employee.role_id = roles.id 
    LEFT JOIN department ON roles.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id;`;
  connection.query(query, (err, data) => {
    if (err) throw err;
    console.table(data);
    start();
  });
}

function addEmployee() {
  connection.query("SELECT id, title FROM roles", (error, results) => {
    if (error) {
      console.error(error);
      return;
    }

    const roles = results.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    connection.query(
      'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
      (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        const managers = results.map(({ id, name }) => ({
          name,
          value: id,
        }));

        inquirer
          .prompt([
            {
              type: "input",
              name: "firstName",
              message: "Enter the employee's first name:",
            },
                  {
                    type: "input",
                    name: "lastName",
                    message: "Enter the employee's last name:",
                  },
                  {
                    type: "list",
                    name: "roleId",
                    message: "Select the employee role:",
                    choices: roles,
                  },
                  {
                    type: "list",
                    name: "managerId",
                    message: "Select the employee manager:",
                    choices: [
                      { name: "None", value: null },
                      ...managers,
                    ],
                  },
                ])
                .then((answers) => {
                  const sql =
                    "INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)";
                  const values = [
                    answers.firstName,
                    answers.lastName,
                    answers.roleId,
                    answers.managerId,
                  ];
                  connection.query(sql, values, (error) => {
                    if (error) {
                      console.error(error);
                      return;
                    }
      
                    console.log("Employee added successfully");
                    start();
                  });
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          );
        });
      }

      function updateEmployeeRole() {
        const queryEmployees =
          "SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee LEFT JOIN roles ON employee.role_id = roles.id";
        const queryRoles = "SELECT * FROM roles";
        connection.query(queryEmployees, (err, resEmployees) => {
          if (err) throw err;
          connection.query(queryRoles, (err, resRoles) => {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "employee",
                            message: "Select the employee to update:",
                            choices: resEmployees.map(
                                (employee) =>
                                    `${employee.first_name} ${employee.last_name}`
                            ),
                        },
                        {
                            type: "list",
                            name: "role",
                            message: "Select the new role:",
                            choices: resRoles.map((role) => role.title),
                        },
                    ])
                    .then((answers) => {
                        const employee = resEmployees.find(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}` ===
                                answers.employee
                        );
                        const role = resRoles.find(
                            (role) => role.title === answers.role
                        );
                        const query =
                            "UPDATE employee SET role_id = ? WHERE id = ?";
                        connection.query(
                            query,
                            [role.id, employee.id],
                            (err, res) => {
                                if (err) throw err;
                                console.log(
                                    `Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                                );
                                start();
                            }
                        );
                    });
            });
        });
    }

    function viewAllRoles() {
        const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary from roles join departments on roles.department_id = departments.id";
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    }

    function addRole() {
        const query = "SELECT * FROM departments";
        connection.query(query, (err, res) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "Enter the title of the new role:",
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "Enter the salary of the new role:",
                    },
                    {
                        type: "list",
                        name: "department",
                        message: "Select the department for the new role:",
                        choices: res.map(
                            (department) => department.department_name
                        ),
                    },
                ])
                .then((answers) => {
                    const department = res.find(
                        (department) => department.name === answers.department
                    );
                    const query = "INSERT INTO roles SET ?";
                    connection.query(
                        query,
                        {
                            title: answers.title,
                            salary: answers.salary,
                            department_id: department,
                        },
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                            );
                            start();
                        }
                    );
                });
        });
    }

    function viewAllDepartments() {
        const query = "SELECT * FROM departments";
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        });
    }
    
    function addDepartment() {
        inquirer
            .prompt({
                type: "input",
                name: "name",
                message: "Enter the name of the new department:",
            })
            .then((answer) => {
                console.log(answer.name);
                const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
                connection.query(query, (err, res) => {
                    if (err) throw err;
                    console.log(`Added department ${answer.name} to the database!`);
                    start();
                    console.log(answer.name);
                });
            });
    }
    
    function addManager() {
        const queryDepartments = "SELECT * FROM departments";
        const queryEmployees = "SELECT * FROM employee";
    
        connection.query(queryDepartments, (err, resDepartments) => {
            if (err) throw err;
            connection.query(queryEmployees, (err, resEmployees) => {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "department",
                            message: "Select the department:",
                            choices: resDepartments.map(
                                (department) => department.department_name
                            ),
                        },
                        {
                            type: "list",
                            name: "employee",
                            message: "Select the employee to add a manager to:",
                            choices: resEmployees.map(
                                (employee) =>
                                    `${employee.first_name} ${employee.last_name}`
                            ),
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Select the employee's manager:",
                            choices: resEmployees.map(
                                (employee) =>
                                    `${employee.first_name} ${employee.last_name}`
                            ),
                        },
                    ])
                    .then((answers) => {
                        const department = resDepartments.find(
                            (department) =>
                                department.department_name === answers.department
                        );
                        const employee = resEmployees.find(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}` ===
                                answers.employee
                        );
                        const manager = resEmployees.find(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}` ===
                                answers.manager
                        );
                        const query =
                            "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM roles WHERE department_id = ?)";
                        connection.query(
                            query,
                            [manager.id, employee.id, department.id],
                            (err, res) => {
                                if (err) throw err;
                                console.log(
                                    `Added manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.department_name}!`
                                );
                                start();
                            }
                        );
                    });
            });
        });
    }
    
    process.on("exit", () => {
        connection.end();
    });