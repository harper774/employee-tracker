var mysql = require("mysql");
var inquirer = require("inquirer");
const { promisify } = require("util");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "twj521604",
    database: "EmployeeDB"
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

function start() {
    inquirer
        .prompt({
            name: "Home",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Role",
                "View All Department",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Remove Employee",
                "Update Employee Role",
                "Update Role"]
        })
        .then(function (answer) {
            switch (answer.Home) {
                case "View All Employees":
                    Allemp();
                    
                    break;

                case "View All Role":
                    Allrole();
                    
                    break;

                case "View All Department":
                    Alldep();
                    
                    break;

                case "Add Employee":
                    Add_name();
                    //Add_a_manager();
                    break;

                case "Add Role":
                    Add_role();
                    break;

                case "Add Department":
                    Add_dep();
                    
                    break;

                case "Remove Employee":
                    Remove_emp();
                    break;

                case "Update Employee Role":
                    Update_empRole();
                    break;

                case "Update Role":
                    Update_Role();
                    
                    break;
            }
        });
}

function Allemp() {
    console.log("Selecting all employees...\n");
    connection.query("SELECT * FROM employees", function (err, res) {
        if (err) throw err;
        //console.log(res);
        console.table(res);

        start();
        
    });
}

function Allrole() {
    console.log("Selecting all roles...\n");
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        //console.log(res);
        console.table(res);
        start();
    });
}

function Alldep() {
    console.log("Selecting all departments...\n");
    connection.query("SELECT * FROM departments", function (err, res) {
        if (err) throw err;
        //console.log(res);
        console.table(res);
        start();
    });
}

function GetManagers() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employees", function (err, managerArray) {
            var managers = [];
            if (managerArray) {
                for (var i = 0; i < managerArray.length; i++) {
                    // managers.push(managerArray[i].first_name+ " "+ managerArray[i].last_name)
                    managers.push({
                        name: managerArray[i].first_name+ " " + managerArray[i].last_name,
                        value: managerArray[i].id
                    });
                }
            }
            if(err){
                reject(err)
            }else{
                resolve(managers);
                //console.log(managers);
            }
        });
    })
    
}


function Add_name() {
    connection.query("SELECT * FROM roles", function (err, results) {
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message: "What's the employee's first name?"
                },
                {
                    name: "last_name",
                    type: "input",
                    message: "What's the employee's last name?"
                },
                {
                    name: "roles",
                    type: "rawlist",
                    choices: function () {
                        var roleArray = [];
                        for (var i = 0; i < results.length; i++) {
                            roleArray.push(results[i].title);
                        }
                        return roleArray;
                    },
                    message: "What's the employee's role?"
                },
                
                // {
                //     name: "manager",
                //     type: "rawlist",
                //     choices: async function () {
                //         let managerArray = await GetManagers();
                //         var a = [];
                //         //console.log(managerArray);
                //         if(managerArray = a){
                //             console.log("heel")
                //             return a;
                    
                //         }
                //         else{
                //             return managerArray;
                //         }
                                             
                //     },
                //     message: "Which manager of this employee?"

                // }

            ])
            .then(async function (answer) {
                // let b = await GetManagers();
                
                console.log("111");
                console.log(GetManagers());
                let b = await GetManagers();
                //console.log(managerArray);
                if(b.length === 0){
                    console.log("222");
                    connection.query("SELECT id FROM roles WHERE title = ?", answer.roles, function(err, data){
                        connection.query(
                            "INSERT INTO employees SET ?",
                            {
                                first_name: answer.first_name,
                                last_name: answer.last_name,
                                role_id: data[0].id,
                                manager_id: 0
                                
                            }, Allemp,
                            function (err, res) {
                                console.log(res);
                                start();
                            }
                        );        
                    })
                                               
                }
                else{
                    inquirer
                        .prompt([
                            {
                                name: "manager",
                                type: "rawlist",
                                choices: async function () {
                                    let managerArray = await GetManagers();
                                    return managerArray;
                                },
                                message: "Which manager of this employee?"
                            }
                        ])
                        .then(function(answer){
                            connection.query(
                                "INSERT INTO employees SET ?",
                                {
                                    first_name: answer.first_name,
                                    last_name: answer.last_name,
                                    role_id: data[0].id,
                                    manager_id: answer.manager
                                    
                                }, Allemp,
                                function (err, res) {
                                    console.log(res);
                                    start();
                                }
                            );
                        })
                }                                 


                // console.log(answer.roles);
                // connection.query("Select id from roles where title = ?", answer.roles, function (err, data) {
                //     //console.log(data[0].id);
                //     console.log("hhh");
                //     console.log(answer.manager);
                //     var b = [];
                //     if(answer.manager = b){
                //         onnection.query(
                //             "INSERT INTO employees SET ?",
                //             {
                //                 first_name: answer.first_name,
                //                 last_name: answer.last_name,
                //                 role_id: data[0].id,
                //                 manager_id: 0
                                
                //             }, Allemp,
                //             function (err, res) {
                //                 console.log(res);
                //                 start();
                //             }
                //         ); 
                //     }else{
                //         connection.query(
                //             "INSERT INTO employees SET ?",
                //             {
                //                 first_name: answer.first_name,
                //                 last_name: answer.last_name,
                //                 role_id: data[0].id,
                //                 manager_id: answer.manager
                                
                //             }, Allemp,
                //             function (err, res) {
                //                 console.log(res);
                //                 start();
                //             }
                //         );
                //     }
                    // console.log(data);
                    // connection.query(
                    //     "INSERT INTO employees SET ?",
                    //     {
                    //         first_name: answer.first_name,
                    //         last_name: answer.last_name,
                    //         role_id: data[0].id,
                    //         manager_id: answer.manager
                            
                    //     }, Allemp,
                    //     function (err, res) {
                    //         console.log(res);
                    //         start();
                    //     }
                    // );
                // })

            });
    });
}

