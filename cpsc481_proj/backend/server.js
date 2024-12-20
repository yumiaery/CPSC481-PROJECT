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
  host: "cpsc-481-db.crm6gmu4mtkq.us-west-2.rds.amazonaws.com",
  user: "admin",
  password: "cpsc481_2024", 
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
  const { patient_name, appointment_date, start_time, end_time, doctor_name, notes, appointment_type} = req.body;

  const sql = "INSERT INTO appointments (patient_name, appointment_date, start_time, end_time, doctor_name, notes, appointment_type, status_) VALUES (?, ?, ?, ?, ?, ?, ?, NULL)";
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
  const { date, doctor } = req.query;
  const params = [date];

  let sql = "SELECT * FROM appointments WHERE appointment_date = ?";
  if (doctor) {
    sql += " AND doctor_name = ?";
    params.push(doctor);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching appointments:", err);
      res.status(500).send("Error fetching appointments");
    } else {
      res.send(results);
    }
  });
});



// Retrieve a single appointment by ID ofr appointment detail
app.get("/appointment", (req, res) => {
  const { id } = req.query;

  const sql = "SELECT * FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching appointment details:", err);
      res.status(500).send("Error retrieving appointment details.");
    } else if (result.length === 0) {
      res.status(404).send("Appointment not found.");
    } else {
      res.send(result[0]); // Return the first (and only) result
    }
  });
});



//retrieve appointment for weely view
app.get("/appointmentsWeekly", (req, res) => {
  const { start_date, end_date, doctor } = req.query;

  let sql = `
    SELECT * FROM appointments 
    WHERE appointment_date BETWEEN ? AND ?
  `;
  const params = [start_date, end_date];

  if (doctor) {
    sql += " AND doctor_name = ?";
    params.push(doctor);
  }

  db.query(sql, params, (err, results) => {
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

function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0).toISOString().split("T")[0]; // Last day of the month
}

app.get("/appointmentsMonthly", (req, res) => {
  const { month, year, doctor } = req.query;

  // Convert month name and year to start and end dates
  const monthIndex = new Date(`${month} 1, ${year}`).getMonth(); // 0-based month index
  const startDate = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  const endDate = getLastDayOfMonth(year, monthIndex);

  // Base SQL query
  let sql = `
    SELECT * FROM appointments 
    WHERE appointment_date >= ? AND appointment_date <= ?
  `;
  const params = [startDate, endDate];

  // Add doctor filter if specified
  if (doctor) {
    sql += " AND doctor_name = ?";
    params.push(doctor);
  }

  // Execute the query
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching monthly appointments:", err);
      res.status(500).send("Error retrieving monthly appointments.");
    } else {
      res.send(results);
    }
  });
});




app.delete("/appointments", (req, res) => {
  const { id } = req.query;

  if (!id) {
    res.status(400).send("Appointment ID is required.");
    return;
  }

  const sql = "DELETE FROM appointments WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting appointment:", err);
      res.status(500).send("Error deleting appointment.");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Appointment not found.");
    } else {
      res.send({ success: true });
    }
  });
});



//update from eidtable fields in deets page
app.put("/appointments", (req, res) => {
  const { id, patient_name, appointment_type, notes, status_ } = req.body;

  if (!id) {
    res.status(400).send("Appointment ID is required.");
    return;
  }

  const sql = `
    UPDATE appointments 
    SET patient_name = ?, appointment_type = ?, notes = ?, status_ = ? 
    WHERE id = ?
  `;

  db.query(sql, [patient_name, appointment_type, notes, status_, id], (err, result) => {
    if (err) {
      console.error("Error updating appointment:", err);
      res.status(500).send("Error updating appointment.");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Appointment not found.");
    } else {
      res.send({ success: true });
    }
  });
});

//update from eidtable fields in deets page
app.put("/appointments_reschedule", (req, res) => {
  const { id, appointment_date, start_time, end_time} = req.body;
  if (!id) {
    res.status(400).send("Appointment ID is required.");
    return;
  }

  const sql = `
    UPDATE appointments 
    SET appointment_date = ?, start_time = ?, end_time = ? 
    WHERE id = ?
  `;

  db.query(sql, [appointment_date, start_time, end_time, id], (err, result) => {
    if (err) {
      console.error("Error rescheduling appointment:", err);
      res.status(500).send("Error rescheduling appointment.");
    } else if (result.affectedRows === 0) {
      res.status(404).send("Appointment not found.");
    } else {
      res.send({ success: true });
    }
  });
});




// Start server
app.listen(port, () => {
  console.log(`Server running on http://44.243.40.96:${port}`);
});
