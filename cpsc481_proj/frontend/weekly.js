// Predefined weeks from September 2024 to February 2025
const predefinedWeeks = [
  "Mon, Sep 2, 2024 - Sun, Sep 8, 2024",
  "Mon, Sep 9, 2024 - Sun, Sep 15, 2024",
  "Mon, Sep 16, 2024 - Sun, Sep 22, 2024",
  "Mon, Sep 23, 2024 - Sun, Sep 29, 2024",
  "Mon, Sep 30, 2024 - Sun, Oct 6, 2024",
  "Mon, Oct 7, 2024 - Sun, Oct 13, 2024",
  "Mon, Oct 14, 2024 - Sun, Oct 20, 2024",
  "Mon, Oct 21, 2024 - Sun, Oct 27, 2024",
  "Mon, Oct 28, 2024 - Sun, Nov 3, 2024",
  "Mon, Nov 4, 2024 - Sun, Nov 10, 2024",
  "Mon, Nov 11, 2024 - Sun, Nov 17, 2024",
  "Mon, Nov 18, 2024 - Sun, Nov 24, 2024",
  "Mon, Nov 25, 2024 - Sun, Dec 1, 2024",
  "Mon, Dec 2, 2024 - Sun, Dec 8, 2024",
  "Mon, Dec 9, 2024 - Sun, Dec 15, 2024",
  "Mon, Dec 16, 2024 - Sun, Dec 22, 2024",
  "Mon, Dec 23, 2024 - Sun, Dec 29, 2024",
  "Mon, Dec 30, 2024 - Sun, Jan 5, 2025",
  "Mon, Jan 6, 2025 - Sun, Jan 12, 2025",
  "Mon, Jan 13, 2025 - Sun, Jan 19, 2025",
  "Mon, Jan 20, 2025 - Sun, Jan 26, 2025",
  "Mon, Jan 27, 2025 - Sun, Feb 2, 2025",
  "Mon, Feb 3, 2025 - Sun, Feb 9, 2025",
  "Mon, Feb 10, 2025 - Sun, Feb 16, 2025",
  "Mon, Feb 17, 2025 - Sun, Feb 23, 2025",
];
let currentWeekIndex = 14; // Default to the first week

let appointmentFormClickEnabled = true; // Allow click events by default

let selectedDoctor = ""; // Track the currently selected doctor
function normalizeTime(time) {
  const [hour, minutePart] = time.split(":");
  const [minutes, period] = minutePart.trim().split(" ");
  const normalizedPeriod = period.toUpperCase(); // Convert "am"/"pm" to "AM"/"PM"
  return `${hour}:${minutes} ${normalizedPeriod}`;
}

function syncWithDailyView() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date");

  if (dateParam) {
    const date = new Date(dateParam);

    // Calculate start and end of the week
    const startOfWeek = new Date(date);
    const dayOffset = startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1; // Sunday fix
    startOfWeek.setDate(startOfWeek.getDate() - dayOffset);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Find the matching week
    currentWeekIndex = predefinedWeeks.findIndex((week) => {
      const [start, end] = week.split(" - ");
      return (
        new Date(start).toISOString().split("T")[0] === startOfWeek.toISOString().split("T")[0] &&
        new Date(end).toISOString().split("T")[0] === endOfWeek.toISOString().split("T")[0]
      );
    });

    if (currentWeekIndex === -1) {
      console.error("No matching week found. Defaulting to first week.");
      currentWeekIndex = 14; // Default to the first week
    }
  }
}

