
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
  
  // Render the calendar
  function renderCalendar(monthYear) {
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
  
    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
      calendarGrid.innerHTML += `<div class="day-cell"><span class="date">${day}</span></div>`;
    }
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
  
  
  