function Add_role() {
    connection.query("SELECT * FROM departments", function (err, results) {
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What's the title of the role?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What's the salary of the role?"
                },
                {
                    name: "departments",
                    type: "rawlist",
                    choices: function () {
                        var departArray = [];
                        for (var i = 0; i < results.length; i++) {
                            departArray.push(results[i].name);
                        }
                        return departArray;
                    },
                    message: "Which department of this role?"
                }
            ])
            .then(function (answer) {
                connection.query(
                    "SELECT id FROM departments WHERE name = ?", answer.departments, function(err,data){
                        console.log(data[0].id);
                        connection.query(
                            "INSERT INTO roles SET ?",
                        {
                            title: answer.title,
                            department_id: data[0].id,
                            salary: answer.salary
                        },
                        Allrole,
                        
                        );
                        start();
                        
                    }
                );
                
                
            });
              
    });
    
}


function Add_dep() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What's the departement's name?"
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    name: answer.name
                },
                Alldep,
                function (err, res) {
                    if (err) throw err;
                    console.log(answer.name + " department inserted!\n");
                    
                }
            );
            start();
        });
}
function Getemployees(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employees", function (err, empArray) {
            var employees = [];
            if (empArray) {
                for (var i = 0; i < empArray.length; i++) {
                    employees.push(
                        {
                            name: empArray[i].first_name+ " "+ empArray[i].last_name,
                            value: empArray[i].id
                        }
                    )              
                }
                if(err){
                    reject(err)
                }else{
                    resolve(employees);
                    console.log(employees);
                }
            };
        })
    });
}

function Remove_emp() {
    connection.query("SELECT * FROM employees", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: async function () {
                        let choiceArray2 = await Getemployees();

                        return choiceArray2;
                    },
                    message: "Which employee do you want to remove?"
                }
            ])
            .then(function (answer) {
                console.log("Deleting a employee...\n");
                console.log(answer.choice);
                connection.query(
                    "DELETE FROM employees WHERE ?",
                    {
                        id: answer.choice
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(res);
                        console.log(answer.choice.name + " employee deleted!\n");
                    },
                    Allemp,
                    start()
                )    
            });
            
    })
}

function Getemp_id(){
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employees", function (err, managerArray) {
            var managers = [];
            if (managerArray) {
                for (var i = 0; i < managerArray.length; i++) {
                    // managers.push(managerArray[i].first_name+ " "+ managerArray[i].last_name)
                    managers.push({
                        name: managerArray[i].first_name+ " " + managerArray[i].last_name,
                        value: managerArray[i].id
                    });
                }
            }
            if(err){
                reject(err)
            }else{
                resolve(managers);
            }
        });
    })
}

