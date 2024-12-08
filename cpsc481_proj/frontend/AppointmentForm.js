// Parse query parameters
const params = new URLSearchParams(window.location.search);
const date = params.get("date");
const time = params.get("time");
const endTime = params.get("endTime");
const appointment = params.get("appointment");

// Populate the form fields
document.getElementById("appointment-date").value = date || "";
document.getElementById("start-time").value = time || "";
document.getElementById("end-time").value = endTime || ""; // Add this line

function formatTime(inputTime) {
  const date = new Date(`1970-01-01T${inputTime}`);
  return date.toTimeString().split(" ")[0]; // 'HH:MM:SS'
}

if (appointment) {
  try {
    const appointmentData = JSON.parse(decodeURIComponent(appointment));
    document.getElementById("patient-name").value = appointmentData.name || "";
    document.getElementById("notes").value = appointmentData.notes || "";
  } catch (error) {
    console.error("Error parsing appointment data:", error);
  }
}

function resetFormFields() {
    const patientNameField = document.querySelector("#patient-name");
    const notesField = document.querySelector("#notes");
    const appointmentTypeField = document.querySelector("#appointment-type");
  
    // Reset fields to their default values
    if (patientNameField) patientNameField.value = ""; // Clear the patient name
    if (notesField) notesField.value = ""; // Clear the notes
    if (appointmentTypeField) appointmentTypeField.value = "online"; // Set default to "online"
  }

// Function to send a message to the parent window to close the popup
function closePopup() {
    resetFormFields();
    window.parent.postMessage({ action: "close" }, "*");
}

// Attach the cancel button click event
document.querySelector(".cancel-btn").addEventListener("click", closePopup);

// Close the form
document.querySelector(".close-btn").addEventListener("click", () => {
  window.parent.postMessage({ action: "close" }, "*");
});

document.addEventListener("DOMContentLoaded", () => {
  // Extract query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const doctorName = urlParams.get("doctor");
  const appointmentDate = urlParams.get("date");
  const startTime = urlParams.get("time");
  const endTime = urlParams.get("endTime");

  // Populate fields in the form
  if (doctorName) {
    document.getElementById("doctor-name").value = doctorName;
  }
  if (appointmentDate) {
    const adjustedDate = new Date(appointmentDate);
    adjustedDate.setDate(adjustedDate.getDate() + 1); // Add 1 day to correct the offset
    document.getElementById("appointment-date").value = adjustedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
  }
  if (startTime) {
    document.getElementById("start-time").value = startTime;
  }
  if (endTime) {
    document.getElementById("end-time").value = endTime;
  }

  // Close button functionality
  document.querySelector(".close-btn").addEventListener("click", () => {
    window.parent.postMessage({ action: "close" }, "*");
  });
});



// saving a appointment.
document.querySelector(".confirm-btn").addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission

  // Gather data from the form
  const patientName = document.getElementById("patient-name").value;
  const appointmentDate = document.getElementById("appointment-date").value;
  const startTime = document.getElementById("start-time").value;
  const endTime = document.getElementById("end-time").value;
  const doctorName = document.getElementById("doctor-name").value;
  const notes = document.getElementById("notes").value;
  const appointmentType = document.getElementById("appointment-type").value;
  console.log(patientName)

  // Send the appointment data to the backend
  fetch("http://44.243.40.96:3000/appointments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patient_name: patientName,
      appointment_date: new Date(appointmentDate).toISOString().split("T")[0],
      start_time: startTime,
      end_time: endTime,
      doctor_name: doctorName,
      notes: notes,
      appointment_type: appointmentType,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Appointment saved successfully!");
        window.parent.postMessage({ action: "close" }, "*"); // Close the form
        // Notify the parent window to refresh the view
      window.parent.postMessage({ action: "refresh", success: true }, "*");
      } else {
        alert("Failed to save appointment.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while saving the appointment.");
    });
});
