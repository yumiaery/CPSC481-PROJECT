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
    weekday: "long",  // e.g., "Monday"
    month: "long",    // e.g., "September"
    day: "numeric",   // e.g., "2"
    year: "numeric",  // e.g., "2024"
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
  const weekRange = getWeekRange(currentDate);
  const weeklyURL = `weekly.html?date=${currentDate.toISOString().split("T")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(2)").onclick = () => (window.location.href = weeklyURL);
}

function syncMonthlyView() {
  const monthlyURL = `monthly.html?date=${currentDate.toISOString().split("T")[0]}`;
  document.querySelector(".view-tabs .tab:nth-child(3)").onclick = () => (window.location.href = monthlyURL);
}


function renderDay() {
  const dayLabel = document.querySelector(".calendar-date span");
  dayLabel.textContent = formatDate(currentDate);
  syncWeeklyView(); // Ensure weekly view syncs with the current date
}

// Function to navigate to the previous or next day
function navigateDay(direction) {
  if (direction === "forward") {
    currentDate.setDate(currentDate.getDate() + 1); // Go to the next day
  } else if (direction === "backward") {
    currentDate.setDate(currentDate.getDate() - 1); // Go to the previous day
  }
  renderDay();
  syncWeeklyView(); // Sync weekly view link
  syncMonthlyView();
}

// Function to calculate end time (add 1 hour to start time)
function calculateEndTime(startTime) {
  const [hour, minutePart] = startTime.split(":");
  const [minutes, period] = minutePart.split(" ");
  let endHour = parseInt(hour) + 1;
  let endPeriod = period;

  // Handle transitions for 12-hour format
if (endHour === 12) {
  endPeriod = period === "AM" ? "PM" : "AM"; // Switch AM/PM at 12
} else if (endHour > 12) {
  endHour -= 12; // Wrap around after 12
}

// Ensure end period changes correctly for 11 AM/PM
if (endHour === 1 && period === "PM") {
  endPeriod = "AM"; // 11 PM to 12 AM
} else if (endHour === 1 && period === "AM") {
  endPeriod = "PM"; // 11 AM to 12 PM
}

  return `${endHour}:${minutes} ${endPeriod}`;
}

let selectedDoctor = ""; // Track the selected doctor

// Attach event listeners for the navigation buttons and slots
document.addEventListener("DOMContentLoaded", () => {
  const doctorFilter = document.getElementById("doctorFilter");

  // Update the selected doctor when the filter changes
  doctorFilter.addEventListener("change", (event) => {
    selectedDoctor = event.target.value;
    console.log(`Selected Doctor: ${selectedDoctor}`);
  });

  renderDay();

  // Add navigation button listeners
  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () =>
    navigateDay("backward")
  );

  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () =>
    navigateDay("forward")
  );

  // Handle time slot clicks
  const calendarGrid = document.querySelector(".calendar-grid");
  calendarGrid.addEventListener("click", (event) => {
    const slot = event.target;

    if (slot.previousElementSibling && slot.previousElementSibling.classList.contains("time")) {
      const startTime = slot.previousElementSibling.textContent.trim();
      const endTime = calculateEndTime(startTime);

      // Show popup
      document.querySelector(".appointment-form-container").style.display = "block";
      document.querySelector(".popup-overlay").style.display = "block";

      // Set iframe source with query parameters
      const iframe = document.querySelector(".appointment-form-iframe");
      iframe.src = `AppointmentForm.html?date=${currentDate.toISOString().split("T")[0]}&time=${startTime}&endTime=${endTime}&doctor=${encodeURIComponent(selectedDoctor)}`;

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