function Update_empRole(){
    connection.query("SELECT * FROM roles", function(err,results){
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: async function(){
                        let empArray = await Getemp_id();
                        return empArray;
                    },
                    message: "Which employee's would you like to update?"
                },
                {
                    name: "roles",
                    type: "rawlist",
                    choices: function(){
                        var emproleArray = [];
                        for (var i = 0; i < results.length; i++){
                            emproleArray.push(results[i].title);
                        }
                        return emproleArray;
                    },
                    message: "Which role would you like to update?"
                }
            ])
            .then(function(answer){
                connection.query("SELECT id FROM roles WHERE title = ?", answer.roles, function(err,data){
                    connection.query(
                        "UPDATE employees SET ? WHERE ?",
                        [
                            {
                                role_id: data[0].id
                            },
                            {
                                id: answer.choice
                            },
                            Allemp,
                        ]
                    )
                    start();
                })
            })
    })
}

function Update_Role(){
    connection.query("SELECT * FROM roles", function(){
        inquirer
            .prompt([
                {
                    name: "Updateroles",
                    type: "rawlist",
                    choices: ["title", "salary", "department"]                        
                }
            ])
            .then(function(answer){
                if(answer.Updateroles === "title"){
                    changetitle();
                }
                else if(answer.Updateroles === "salary"){
                    changesalary();
                }
                else if (answer.Updateroles === "department"){
                    changedepartment();
                }
            });
        })
    
}

function changetitle(){
    connection.query("SELECT * FROM roles", function(err,results){
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "rawlist",
                    choices: function(){
                        var titleArray=[];
                        for (var i =0; i < results.length; i++){
                            titleArray.push(results[i].title);
                        }
                        return titleArray;
                    },
                    message: "Which title would you like to update?"
                },
                {
                    name: "newtitle",
                    type: "input",
                    message: "What title would you like to update?"
                }
            ])
            .then(function(answer){
                connection.query(
                    "SELECT id FROM roles WHERE title = ?", answer.title, function(err,data){
                        console.log(data[0].id);
                        connection.query(
                            "UPDATE roles SET ? WHERE ?",
                            [
                                {
                                    title: answer.newtitle
                                },
                                {
                                    id: data[0].id
                                },
                                Allrole,
                            ]                           
                        )
                        start();
                    }
                )
            })
    })
}

function changesalary (){
    connection.query("SELECT * FROM roles", function(err,results){
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "rawlist",
                    choices: function(){
                        var titleArray=[];
                        for (var i =0; i < results.length; i++){
                            titleArray.push(results[i].title);
                        }
                        return titleArray;
                    },
                    message: "Which title's salary would you like to update?"
                },
                {
                    name: "newsalary",
                    type: "input",
                    message: "What salary would you like to update?"
                }
            ])
            .then(function(answer){
                connection.query(
                    "SELECT id FROM roles WHERE title = ?", answer.title, function(err,data){
                        console.log(data[0].id);
                        connection.query(
                            "UPDATE roles SET ? WHERE ?",
                            [
                                {
                                    salary: answer.newsalary
                                },
                                {
                                    id: data[0].id
                                } 
                            ],                           
                            Allrole,
                        )
                        start();
                    }
                )
            })
    })
}
function Getdepartments(){
    return new Promise((reslove, reject) =>{
        connection.query("SELECT * FROM departments", function(err,departArray){
            var depart = [];
            if(departArray){
                for (var i = 0; i < departArray.length; i++){
                    depart.push(departArray[i].name)
                }
            }
            if(err){
                reject(err)
            }
            else{
                reslove(depart);
            }
        })
    })
}

function changedepartment(){
    connection.query("SELECT * FROM roles", function(err,results){
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "rawlist",
                    choices: function(){
                        var titleArray=[];
                        for (var i =0; i < results.length; i++){
                            titleArray.push(results[i].title);
                        }
                        return titleArray;
                    },
                    message: "Which title's department would you like to update?"
                },
                {
                    name: "newdepart",
                    type: "rawlist",
                    choices: async function(){
                        let departArray = await Getdepartments();
                        return departArray;
                    },
                    message: "Which department would you like to update?"
                }
            ])
            .then(function(answer){
                connection.query(
                    "SELECT id FROM departments WHERE name = ?", answer.newdepart, function(err,data){
                        console.log(data[0].id);
                        connection.query(
                            "UPDATE roles SET ? WHERE ?",
                            [
                                {
                                    department_id: data[0].id
                                },
                                {
                                    title: answer.title
                                },
                                Allrole,
                            ]                           
                        )
                        start();
                    }
                )
            });
            
    })
}

