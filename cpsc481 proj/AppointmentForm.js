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
    document.getElementById("appointment-date").value = new Date(appointmentDate).toLocaleDateString("en-US", {
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

