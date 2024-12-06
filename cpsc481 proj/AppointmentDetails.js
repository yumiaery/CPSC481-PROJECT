document.addEventListener("DOMContentLoaded", () => {
  // Close the Appointment Details popup
  const closeButton = document.querySelector(".close-btn");
  closeButton.addEventListener("click", () => {
    window.parent.postMessage({ action: "close" }, "*");
  });

  // Populate details in the Appointment Details form
  const params = new URLSearchParams(window.location.search);
  populateFields(params);

  // Attach event listeners
  document.getElementById("edit-button").addEventListener("click", toggleEditMode);
  document.querySelector(".discard-changes").addEventListener("click", discardChanges);
  document.querySelector(".confirm-changes").addEventListener("click", confirmChanges);
});

// Populate form fields from URL params
function populateFields(params) {
  document.getElementById("patient-name").value = params.get("patient_name") || "N/A";
  document.getElementById("appointment-date").value = params.get("date") || "N/A";
  document.getElementById("start-time").value = params.get("time") || "N/A";
  document.getElementById("end-time").value = params.get("endTime") || "N/A";
  document.getElementById("doctor-name").value = params.get("doctor") || "N/A";
  document.getElementById("appointment-type").value = params.get("type") || "online"; // Default to 'online'
  document.getElementById("notes").value = params.get("notes") || "N/A";
}

let isEditing = false;

function toggleEditMode() {
  const editableFields = [
    document.getElementById("patient-name"),
    document.getElementById("appointment-type"),
    document.getElementById("notes"),
  ];

  const rescheduleButton = document.querySelector(".reschedule-btn");
  const cancelAppointmentButton = document.querySelector(".cancel-appointment-btn");
  const confirmChangesButton = document.querySelector(".confirm-changes");
  const discardChangesButton = document.querySelector(".discard-changes");

  isEditing = !isEditing;

  if (isEditing) {
    // Enable editing for fields
    editableFields.forEach((field) => {
      field.removeAttribute("readonly");
      field.classList.add("editable");
    });
    document.getElementById("appointment-type").removeAttribute("disabled");

    // Show edit buttons, hide default buttons
    toggleButtonVisibility(rescheduleButton, cancelAppointmentButton, false);
    toggleButtonVisibility(confirmChangesButton, discardChangesButton, true);
  } else {
    // Disable editing for fields
    editableFields.forEach((field) => {
      field.setAttribute("readonly", true);
      field.classList.remove("editable");
    });
    document.getElementById("appointment-type").setAttribute("disabled", true);

    // Show default buttons, hide edit buttons
    toggleButtonVisibility(rescheduleButton, cancelAppointmentButton, true);
    toggleButtonVisibility(confirmChangesButton, discardChangesButton, false);
  }
}

function discardChanges() {
  const params = new URLSearchParams(window.location.search);
  populateFields(params); // Reset fields to original state

  // Disable editing mode
  isEditing = false;
  toggleEditMode(); // Ensure fields and buttons revert correctly
}

function confirmChanges() {
  console.log("Changes confirmed!");
  isEditing = false;
  toggleEditMode(); // Exit edit mode
}

// Helper function to toggle button visibility
function toggleButtonVisibility(button1, button2, isVisible) {
  const displayValue = isVisible ? "inline-block" : "none";
  button1.style.display = displayValue;
  button2.style.display = displayValue;
}

// Open the Cancel Confirmation popup
function openCancelConfirmation() {
  const cancelPopup = document.getElementById("confirmCancellation");
  const overlay = document.querySelector(".popup-overlay");

  if (cancelPopup) cancelPopup.style.display = "block";
  if (overlay) overlay.style.display = "block";
}

// Close the Cancel Confirmation popup
function closeCancelConfirmation() {
  const cancelPopup = document.getElementById("confirmCancellation");
  const overlay = document.querySelector(".popup-overlay");

  if (cancelPopup) cancelPopup.style.display = "none";
  if (overlay) overlay.style.display = "none";
}

// Confirm cancellation (send DELETE request)
async function confirmCancel() {
  const params = new URLSearchParams(window.location.search);
  const appointmentId = params.get("id");

  if (!appointmentId) {
    console.error("Appointment ID is missing!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/appointments?id=${appointmentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the appointment.");
    }

    alert("Appointment canceled successfully.");
    window.parent.postMessage({ action: "refresh", success: true }, "*");

    closeCancelConfirmation();
    window.parent.postMessage({ action: "close" }, "*");
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    alert("Failed to cancel the appointment.");
  }
}


async function confirmChanges() {
  const params = new URLSearchParams(window.location.search);
  const appointmentId = params.get("id");

  if (!appointmentId) {
    console.error("Appointment ID is missing!");
    return;
  }

  const patientName = document.getElementById("patient-name").value;
  const appointmentType = document.getElementById("appointment-type").value;
  const notes = document.getElementById("notes").value;

  try {
    const response = await fetch("http://localhost:3000/appointments", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: appointmentId,
        patient_name: patientName,
        appointment_type: appointmentType,
        notes: notes,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update the appointment.");
    }

    alert("Appointment updated successfully.");
    // Notify parent to refresh the page
    window.parent.postMessage({ action: "refresh", success: true }, "*");

    // Close the popup
    window.parent.postMessage({ action: "close" }, "*");
    toggleEditMode(); // Exit edit mode after successful update
  } catch (error) {
    console.error("Error updating appointment:", error);
    alert("Failed to update the appointment.");
  }
}
