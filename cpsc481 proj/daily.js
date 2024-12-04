// // Initialize the current date (starting from Sep 2, 2024)
// let currentDate = new Date(2024, 11, 9); // Month is 0-based, so 8 = September

// // Function to format the date as "Day, Month Date, Year"
// function formatDate(date) {
//   return date.toLocaleDateString("en-US", {
//     weekday: "long",  // e.g., "Monday"
//     month: "long",    // e.g., "September"
//     day: "numeric",   // e.g., "2"
//     year: "numeric",  // e.g., "2024"
//   });
// }

// // Function to render the current date
// function renderDay() {
//   const dayLabel = document.querySelector(".calendar-date span");
//   dayLabel.textContent = formatDate(currentDate);
// }

// // Function to navigate to the previous or next day
// function navigateDay(direction) {
//   if (direction === "forward") {
//     currentDate.setDate(currentDate.getDate() + 1); // Go to the next day
//   } else if (direction === "backward") {
//     currentDate.setDate(currentDate.getDate() - 1); // Go to the previous day
//   }
//   renderDay();
// }

// // Attach event listeners for the navigation buttons
// document.addEventListener("DOMContentLoaded", () => {
//   renderDay();

//   document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () =>
//     navigateDay("backward")
//   );

//   document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () =>
//     navigateDay("forward")
//   );
// });



// Initialize the current date (starting from Dec 9, 2024)
let currentDate = new Date(2024, 11, 9); // Month is 0-based

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

// Function to calculate end time (add 1 hour to start time)
function calculateEndTime(startTime) {
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

  return `${endHour}:${minutes} ${endPeriod}`;
}

// Attach event listeners for the navigation buttons and slots
document.addEventListener("DOMContentLoaded", () => {
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
      iframe.src = `AppointmentForm.html?date=${currentDate.toISOString().split("T")[0]}&time=${startTime}&endTime=${endTime}`;
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
