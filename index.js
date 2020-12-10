
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    port: 3306,
  
    user: "root",
    
    password: "",
    database: "employee_db"
});

  


function update(response) {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employees", function(err, results) {
      if (err) throw err;
    
    
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "list",
            message: "Which employee would you like to update?",            
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name + " " + results[i].last_name);
              }
              return choiceArray;
            }
        }
        ]).then(function(response){
            rolePick(response)
        })
    })
    
};


function rolePick (response){
    connection.query("SELECT * FROM roles", function(err, results) {
        if (err) throw err;
      
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
          .prompt([
            {
            name: "newRole",
            type: "list",
            message: "What role will they have?",            
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].title);
              }
              return choiceArray;
            }
            }    
        ]).then(function(res2){
            updateRole(response,res2);

        }) 
    })
};


function updateRole(response, res2) {
    const firstName = response.choice.split(" ")
    connection.query("SELECT * FROM roles", function(err, results) {
        if (err) throw err;
        for(let i = 0; i < results.length; i++){
            if(res2.newRole == results[i].title){
                connection.query(
                    "UPDATE employees SET ? WHERE ?",
                    [
                      {
                        role_id: results[i].id
                      },
                      {
                          first_name: firstName[0]
                      }
                    ],
                    function(err, res) {
                      if (err) throw err;
                      console.log("\n Role updated! \n")
                      start();
                    }
                    
                )
            }
        }
    });
    
};


function addEmployee() {
    connection.query("SELECT * FROM roles", function(err, results) {
    // prompt for info about the item being put up for auction
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is this employee's first name?"
        },
        {
          name: "lastName",
          type: "input",
          message: "What is this employee's last name?"
        },
        {
        name: "newRole",
        type: "list",
        message: "What role will they have?",            
        choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].title);
              }
            return choiceArray;
            }
        },
        {
          name: "manager",
          type: "input",
          message: "What is their manager's id?"
        }
      ])
      .then(function(response) {
        insertEmployee(response);
          
        
      });
    });
};


function insertEmployee(response){
  console.log("Adding a new employee...\n");
  connection.query("SELECT * FROM roles", function(err, results) {
    if (err) throw err;
    for(let i = 0; i < results.length; i++){
      if(response.newRole == results[i].title){
        connection.query(
          "INSERT INTO employees SET ?",
          {
            first_name: response.firstName,
            last_name: response.lastName,
            role_id: results[i].id,
            manager_id: response.manager
          },
          function(err, res) {
            if (err) throw err;
            console.log( "\n Employee added!\n");
            start();
          }
        );
      }
    }
  })
};


function addDepartment() {
  
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What will the name of this department be?"
      }
    ])
    .then(function(response) {
      insertDepartment(response);
        
      
    });
};


function insertDepartment(response){
  console.log("Adding a new department...\n");
  connection.query(
    "INSERT INTO departments SET ?",
    {
      name: response.name,
    },
    function(err, res) {
      if (err) throw err;
      console.log( "\nDepartment added!\n");
      start();
    }
  );
}




function addRole() {
  connection.query("SELECT * FROM departments", function(err, results) {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the name of this role?"
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of this role (please enter a number)?"
      },
      {
      name: "department",
      type: "list",
      message: "What department will this role be in?",            
      choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].name);
            }
          return choiceArray;
          }
      }
    ])
    .then(function(response) {
      insertRole(response);
      
      
    });
  });
};
function insertRole(response){
  console.log("Adding a new role...\n");
  connection.query("SELECT * FROM departments", function(err, results) {
      if (err) throw err;
      for(let i = 0; i < results.length; i++){
          if(response.department == results[i].name){
  connection.query(
    "INSERT INTO roles SET ?",
    {
      title: response.title,
      salary: response.salary,
      department_id: results[i].id,
    },
    function(err, res) {
      if (err) throw err;
      console.log( "\nRole added!\n");
      start();
    }
  );  
  }}
})
};

function viewEmployees(){
  connection.query("SELECT * FROM employees",  function(err, results){
    console.table(results);
    start();
  })
}
function viewDepartments(){
  connection.query("SELECT * FROM departments",  function(err, results){
    console.table(results);
    start();
  })
}
function viewRoles(){
  connection.query("SELECT * FROM roles",  function(err, results){
    console.table(results);
    start();
  })
}


