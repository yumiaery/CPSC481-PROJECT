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

//retrieve appointments for daily view
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

//retrieve appointment for weely view
app.get("/appointmentsWeekly", (req, res) => {
  const { start_date, end_date } = req.query;

  const sql = "SELECT * FROM appointments WHERE appointment_date BETWEEN ? AND ?";
  db.query(sql, [start_date, end_date], (err, results) => {
    if (err) {
      console.error("Error fetching weekly appointments:", err);
      res.status(500).send("Error retrieving weekly appointments.");
    } else {
      res.send(results);
    }
  });
});

//retrieve appointments for monthly view
const monthMap = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

app.get("/appointmentsMonthly", (req, res) => {
  const { month, year } = req.query;

  console.log("Month:", month, "Year:", year);

  // Get the numerical representation of the month
  const monthNumber = monthMap[month];

  // Calculate start and end dates
  const startDate = `${year}-${monthNumber}-01`;
  const endDate = `${year}-${monthNumber}-31`; // Handles all months (SQL will correct overflows)

  console.log("Start Date:", startDate, "End Date:", endDate);
  
  // SQL Query for date range
  const sql = "SELECT * FROM appointments WHERE appointment_date >= ? AND appointment_date <= ?";
  db.query(sql, [startDate, endDate], (err, results) => {
    if (err) {
      console.error("Error fetching monthly appointments:", err);
      res.status(500).send("Error retrieving monthly appointments.");
    } else {
      res.send(results);
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
