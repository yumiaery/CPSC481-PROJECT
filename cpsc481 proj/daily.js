// Initialize the current date (starting from Sep 2, 2024)
let currentDate = new Date(2024, 11, 9); // Month is 0-based, so 8 = September

// Function to format the date as "Day, Month Date, Year"
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",  // e.g., "Monday"
    month: "long",    // e.g., "September"
    day: "numeric",   // e.g., "2"
    year: "numeric",  // e.g., "2024"
  });
}

// Function to render the current date
function renderDay() {
  const dayLabel = document.querySelector(".calendar-date span");
  dayLabel.textContent = formatDate(currentDate);
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

// Attach event listeners for the navigation buttons
document.addEventListener("DOMContentLoaded", () => {
  renderDay();

  document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () =>
    navigateDay("backward")
  );

  document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () =>
    navigateDay("forward")
  );
});
