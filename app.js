const express = require('express')
const app = express()
const port = 3000
const fs = require("fs");

// basic data to send to the client 
const student_data = [
  { name: "Eric Burel", school: "LBKE" },
  { name: "Harry Potter", school: "Poudlard" },
];

// Method to send data to the client with a GET request
app.get('/', (req, res) => {
  res.send('Hello World! 2')
});


app.get('/students', (req, res) => {
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
});


app.post("/students/create", (req, res) => {
  console.log(req.body);
  const csvLine = `\n${req.body.name},${req.body.school}`;
  console.log(csvLine);
  const stream = fs.writeFile(
    "./students.csv",
    csvLine,
    { flag: "a" },
  );
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





/* 
const express = require("express");
const app = express();
const port = 3000;
// https://nodejs.org/api/fs.html
const fs = require("fs");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/students", (req, res) => {
  // basic example: we send hard-coded data
  res.send([
    { name: "Eric Burel", school: "LBKE" },
    { name: "You", school: "EPF" },
    { name: "Harry Potter", school: "Poudlard" },
  ]);
});

app.get("/students-csv", (req, res) => {
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    res.send(data);
  });
});

// In this version, we parse the CSV content
app.get("/students-csv-parsed", (req, res) => {
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
    res.send(students);
  });
});

app.use(express.json());
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const csvLine = `\n${req.body.name},${req.body.school}`;
  console.log(csvLine);
  const stream = fs.writeFile(
    "./students.csv",
    csvLine,
    { flag: "a" },
    (err) => {
      res.send("ok");
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
 */