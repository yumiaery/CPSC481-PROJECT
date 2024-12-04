
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

// Track the current week index
let currentWeekIndex = predefinedWeeks.findIndex((week) =>
  week.startsWith("Mon, Dec 9, 2024")
);

// Render the calendar for the current week
function renderWeek() {
  const weekLabel = document.querySelector(".calendar-date span");
  weekLabel.textContent = predefinedWeeks[currentWeekIndex];

  const calendarGrid = document.querySelector(".calendar-grid");
  const weekdayCells = calendarGrid.querySelectorAll(".weekday");

  // Extract the start date
  const weekRange = predefinedWeeks[currentWeekIndex];
  const [weekStart] = weekRange.split(" - ");
  const [weekday, month, day] = weekStart.split(" ");
  const startDate = new Date(2024, 11, 9);
  startDate.setMonth(new Date(`${month} 1, 2024`).getMonth());
  startDate.setDate(parseInt(day));

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
    slot.textContent = "";
    slot.removeAttribute("data-appointment");
  });
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

document.addEventListener("DOMContentLoaded", () => {
  renderWeek();

  // Add navigation button listeners
  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () =>
    navigateWeek("backward")
  );
  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () =>
    navigateWeek("forward")
  );

  // Handle time slot clicks
  const calendarGrid = document.querySelector(".calendar-grid");
  calendarGrid.addEventListener("click", (event) => {
    const slot = event.target;
    if (slot.dataset.time && slot.dataset.date) {
      const startTime = slot.dataset.time;

    // Calculate the end time (add 1 hour)
    const [hour, minutePart] = startTime.split(":");
    const [minutes, period] = minutePart.split(" ");
    let endHour = parseInt(hour) + 1;
    let endPeriod = period;

    // Handle transitions for 12 PM and 12 AM
    if (endHour === 12) {
      endPeriod = period; // Stay in the same period (PM/AM)
    } else if (endHour > 12) {
      endHour -= 12; // Wrap around after 12
      endPeriod = period === "AM" ? "PM" : "AM"; // Switch AM/PM
    }

    const endTime = `${endHour}:${minutes} ${endPeriod}`;

    // Debugging to verify the endTime
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

    // Show popup
    document.querySelector(".appointment-form-container").style.display = "block";
    document.querySelector(".popup-overlay").style.display = "block";

    // Set iframe source with query parameters
    const iframe = document.querySelector(".appointment-form-iframe");
    iframe.src = `AppointmentForm.html?date=${slot.dataset.date}&time=${slot.dataset.time}&endTime=${endTime}&appointment=${encodeURIComponent(
      slot.dataset.appointment || ""
    )}`;
    }
  });

  // Close popup when clicking the overlay
  document.querySelector(".popup-overlay").addEventListener("click", closePopup);

  function closePopup() {
    document.querySelector(".appointment-form-container").style.display = "none";
    document.querySelector(".popup-overlay").style.display = "none";

    // Clear iframe source
    document.querySelector(".appointment-form-iframe").src = "";
  }

  window.addEventListener("message", (event) => {
    if (event.data.action === "close") {
      closePopup();
    }
  });
  
});
