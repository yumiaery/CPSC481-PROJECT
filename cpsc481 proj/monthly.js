// Hardcoded month data
const hardcodedCalendars = {
    "September 2024": { firstDay: 7, daysInMonth: 30 },
    "October 2024": { firstDay: 2, daysInMonth: 31 },
    "November 2024": { firstDay: 5, daysInMonth: 30 },
    "December 2024": { firstDay: 7, daysInMonth: 31 },
    "January 2025": { firstDay: 3, daysInMonth: 31 },
    "February 2025": { firstDay: 6, daysInMonth: 28 }
  };
  
  // Track current month-year
  let currentMonthYear = "December 2024";
  
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
  
  // Attach navigation event listeners
  document.addEventListener("DOMContentLoaded", () => {
    renderCalendar(currentMonthYear);
  
    document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () => navigate("backward"));
    document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () => navigate("forward"));
  });
  