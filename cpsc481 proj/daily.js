let selectedDoctor = ""; // Default: show all doctors

let appointmentFormClickEnabled = true; // Allow click events by default
const urlParams = new URLSearchParams(window.location.search);
const dateParam = urlParams.get("date");

let currentDate = (() => {
  if (dateParam) {
    const parts = dateParam.split("-");
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number);
      return new Date(year, month - 1, day); // Safe parsing (Months are 0-based)
    }
  }
  return new Date(2024, 11, 9); // Default to December 9, 2024
})();

// Function to format the date as "Day, Month Date, Year"
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long", // e.g., "Monday"
    month: "long", // e.g., "September"
    day: "numeric", // e.g., "2"
    year: "numeric", // e.g., "2024"
  });
}

function getWeekRange(date) {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

  return {
    start: startOfWeek.toISOString().split("T")[0],
    end: endOfWeek.toISOString().split("T")[0],
  };
}

function calculateEndTime(startTime) {
  const [hour, minutePart] = startTime.split(":");
  const [minutes, period] = minutePart.trim().split(" ");
  let endHour = parseInt(hour) + 1; // Add one hour
  let endPeriod = period;

  // Handle AM/PM transitions
  if (endHour === 12) {
    endPeriod = period === "AM" ? "PM" : "AM"; // Switch at 12
  } else if (endHour > 12) {
    endHour -= 12; // Wrap back to 1 after 12 PM
  }

  return `${endHour}:${minutes} ${endPeriod}`;
}

