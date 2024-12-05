const express = require("express");
const mysql = require('mysql2');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root", 
  database: "cpsc_481",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// Routes
app.post("/appointments", (req, res) => {
  const { patient_name, appointment_date, start_time, end_time, doctor_name, notes, appointment_type } = req.body;

  const sql = "INSERT INTO appointments (patient_name, appointment_date, start_time, end_time, doctor_name, notes, appointment_type) VALUES (?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [patient_name, appointment_date, start_time, end_time, doctor_name, notes, appointment_type],
    (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        res.status(500).send("Error saving appointment.");
      } else {
        res.send({ success: true, id: result.insertId });
      }
    }
  );
});

app.get("/appointments", (req, res) => {
  const { date } = req.query;

  const sql = "SELECT * FROM appointments WHERE appointment_date = ?";
  db.query(sql, [date], (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).send("Error retrieving appointments.");
    } else {
      res.send(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
