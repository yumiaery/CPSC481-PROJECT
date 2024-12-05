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
  return new Date(2024, 11, 9); // Default to September 2, 2024
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
    const response = await fetch(`http://localhost:3000/appointments?date=${date}`);
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
  slots.forEach((slot) => {
    slot.innerHTML = ""; // Clear all time slots
    slot.addEventListener("click", () => openAppointmentForm({}));
  });

  // Map appointments to time slots
  appointments.forEach((appointment) => {
    const normalizedTime = normalizeTime(appointment.start_time); // Normalize the time format
    const timeSlot = [...document.querySelectorAll(".calendar-grid .time")].find(
      (timeDiv) => timeDiv.textContent.trim() === normalizedTime
    );

    if (timeSlot && timeSlot.nextElementSibling) {
      const slot = timeSlot.nextElementSibling;
      const appointmentButton = document.createElement("button");
      appointmentButton.classList.add("appointment-button");
      appointmentButton.textContent = `${appointment.patient_name} (${appointment.doctor_name})`;

      // Add click event to the button
      appointmentButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent the parent slot's click handler
        openAppointmentForm(appointment);
      });

      slot.appendChild(appointmentButton);
    }
  });
}

// Open appointment form in the iframe
function openAppointmentForm(appointment) {
  const iframe = document.querySelector(".appointment-form-iframe");
  const popupOverlay = document.querySelector(".popup-overlay");
  const appointmentFormContainer = document.querySelector(".appointment-form-container");

  const query = new URLSearchParams({
    date: appointment?.appointment_date || currentDate.toISOString().split("T")[0],
    time: appointment?.start_time || "",
    endTime: appointment?.end_time || "",
    doctor: appointment?.doctor_name || "",
  });

  iframe.src = `AppointmentForm.html?${query.toString()}`;
  appointmentFormContainer.style.display = "block";
  popupOverlay.style.display = "block";
}

// Close popup
function closePopup() {
  document.querySelector(".appointment-form-container").style.display = "none";
  document.querySelector(".popup-overlay").style.display = "none";
  document.querySelector(".appointment-form-iframe").src = "";
}

document.querySelector(".popup-overlay").addEventListener("click", closePopup);

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

  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () => {
    navigateDay("backward");
  });

  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () => {
    navigateDay("forward");
  });
});
