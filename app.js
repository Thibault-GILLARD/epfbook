const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");

//TP4 
const basicAuth = require("express-basic-auth");
//const bcrypt = require("bcrypt");


// TP3
const path = require('path');
// Enable EJS templates
app.set('views','./views'); // EJS set the path to the views
app.set('view engine', 'ejs');

// Enable Static Files loading
app.use(express.static("public"));

// Server configuration
// Enable JSON
app.use(express.json());
// Enable form requests
app.use(express.urlencoded({ extended: true })); // extended: true allows to parse nested objects

// Setup basic authentication
app.use(
  basicAuth({

    challenge: true,
  })
);

// basic data to send to the client 
const student_data = [
  { name: "Eric Burel", school: "LBKE" },
  { name: "Harry Potter", school: "Poudlard" },
];

const getStudentsFromCsvfile = (cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    return cb(null, students);
  });
};

const storeStudentInCsvFile = (student, cb) => {
  const csvLine = `\n${student.name},${student.school}`;
  // Temporary log to check if our value is correct
  // in the future, you might want to enable Node debugging
  // https://code.visualstudio.com/docs/nodejs/nodejs-debugging
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "a" }, (err) => {
    cb(err, "ok");
  });
};

// Method to send data to the client with a GET request
app.get('/', (req, res) => {
  res.send('Hello World! 3')
});

// Serving some HTML as a file
// __dirname is the path to the current directory
// path.join is a method to concatenate paths
app.get("/tp3", (req, res) => {
  res.sendFile(path.join(__dirname + "/views/home.html"));
});


app.get('/api/students', (req, res) => {
  res.send(student_data);
  console.log(student_data); // log the data to the console
});

app.get("/csv_students", (req, res) => {
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    res.send(data);
    console.log(data);
  });
});

console.log(student_data); // log the data to the console

/* 
// Bonus: how to parse a CSV file
app.get("/csv_students_bonus", (req, res) => {
  // rowSeparator is the character that separates rows
  const rowSeparator = "\n";
  // cellSeparator is the character that separates cells
  const cellSeparator = ",";
  fs.readFile("./students.csv", "utf8", (err, data) => {
    // split the data into rows
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);
    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.send(students);
  });
}); */
// JSON API
app.get("/api/students", (req, res) => {
  getStudentsFromCsvfile((err, students) => {
    res.send(students);
  });
});

app.post("/api/students/create", (req, res) => {
  console.log(req.body); // log the data to the console
  const csvLine = `\n${req.body.name},${req.body.school}`;  // create a new line in the CSV file
  console.log(csvLine); 
  const stream = fs.writeFile(
    "./students.csv",
    csvLine,
    { flag: "a" } // removed the extra parenthesis here
  );
});

// Student create form
app.get("/students/create", (req, res) => { // create a new GET endpoint /students/create
  res.render("create-student"); // render the view
});

// Form handlers
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.redirect("/students/create?error=1");
    } else {
      res.redirect("/students/create?created=1");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

//Create a new GET endpoint /students that serves this view: res.render("students")
/*
app.get("/students", (req, res) => {
  res.render("students");
});
*/

app.get('/students', function(req, res) {
  res.render('students', { students: student_data });
});



