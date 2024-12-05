
// Parse the date from the URL
const urlParams = new URLSearchParams(window.location.search);
const dateParam = urlParams.get("date");

// Set currentMonthYear based on the URL parameter or default to December 2024
let currentMonthYear = dateParam
  ? `${new Date(dateParam).toLocaleString("default", { month: "long" })} ${new Date(dateParam).getFullYear()}`
  : "December 2024";

  // Hardcoded month data
const hardcodedCalendars = {
    "September 2024": { firstDay: 7, daysInMonth: 30 },
    "October 2024": { firstDay: 2, daysInMonth: 31 },
    "November 2024": { firstDay: 5, daysInMonth: 30 },
    "December 2024": { firstDay: 7, daysInMonth: 31 },
    "January 2025": { firstDay: 3, daysInMonth: 31 },
    "February 2025": { firstDay: 6, daysInMonth: 28 }
  };
  
  async function renderCalendar(monthYear) {
    const calendarGrid = document.querySelector(".calendar-grid.monthly");
    const monthLabel = document.querySelector(".calendar-date span");
  
    // Update month label
    monthLabel.textContent = monthYear;
  
    // Get the calendar data
    const calendar = hardcodedCalendars[monthYear];
    if (!calendar) return;
  
    const { firstDay, daysInMonth } = calendar;
  
    // Clear existing calendar
    calendarGrid.innerHTML = `
      <div class="day-label">Monday</div>
      <div class="day-label">Tuesday</div>
      <div class="day-label">Wednesday</div>
      <div class="day-label">Thursday</div>
      <div class="day-label">Friday</div>
      <div class="day-label">Saturday</div>
      <div class="day-label">Sunday</div>
    `;
  
    // Add blank cells for the offset
    const offset = (firstDay === 0 ? 7 : firstDay) - 1; // Adjust for Monday start
    for (let i = 0; i < offset; i++) {
      calendarGrid.innerHTML += `<div class="day-cell"></div>`;
    }
  
    // Add day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(`${monthYear.split(" ")[0]} ${day}, ${monthYear.split(" ")[1]}`)
        .toISOString()
        .split("T")[0];
  
      calendarGrid.innerHTML += `
        <div class="day-cell" data-date="${date}">
          <span class="date">${day}</span>
          <div class="appointments"></div>
        </div>
      `;
    }
  
    // Fetch and render appointments
    await renderAppointmentsMonthly();
  }
  
  // Navigation logic
  function navigate(direction) {
    const keys = Object.keys(hardcodedCalendars);
    const currentIndex = keys.indexOf(currentMonthYear);
  
    if (direction === "forward" && currentIndex < keys.length - 1) {
      currentMonthYear = keys[currentIndex + 1];
    } else if (direction === "backward" && currentIndex > 0) {
      currentMonthYear = keys[currentIndex - 1];
    }
  
    renderCalendar(currentMonthYear);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    renderCalendar(currentMonthYear);
  
    document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () => navigate("backward"));
    document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () => navigate("forward"));
  
    
    // Add click event to day cells
    const calendarGrid = document.querySelector(".calendar-grid.monthly");
    calendarGrid.addEventListener("click", (event) => {
      const dayCell = event.target.closest(".day-cell");
      if (dayCell && dayCell.querySelector(".date")) {
        const day = dayCell.querySelector(".date").textContent.trim();
        const [month, year] = currentMonthYear.split(" ");
        const date = new Date(`${month} ${day}, ${year}`);
        window.location.href = `daily.html?date=${date.toISOString().split("T")[0]}`;
      }
    });
  });
  
  async function fetchMonthlyAppointments(month, year) {
    try {
      const response = await fetch(`http://localhost:3000/appointmentsMonthly?month=${month}&year=${year}`);
      if (!response.ok) throw new Error("Failed to fetch monthly appointments");
      return await response.json();
    } catch (error) {
      console.error("Error fetching monthly appointments:", error);
      return [];
    }
  }

  async function renderAppointmentsMonthly() {
    const calendarGrid = document.querySelector(".calendar-grid");
  
    // Get the current month and year from the view
    const monthLabel = document.querySelector(".calendar-date span").textContent; // e.g., "December 2024"
    const [month, year] = monthLabel.split(" ");
  
    const appointments = await fetchMonthlyAppointments(month, year);

    // Map appointments to the corresponding day cells
    appointments.forEach((appointment) => {
      
      const appointmentDate = new Date(appointment.appointment_date).toISOString().split("T")[0];

      const dayCell = calendarGrid.querySelector(`.day-cell[data-date="${appointmentDate}"]`);
  

      if (dayCell) {
        console.log("Found matching day cell:", dayCell);
        const appointmentsContainer = dayCell.querySelector(".appointments");
  
        const appointmentButton = document.createElement("button");
        appointmentButton.classList.add("appointment-button");
        appointmentButton.textContent = `${appointment.patient_name} (${appointment.doctor_name})`;
  
        // Add click event to open the appointment form
        appointmentButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent triggering the day cell handler
          openAppointmentForm({
            ...appointment,
          });
        });
  
        appointmentsContainer.appendChild(appointmentButton);
      } else {
        console.error("No matching day cell found for appointment date:", appointment.appointment_date);
      }
    });
  }
  
  function openAppointmentForm(appointment = {}) {
    const iframe = document.querySelector(".appointment-form-iframe");
    const popupOverlay = document.querySelector(".popup-overlay");
    const appointmentFormContainer = document.querySelector(".appointment-form-container");
  
    const query = new URLSearchParams({
      date: appointment.appointment_date || "",
      time: appointment.start_time || "",
      endTime: appointment.end_time || "",
      doctor: appointment.doctor_name || "",
    });
  
    iframe.src = `AppointmentForm.html?${query.toString()}`;
    appointmentFormContainer.style.display = "block";
    popupOverlay.style.display = "block";
  }
  
  
  