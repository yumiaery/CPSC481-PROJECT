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
  
  
  // State to track the current week index
  let currentWeekIndex = predefinedWeeks.findIndex((week) =>
    week.startsWith("Mon, Dec 9, 2024")
  );
  
//   // Render the current week
//   function renderWeek() {
//     const weekLabel = document.querySelector(".calendar-date span");
//     weekLabel.textContent = predefinedWeeks[currentWeekIndex];

//     // Dynamically calculate each day's header (date and day)
//     const calendarGrid = document.querySelector(".calendar-grid");
//     const startDate = new Date(2024, 11, 9); // Adjust based on the starting Monday of your week
//     startDate.setDate(startDate.getDate() + currentWeekIndex * 7); // Adjust for the current week index

//     // Clear existing headers (weekday cells)
//     const weekdayCells = calendarGrid.querySelectorAll(".weekday");
//     weekdayCells.forEach((cell, i) => {
//         const currentDate = new Date(startDate);
//         currentDate.setDate(startDate.getDate() + i); // Add days to start date

//         // Format the date as "7th Oct, Monday"
//         const options = { day: "numeric", month: "short", weekday: "long" };
//         cell.textContent = currentDate.toLocaleDateString("en-US", options).replace(",", "");
//     });
// }

function renderWeek() {
    const weekLabel = document.querySelector(".calendar-date span");
    weekLabel.textContent = predefinedWeeks[currentWeekIndex];
  
    const calendarGrid = document.querySelector(".calendar-grid");
    const weekdayCells = calendarGrid.querySelectorAll(".weekday");
  
    // Extract the week start and end dates from the predefined week
    const weekRange = predefinedWeeks[currentWeekIndex];
    const [weekStart] = weekRange.split(" - "); // Extract "Mon. Dec. 9"
    const [weekday, month, day] = weekStart.split(" "); // Extract parts
  
    // Parse the start date
    const startDate = new Date(2024, 11, 9); // Default to Dec. 9, 2024
    startDate.setMonth(new Date(`${month} 1, 2024`).getMonth()); // Set the month dynamically
    startDate.setDate(parseInt(day)); // Set the day dynamically
  
    // Populate each weekday cell
    weekdayCells.forEach((cell, i) => {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i); // Increment day by index
  
      const options = { weekday: "short", month: "short", day: "numeric" };
      cell.textContent = currentDate.toLocaleDateString("en-US", options);
    });
  }
  
  
  // Navigate to the previous or next week
  function navigateWeek(direction) {
    if (direction === "forward" && currentWeekIndex < predefinedWeeks.length - 1) {
      currentWeekIndex++;
    } else if (direction === "backward" && currentWeekIndex > 0) {
      currentWeekIndex--;
    }
    renderWeek();
  }
  
  // Attach event listeners for the navigation buttons
  document.addEventListener("DOMContentLoaded", () => {
    renderWeek();
  
    document.querySelector(".arrow-btn:nth-child(1)").addEventListener("click", () =>
      navigateWeek("backward")
    );
  
    document.querySelector(".arrow-btn:nth-child(3)").addEventListener("click", () =>
      navigateWeek("forward")
    );
  });
  