function syncWeeklyView() {
  const weeklyURL = `weekly.html?date=${currentDate.toISOString().split("T")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(2)").onclick = () =>
    (window.location.href = weeklyURL);
}

function syncMonthlyView() {
  const monthlyURL = `monthly.html?date=${currentDate.toISOString().split("T")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(3)").onclick = () =>
    (window.location.href = monthlyURL);
}

// Normalize time format (e.g., "9:00 am" -> "9:00 AM")
function normalizeTime(time) {
  const [hour, minutePart] = time.split(":");
  const [minutes, period] = minutePart.trim().split(" ");
  const normalizedPeriod = period.toUpperCase(); // Convert "am"/"pm" to "AM"/"PM"
  return `${hour}:${minutes} ${normalizedPeriod}`;
}

// Fetch appointments for the selected date
async function fetchAppointments(date) {
  try {
    const queryParams = new URLSearchParams({ date });
    if (selectedDoctor) queryParams.append("doctor", selectedDoctor); // Add doctor filter if selected

    const response = await fetch(`http://localhost:3000/appointments?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch appointments");

    return await response.json();
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}


// Render appointments as buttons in the calendar grid
async function renderAppointments() {
  const formattedDate = currentDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const appointments = await fetchAppointments(formattedDate);

  // Clear existing buttons in all slots
  const slots = document.querySelectorAll(".calendar-grid > div:nth-child(even)");
  const timeDivs = document.querySelectorAll(".calendar-grid .time");

  slots.forEach((slot, index) => {
    // Clear content without removing existing event listeners
    slot.innerHTML = ""; 

    // Remove existing event listener (if any) to avoid duplicates
    const newSlot = slot.cloneNode(true);
    slot.parentNode.replaceChild(newSlot, slot);

    // Add click listener for empty slots
    newSlot.addEventListener("click", () => {
      const startTime = timeDivs[index].textContent.trim(); // Get the corresponding start time
      const endTime = calculateEndTime(startTime); // Calculate the end time dynamically
      const selectedDoctor = document.getElementById("doctorFilter").value || "No Doctor Selected";

      // Open the appointment form for an empty slot
      openAppointmentForm({
        start_time: startTime,
        end_time: endTime,
        doctor_name: selectedDoctor, // Pass the selected doctor
      });
    });
  });

  // Map appointments to time slots
  appointments.forEach((appointment) => {
    const normalizedTime = normalizeTime(appointment.start_time); // Normalize the time format
    const timeSlot = [...document.querySelectorAll(".calendar-grid .time")].find(
      (timeDiv) => timeDiv.textContent.trim() === normalizedTime
    );

    if (timeSlot && timeSlot.nextElementSibling) {
      const slot = timeSlot.nextElementSibling;
      //create appointment button
      const appointmentButton = document.createElement("button");
      appointmentButton.classList.add("appointment-button");

      // Assign class based on doctor name
      if (appointment.doctor_name === "Dr. Smith") {
        appointmentButton.classList.add("dr-smith");
      } else if (appointment.doctor_name === "Dr. Johnson") {
        appointmentButton.classList.add("dr-johnson");
      } else if (appointment.doctor_name === "Dr. Lee") {
        appointmentButton.classList.add("dr-lee");
      }

      appointmentButton.textContent = `${appointment.patient_name} (${appointment.doctor_name})`;

      // Add click event to the button
      appointmentButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the parent slot's click handler
        openAppointmentDetails(appointment);
      });

      slot.appendChild(appointmentButton);
    }
  });
  appointmentFormClickEnabled = true
}

// Open appointment form in the iframe
function openAppointmentForm(appointment = {}) {
  const iframe = document.querySelector(".appointment-form-iframe");
  const popupOverlay = document.querySelector(".popup-overlay");
  const appointmentFormContainer = document.querySelector(".appointment-form-container");

  const query = new URLSearchParams({
    date: appointment?.appointment_date || currentDate.toISOString().split("T")[0],
    time: appointment?.start_time || "",
    endTime: appointment?.end_time || "",
    doctor: appointment?.doctor_name || "No Doctor Selected",
  });

  iframe.src = `AppointmentForm.html?${query.toString()}`;
  if (appointmentFormClickEnabled) {
    appointmentFormContainer.style.display = "block";
    popupOverlay.style.display = "block";
  }
}


function closePopup() {
  // Close the Appointment Form Popup
  document.querySelector(".appointment-form-container").style.display = "none";
  document.querySelector(".appointment-form-iframe").src = "";

  // Close the Appointment Details Popup
  document.querySelector(".appointment-details-container").style.display = "none";
  document.querySelector(".appointment-details-iframe").src = "";

  // Hide the overlay
  document.querySelector(".popup-overlay").style.display = "none";
}

// Overlay Click: Closes whichever popup is active
document.querySelector(".popup-overlay").addEventListener("click", closePopup);

// Message Event: Handles iframe messages like "close" or "refresh"
window.addEventListener("message", (event) => {
  if (event.data.action === "close") {
    closePopup(); // Close any active popups
  } else if (event.data.action === "refresh" && event.data.success) {
    renderDay(); // Refresh the daily view
  }
});



function renderDay() {
  const dayLabel = document.querySelector(".calendar-date span");
  dayLabel.textContent = formatDate(currentDate);
  renderAppointments(); // Fetch and render appointments for the selected day
}

// Function to navigate to the previous or next day
function navigateDay(direction) {
  if (direction === "forward") {
    currentDate.setDate(currentDate.getDate() + 1); // Go to the next day
  } else if (direction === "backward") {
    currentDate.setDate(currentDate.getDate() - 1); // Go to the previous day
  }
  renderDay();
}

// Attach event listeners for the navigation buttons and slots
document.addEventListener("DOMContentLoaded", () => {
  renderDay();

  attachDoctorFilterListener();

  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () => {
    navigateDay("backward");
  });

  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () => {
    navigateDay("forward");
  });
});



function openAppointmentDetails(appointment) {
  const iframe = document.querySelector(".appointment-details-iframe");
  const popupOverlay = document.querySelector(".popup-overlay");
  const appointmentDetailsContainer = document.querySelector(".appointment-details-container");

  const query = new URLSearchParams({
    id: appointment.id, // Pass the unique appointment ID
    patient_name: appointment.patient_name,
    date: new Date(appointment.appointment_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: appointment.start_time,
    endTime: appointment.end_time,
    doctor: appointment.doctor_name,
    notes: appointment.notes,
    type: appointment.appointment_type,
    status_: appointment.status_,
  });

  iframe.src = `AppointmentDetails.html?${query.toString()}`;
  appointmentDetailsContainer.style.display = "block";
  popupOverlay.style.display = "block";
}

// Close popup
document.querySelector(".popup-overlay").addEventListener("click", () => {
  document.querySelector(".appointment-details-container").style.display = "none";
  document.querySelector(".popup-overlay").style.display = "none";
  document.querySelector(".appointment-details-iframe").src = ""; // Reset iframe
});



function attachDoctorFilterListener() {
  const doctorFilter = document.getElementById("doctorFilter");
  if (doctorFilter) {
    doctorFilter.addEventListener("change", (event) => {
      selectedDoctor = event.target.value; // Update the selected doctor
      renderDay(); // Re-render the appointments
    });
  } else {
    console.error("Doctor filter dropdown not found in the DOM.");
  }
}

window.addEventListener("message", (event) => {
  if (event.data.action === "reschedule") {
    const { appointmentDetails } = event.data;

    console.log("Reschedule action received:", appointmentDetails);

    // Disable clicks for opening new appointment forms
    appointmentFormClickEnabled = false;

    // Highlight available slots
    highlightAvailableSlots();

    // Attach click events to slots for selecting a new time
    document.querySelectorAll(".calendar-grid > div:nth-child(even)").forEach((slot) => {
      slot.addEventListener("click", () => {
        const selectedTime = slot.previousElementSibling.textContent.trim();
        const selectedDate = currentDate.toISOString().split("T")[0];
        const endTime = calculateEndTime(selectedTime);
        appointmentFormClickEnabled = false;

        // Perform rescheduling
        rescheduleAppointment(appointmentDetails.id, selectedDate, selectedTime, endTime);

        // Clear slot listeners and highlights after rescheduling
        clearSlotListeners();

        // Refresh the appointments in the daily view
        renderAppointments();
      });
    });
  }
});

// Highlight available slots
function highlightAvailableSlots() {
  document.querySelectorAll(".calendar-grid > div:nth-child(even)").forEach((slot) => {
    slot.classList.add("highlight-slot");
  });
}

// Clear slot listeners and highlights
function clearSlotListeners() {
  document.querySelectorAll(".calendar-grid > div:nth-child(even)").forEach((slot) => {
    slot.classList.remove("highlight-slot");
    const newSlot = slot.cloneNode(true);
    slot.parentNode.replaceChild(newSlot, slot);
  });
}

// Reschedule the appointment
async function rescheduleAppointment(appointmentId, newDate, newTime, newEndTime) {
  try {
    const response = await fetch("http://localhost:3000/appointments_reschedule", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: appointmentId,
        appointment_date: newDate,
        start_time: newTime,
        end_time: newEndTime,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reschedule the appointment.");
    }

    alert("Appointment rescheduled successfully.");
    appointmentFormClickEnabled = true; // Re-enable appointment form clicks
    window.parent.postMessage({ action: "refresh", success: true }, "*");
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    alert("Failed to reschedule the appointment.");
  }
}



const appointments = [
  {
    patient: "Ehud Sharlin",
    type: "In-Clinic",
    date: "Thurs, Dec 12",
    time: "11:00 AM - 12:00 PM",
  },
  {
    patient: "Linda Johnson",
    type: "Online",
    date: "Tues, Nov. 5",
    time: "12:00 PM - 1:00 PM",
  },
  {
    patient: "Jane Smith",
    type: "Online",
    date: "Mon, Oct. 28",
    time: "9:00 AM - 10:00 AM",
  },
];

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Function to filter and display search results
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = ""; // Clear previous results

  if (query === "") {
    searchResults.style.display = "none"; // Hide results if query is empty
    return;
  }

  const filteredAppointments = appointments.filter((appt) =>
    appt.patient.toLowerCase().includes(query)
  );

  if (filteredAppointments.length === 0) {
    searchResults.innerHTML = `<div class="result-item">No results found</div>`;
  } else {
    filteredAppointments.forEach((appt) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      resultItem.innerHTML = `
        <strong>${appt.patient}</strong>
        <span class="appointment-type ${
          appt.type === "Online" ? "online" : "in-clinic"
        }">[${appt.type}]</span><br>
        ${appt.date}, ${appt.time}
      `;
      resultItem.onclick = () => alert(`Viewing details for ${appt.patient}`);
      searchResults.appendChild(resultItem);
    });
  }

  searchResults.style.display = "block"; // Show results
});

// Hide search results if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    searchResults.style.display = "none";
  }
});