function viewTotalUtil(){
  connection.query("SELECT * FROM departments", function(err, results) {
    inquirer
    .prompt([
    {
      name: "department",
      type: "list",
      message: "Which department's total utilized budget do you want to view?",            
      choices: function() {
          var choiceArray = [];
          for (var i = 0; i < results.length; i++) {
            choiceArray.push(results[i].name);
            }
          return choiceArray;
          }
      }
    ])
    .then(function(response) {
        if (err) throw err;
        const tarDep = []
        for(let i = 0; i < results.length; i++){
          if(response.department == results[i].name){
            tarDep.push(results[i].id);
          }
        }
        connection.query("SELECT * FROM roles", function(err, res) {
          let sum = 0
          for(let j = 0; j < res.length; j++){
            if(res[j].department_id === tarDep[0]){
              sum +=res[j].salary;
              
            }
          }
          console.log("\nThis department has a total utilized budget of: \n $" +sum+ "\n")
          start();
        });
      })
  })
};


function deleteEnt(){
  inquirer
  .prompt([
    {
    name: "which",
    type: "list",
    message:"Would you like to delete an employee, role, or department?",
    choices:["Employee", "Role", "Department"]
    }
  ]).then(function(response){
    if(response.which == "Employee"){
      deleteEmployee();
    }
    else if(response.which == "Role"){
      deleteRole();
    }
    else if(response.which == "Department"){
      deleteDepartment();
    }
  })
  
};


function deleteDepartment(){
  connection.query("SELECT * FROM departments", function(err, results){
    if(err) throw err
    inquirer
    .prompt([
      {
      name: "which",
      type: "list",
      message:"Which department would you like to delete?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].name);
          }
        return choiceArray;
        }
      }
    ]).then(function(response){
      for(let j = 0; j < results.length; j++){
        if(results[j].name == response.which ){
          connection.query("DELETE FROM departments WHERE id = " + results[j].id, function(err, res) {
            if(err) throw err;
            console.log("\n Department successfully deleted! \n")
            start();
      })
      }
    }
    })
  })
};


function deleteRole(){
  connection.query("SELECT * FROM roles", function(err, results){
    if(err) throw err
    inquirer
    .prompt([
      {
      name: "which",
      type: "list",
      message:"Which role would you like to delete?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].title);
          }
        return choiceArray;
        }
      }
    ]).then(function(response){
      for(let j = 0; j < results.length; j++){
        if(results[j].title == response.which ){
          connection.query("DELETE FROM roles WHERE id = " + results[j].id, function(err, res) {
            if(err) throw err;
            console.log("\nRole successfully deleted!\n")
            start();
      })
      }
    }
    })
  })
};


function deleteEmployee(){
  connection.query("SELECT * FROM employees", function(err, results){
    if(err) throw err
    inquirer
    .prompt([
      {
      name: "which",
      type: "list",
      message:"Which employee would you like to delete?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].first_name + " " + results[i].last_name);
          }
        return choiceArray;
        }
      }
    ]).then(function(response){
      for(let j = 0; j < results.length; j++){
        if(results[j].first_name + " " + results[j].last_name == response.which ){
          connection.query("DELETE FROM employees WHERE id = " + results[j].id, function(err, res) {
            if(err) throw err;
            console.log("\nEmployee successfully deleted!\n")
            start();
      })
      }
    }
    })
  })
};




function end(){
  connection.end();
}

function start(){
inquirer
.prompt([
  {
    name:"init",
    type: "list",
    message:"What would you like to do?",
    choices: ["View employees", "View roles", "View departments", "Update an employee's role", "Add employee", "Add role", "Add department", "View total utilized budget of a department","Delete an entity", "EXIT"]
  }
]).then(function(response){
  if(response.init == "View employees"){
    viewEmployees();
  }
  else if(response.init == "View roles"){
    viewRoles();
  }
  else if(response.init == "View departments"){
    viewDepartments();
  }
  else if(response.init == "Update an employee's role"){
    update();
  }
  else if(response.init == "Add employee"){
    addEmployee();
  }
  else if(response.init == "Add role"){
    addRole();
  }
  else if(response.init == "Add department"){
    addDepartment();
  }
  else if(response.init == "View total utilized budget of a department"){
    viewTotalUtil();
  }
  else if(response.init == "Delete an entity"){
    deleteEnt();
  }
  else if(response.init == "EXIT"){
    end();
  }
})
}
connection.connect(function(err) {
  if (err) throw err;
  start();
});