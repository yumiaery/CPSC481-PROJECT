// Global array to store appointments
const appointments = [];

// Function to add an appointment
function addAppointment(appointment) {
  appointments.push(appointment);
  console.log("Appointment added:", appointment);
}

// Function to get appointments for a specific date
function getAppointmentsForDate(date) {
  return appointments.filter(app => app.date === date);
}

// Function to get appointments for a specific week
function getAppointmentsForWeek(startDate) {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // End of the week

  return appointments.filter(app => {
    const appDate = new Date(app.date);
    return appDate >= start && appDate <= end;
  });
}

// Function to get appointments for a specific month
function getAppointmentsForMonth(month, year) {
  return appointments.filter(app => {
    const [appYear, appMonth] = app.date.split("-");
    return parseInt(appYear) === year && parseInt(appMonth) === month;
  });
}

// Event listener for appointment form submissions
function setupAppointmentListener() {
  window.addEventListener("message", (event) => {
    if (event.data.action === "addAppointment") {
      addAppointment(event.data.data);

      // Notify all views to refresh their appointments
      const views = ["daily.html", "weekly.html", "monthly.html"];
      views.forEach(view => {
        if (window.location.href.includes(view)) {
          renderAppointments();
        }
      });
    }
  });
}

// Expose the functions for importing
export {
  addAppointment,
  getAppointmentsForDate,
  getAppointmentsForWeek,
  getAppointmentsForMonth,
  setupAppointmentListener
};