function syncDailyView(date) {
  const dailyURL = `daily.html?date=${predefinedWeeks[currentWeekIndex].split(" - ")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(1)").onclick = () => (window.location.href = dailyURL);
}

function syncMonthlyView() {
  const monthlyURL = `monthly.html?date=${predefinedWeeks[currentWeekIndex].split(" - ")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(3)").onclick = () => (window.location.href = monthlyURL);
}

// Navigate between weeks
function navigateWeek(direction) {
  if (direction === "forward" && currentWeekIndex < predefinedWeeks.length - 1) {
    currentWeekIndex++;
  } else if (direction === "backward" && currentWeekIndex > 0) {
    currentWeekIndex--;
  }
  renderWeek();
}


// Fetch appointments for the selected week
async function fetchWeeklyAppointments(startDate, endDate) {
  try {
    const queryParams = new URLSearchParams({ start_date: startDate, end_date: endDate });
    if (selectedDoctor) queryParams.append("doctor", selectedDoctor);

    const response = await fetch(`http://44.243.40.96:3000/appointmentsWeekly?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Failed to fetch weekly appointments");

    return await response.json();
  } catch (error) {
    console.error("Error fetching weekly appointments:", error);
    return [];
  }
}


async function renderAppointmentsWeekly() {
  
  const weekRange = predefinedWeeks[currentWeekIndex];
  const [weekStart] = weekRange.split(" - ");
  const startDate = new Date(weekStart);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const startFormatted = startDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const endFormatted = endDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'

  const appointments = await fetchWeeklyAppointments(startFormatted, endFormatted);

  // Clear existing buttons in all slots
  const slots = document.querySelectorAll(".calendar-grid > div:not(.weekday):not(.time)");
  const timeDivs = document.querySelectorAll(".calendar-grid .time");

  slots.forEach((slot, index) => {
    slot.innerHTML = ""; // Clear slot content

    slot.addEventListener("click", () => {
      const slotDate = slot.dataset.date;
      const slotTime = timeDivs[index % timeDivs.length].textContent.trim();
      const endTime = calculateEndTime(slotTime);
      const selectedDoctor = document.getElementById("doctorFilter").value || "No Doctor Selected";
      openAppointmentForm({
        appointment_date: slotDate,
        start_time: slotTime,
        end_time: endTime,
        doctor_name: selectedDoctor,
      });
    });
  });

 
  appointments.forEach((appointment) => {
    const appointmentDate = new Date(appointment.appointment_date).toISOString().split("T")[0];
    const normalizedTime = normalizeTime(appointment.start_time);

    // Find the correct slot
    const slot = [...slots].find(
      (slot) =>
        slot.dataset.date === appointmentDate && slot.dataset.time === normalizedTime
    );

    if (slot) {
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

      // Add click event to open Appointment Details
      appointmentButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent parent slot click
        openAppointmentDetails(appointment);
      });

      slot.appendChild(appointmentButton); // Add button to the slot
    }
  });
  appointmentFormClickEnabled = true
}



function openAppointmentDetails(appointment) {
  const iframe = document.querySelector(".appointment-details-iframe");
  const popupOverlay = document.querySelector(".popup-overlay");
  const appointmentDetailsContainer = document.querySelector(".appointment-details-container");

  const query = new URLSearchParams({
    id: appointment.id,
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
  if (appointmentFormClickEnabled) {
    appointmentDetailsContainer.style.display = "block";
    popupOverlay.style.display = "block";
  }
}

// Close popup when overlay is clicked
document.querySelector(".popup-overlay").addEventListener("click", () => {
  document.querySelector(".appointment-details-container").style.display = "none";
  document.querySelector(".popup-overlay").style.display = "none";
  document.querySelector(".appointment-details-iframe").src = "";
});


// Helper: Handle slot click for empty slots
function handleSlotClick(event) {
  const slot = event.target;
  const startTime = slot.dataset.time;
  const endTime = calculateEndTime(startTime); // Dynamically calculate the end time
  openAppointmentForm({
    appointment_date: slot.dataset.date,
    start_time: startTime,
    end_time: endTime,
    doctor_name: selectedDoctor || "No Doctor Selected",
  });
}

// Open appointment form in the iframe for weekly view
function openAppointmentForm(appointment = {}) {
  const iframe = document.querySelector(".appointment-form-iframe");
  const popupOverlay = document.querySelector(".popup-overlay");
  const appointmentFormContainer = document.querySelector(".appointment-form-container");

  // Ensure the appointment date is provided or use a fallback
  // const selectedDate = appointment.appointment_date || new Date().toISOString().split("T")[0]; // Fallback to today if no date

  const selectedDate = new Date(appointment.appointment_date || new Date());
  selectedDate.setDate(selectedDate.getDate() + 1); // Add 1 day
  // Prepare query parameters
  const query = new URLSearchParams({
    // date: selectedDate, // Date of the appointment
    date: selectedDate.toISOString().split("T")[0],
    time: appointment.start_time || "", // Start time
    endTime: appointment.end_time || "", // End time
    doctor: appointment.doctor_name || "No Doctor Selected", // Default doctor if not provided
  });

  // Set iframe source with the query parameters
  iframe.src = `AppointmentForm.html?${query.toString()}`;
  if (appointmentFormClickEnabled) {
    appointmentFormContainer.style.display = "block";
    popupOverlay.style.display = "block";
  }
}






// Render the calendar for the current week
function renderWeek() {

  const weekLabel = document.querySelector(".calendar-date span");
  weekLabel.textContent = predefinedWeeks[currentWeekIndex];

  const calendarGrid = document.querySelector(".calendar-grid");
  const weekdayCells = calendarGrid.querySelectorAll(".weekday");

  // Extract the start date
  const weekRange = predefinedWeeks[currentWeekIndex];
  const [weekStart] = weekRange.split(" - ");
  const startDate = new Date(weekStart);

  // Update weekday headers
  weekdayCells.forEach((cell, i) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const options = { weekday: "short", month: "short", day: "numeric" };
    cell.textContent = currentDate.toLocaleDateString("en-US", options);
    cell.dataset.date = currentDate.toISOString().split("T")[0];
  });

  // Populate time slots
  const timeSlots = calendarGrid.querySelectorAll(".calendar-grid > div:not(.weekday):not(.time)");
  const timeLabels = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

  timeSlots.forEach((slot, index) => {
    const columnIndex = index % 7;
    const rowIndex = Math.floor(index / 7);
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + columnIndex);

    slot.dataset.date = currentDate.toISOString().split("T")[0];
    slot.dataset.time = timeLabels[rowIndex];
    slot.dataset.end_time = timeLabels[rowIndex+1]
    
    slot.textContent = "";
    slot.removeAttribute("data-appointment");
  });

  renderAppointmentsWeekly();
}



document.addEventListener("DOMContentLoaded", initialize);

// Initialize the application
function initialize() {
  syncWithDailyView();
  renderWeek();

  attachEventListeners();
  syncDailyView(getStartOfWeek());
  syncMonthlyView();

  console.log("Initialization complete");
}

// Attach all event listeners
function attachEventListeners() {
  // Doctor filter change event
  const doctorFilter = document.getElementById("doctorFilter");
  if (doctorFilter) {
    doctorFilter.addEventListener("change", (event) => {
      selectedDoctor = event.target.value; // Update selected doctor
      renderWeek(); // Re-render the week with the selected doctor filter
    });
  }

  // Existing listeners
  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () => navigateWeek("backward"));
  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () => navigateWeek("forward"));

  // Calendar grid events
  const calendarGrid = document.querySelector(".calendar-grid");
  calendarGrid.addEventListener("click", handleCalendarClick);

  // Popup overlay click event
  document.querySelector(".popup-overlay").addEventListener("click", closePopup);

  // Handle messages from iframe
  window.addEventListener("message", (event) => {
    if (event.data.action === "close") {
      closePopup();
    } else if (event.data.action === "refresh") {
      console.log("Refresh action received in weekly view"); // Debugging
      renderWeek(); // Refresh the weekly calendar
    }
  });
}

// Handle doctor filter change
function handleDoctorFilterChange(event) {
  selectedDoctor = event.target.value;
  renderWeek();
  console.log(`Selected Doctor: ${selectedDoctor}`);
}

// Handle calendar grid click
function handleCalendarClick(event) {
  const weekdayCell = event.target.closest(".weekday");
  const slot = event.target;

  if (weekdayCell && weekdayCell.dataset.date) {
    window.location.href = `daily.html?date=${weekdayCell.dataset.date}`;
    return;
  }

  if (slot.dataset.time && slot.dataset.date) {
    handleSlotClick(slot);
  }
}

// Handle time slot click
function handleSlotClick(slot) {
  const startTime = slot.dataset.time;
  const endTime = calculateEndTime(startTime);

  // Show popup with iframe

  openPopupWithAppointmentForm({
    date: slot.dataset.date,
    time: startTime,
    endTime: endTime,
    doctor: encodeURIComponent(selectedDoctor || "No Doctor Selected"),
    });
}

// Open popup with appointment form
function openPopupWithAppointmentForm(appointment) {
  console.log("I am you")
  const iframe = document.querySelector(".appointment-form-iframe");
  iframe.src = `AppointmentForm.html?date=${appointment.date}&time=${appointment.time}&endTime=${appointment.endTime}&doctor=${appointment.doctor}`;

    console.log("Appointment form clicks are temporarily disabled.");
    if (appointmentFormClickEnabled) {
      document.querySelector(".appointment-form-container").style.display = "block";
      document.querySelector(".popup-overlay").style.display = "block"; 
    }
    
  
}



function closePopup() {
  // Close Appointment Form Popup
  document.querySelector(".appointment-form-container").style.display = "none";
  document.querySelector(".appointment-form-iframe").src = ""; // Reset the iframe

  // Close Appointment Details Popup
  document.querySelector(".appointment-details-container").style.display = "none";
  document.querySelector(".appointment-details-iframe").src = ""; // Reset the iframe

  // Hide the overlay
  document.querySelector(".popup-overlay").style.display = "none";
}


// Calculate end time for a given start time
function calculateEndTime(startTime) {
  const [hour, minutePart] = startTime.split(":");
  const [minutes, period] = minutePart.split(" ");
  let endHour = parseInt(hour) + 1;
  let endPeriod = period;

  if (endHour === 12) endPeriod = period === "AM" ? "PM" : "AM";
  if (endHour > 12) endHour -= 12;

  return `${endHour}:${minutes} ${endPeriod}`;
}

// Get start of the current week
function getStartOfWeek() {
  const startOfWeek = predefinedWeeks[currentWeekIndex].split(" - ")[0];
  return new Date(startOfWeek);
}

window.addEventListener("message", (event) => {
  if (event.data.action === "reschedule") {
    const { appointmentDetails } = event.data;

    console.log("Reschedule action received:", appointmentDetails);

    appointmentFormClickEnabled = false;

    // Highlight available slots (optional)
    highlightAvailableSlots();

    // Attach click event to slots to select a new time
    document.querySelectorAll(".calendar-grid > div:not(.weekday):not(.time)").forEach((slot) => {
      slot.addEventListener("click", (event) => {
        const selectedDate = slot.dataset.date;
        const selectedTime = slot.dataset.time;
        const selectedEndTime = slot.dataset.end_time
        appointmentFormClickEnabled = false;
        // Send an update request to the backend
        rescheduleAppointment(appointmentDetails.id, selectedDate, selectedTime, selectedEndTime);
        
        // Remove event listeners after selection
        clearSlotListeners();
        renderAppointmentsWeekly();
        
      });
      
      
    });
  }
});

// Helper: Highlight available slots
function highlightAvailableSlots() {
  document.querySelectorAll(".calendar-grid > div:not(.weekday):not(.time)").forEach((slot) => {
    slot.classList.add("highlight-slot");
  });
}

// Helper: Clear slot listeners
function clearSlotListeners() {
  document.querySelectorAll(".calendar-grid > div:not(.weekday):not(.time)").forEach((slot) => {
    slot.classList.remove("highlight-slot");
    const newSlot = slot.cloneNode(true);
    slot.parentNode.replaceChild(newSlot, slot);
  });
}

async function rescheduleAppointment(appointmentId, newDate, newTime, newEndTime) {
  try {
    const response = await fetch("http://44.243.40.96:3000/appointments_reschedule", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: appointmentId,
        appointment_date: newDate,
        start_time: newTime,
        end_time: newEndTime
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to reschedule the appointment.");
    }

    alert("Appointment rescheduled successfully.");
    appointmentFormClickEnabled = false;
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
