
// Parse the date from the URL
const urlParams = new URLSearchParams(window.location.search);
const dateParam = urlParams.get("date");


try {
  if (dateParam) {
    const parsedDate = new Date(dateParam);
    if (!isNaN(parsedDate)) {
      currentMonthYear = `${parsedDate.toLocaleString("default", { month: "long" })} ${parsedDate.getFullYear()}`;
    } else {
      throw new Error("Invalid date parameter");
    }
  } else {
    currentMonthYear = "December 2024"; // Default
  }
} catch (error) {
  console.error("Error parsing dateParam:", error);
  currentMonthYear = "December 2024"; // Fallback
}

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


  function navigate(direction) {
    const keys = Object.keys(hardcodedCalendars);
    const currentIndex = keys.indexOf(currentMonthYear);
  
    if (direction === "forward" && currentIndex < keys.length - 1) {
      currentMonthYear = keys[currentIndex + 1];
    } else if (direction === "backward" && currentIndex > 0) {
      currentMonthYear = keys[currentIndex - 1];
    } else {
      console.warn("No further months available for navigation.");
      return; // Exit if navigation is not possible
    }
  
    renderCalendar(currentMonthYear);
  }
  

  let selectedDoctor = ""; // Default to all doctors

  
  document.addEventListener("DOMContentLoaded", () => {
    renderCalendar(currentMonthYear);

    // Attach event listener to the doctor dropdown
    const doctorDropdown = document.querySelector("#doctorFilter");
    if (doctorDropdown) {
      doctorDropdown.addEventListener("change", (event) => {
        selectedDoctor = event.target.value; // Update selected doctor
        console.log("Selected doctor:", selectedDoctor);
        renderAppointmentsMonthly(); // Re-fetch and render filtered appointments
      });
    } else {
      console.error("Doctor dropdown not found in the DOM.");
    }
  
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
      const queryParams = new URLSearchParams({ month, year });
        if (selectedDoctor) queryParams.append("doctor", selectedDoctor); // Add the doctor filter if selected

        const fetchURL = `http://44.243.40.96:3000/appointmentsMonthly?${queryParams.toString()}`;
        console.log("Fetching appointments from:", fetchURL); // Log the generated URL

        const response = await fetch(fetchURL);
        if (!response.ok) throw new Error("Failed to fetch monthly appointments");

        const data = await response.json();
        console.log("Fetched appointments:", data); // Log fetched data
        return data;
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
  
    const appointments = await fetchMonthlyAppointments(month, year, selectedDoctor);

    // Clear existing appointments from the calendar
    calendarGrid.querySelectorAll(".appointments").forEach((container) => {
      container.innerHTML = "";
    });
  
    // Map appointments to the corresponding day cells
    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.appointment_date).toISOString().split("T")[0];
      const dayCell = calendarGrid.querySelector(`.day-cell[data-date="${appointmentDate}"]`);
  
      if (dayCell) {
        const appointmentsContainer = dayCell.querySelector(".appointments");
  
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
  
        // Add click event to open the appointment details
        appointmentButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Prevent triggering the day cell handler
          openAppointmentDetails(appointment);
        });
  
        appointmentsContainer.appendChild(appointmentButton);
      } else {
        console.warn(`No matching day cell found for appointment date: ${appointment.appointment_date}`);
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
    appointmentDetailsContainer.style.display = "block";
    popupOverlay.style.display = "block";
  }


  function closePopup() {
    // Close the Appointment Details Popup
    document.querySelector(".appointment-details-container").style.display = "none";
    document.querySelector(".appointment-details-iframe").src = "";
  
    // Hide the overlay
    document.querySelector(".popup-overlay").style.display = "none";
  }

  document.querySelector(".popup-overlay").addEventListener("click", closePopup);

  window.addEventListener("message", (event) => {
    if (event.data.action === "close") {
        closePopup();
    } else if (event.data.action === "refresh" && event.data.success) {
        console.log("Refresh action received in monthly view"); // Debugging
        renderCalendar(currentMonthYear); // Refresh the monthly calendar
    }
});

  
  
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
      resultItem.onclick = () => selectPatient();
      searchResults.appendChild(resultItem);
    });
  }
  
  searchResults.style.display = "block"; // Show results
  
  function selectPatient() {
    alert("Feature under development");
  }

// Hide search results if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    searchResults.style.display = "none";
  }
});
  