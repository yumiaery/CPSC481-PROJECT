const appointments = [
  {
    patient: "John Doe",
    type: "Online",
    date: "Wed, Oct. 30",
    time: "10:00 AM - 11:00 AM",
    status: "Cancelled",
  },
  {
    patient: "Linda Johnson",
    type: "In-Clinic",
    date: "Tues, Nov. 5",
    time: "12:00 PM - 1:00 PM",
    status: "Confirmed",
  },
  {
    patient: "Jane Smith",
    type: "Online",
    date: "Mon, Oct. 28",
    time: "9:00 AM - 10:00 AM",
    status: "Confirmed",
  },
];

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Function to filter and display search results
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = ""; // Clear previous results

  if (query.trim() === "") {
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
        ${appt.date}, ${appt.time} ${
        appt.status === "Cancelled"
          ? `<span style="color: red; text-decoration: line-through;">${appt.status}</span>`
          : ""
      }
      `;
      resultItem.onclick = () => alert(`Viewing details for ${appt.patient}`);
      searchResults.appendChild(resultItem);
    });
  }

  searchResults.style.display = "block"; // Show results
});

// Hide search results if clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-container")) {
    searchResults.style.display = "none";
  }
});

// Function to handle click events on appointment slots
function handleClick(element) {
  // Check if the appointment is already selected
  if (element.classList.contains('selected')) {
    // If it's already selected, remove the selection
    element.classList.remove('selected');
  } else {
    // If it's not selected, add the selection
    element.classList.add('selected');
  }
}

// Function to toggle dropdown menu visibility
function toggleDropdown() {
  const menu = document.getElementById('profileMenu');
  menu.classList.toggle('open'); // Toggle the "open" class
}

// Close the dropdown when clicking outside
function closeDropdownOnClickOutside(event) {
  // Ensure the target is not the dropdown button or menu
  if (!event.target.closest('.profile-dropdown')) {
    const dropdown = document.getElementById('profileMenu');
    if (dropdown && dropdown.classList.contains('open')) {
      dropdown.classList.remove('open'); // Remove the "open" class
    }
  }
}

// Add event listener for profile button
document.addEventListener('DOMContentLoaded', () => {
  const profileButton = document.querySelector('.profile-icon');
  if (profileButton) {
    profileButton.addEventListener('click', toggleDropdown);
  }
});

// Add global event listener for clicks outside the dropdown
window.addEventListener('click', closeDropdownOnClickOutside);

// Get references to the pop-up and its controls
const userInfoPopup = document.getElementById("userInfoPopup");
const userInfoLink = document.querySelector('#profileMenu a[href="#user-info"]');
const closePopupButton = document.getElementById("closePopup");

// Function to show the pop-up
function showUserInfoPopup() {
  userInfoPopup.style.display = "flex"; // Show the pop-up
}

// Function to close the pop-up
function closeUserInfoPopup() {
  userInfoPopup.style.display = "none"; // Hide the pop-up
}

// Add event listeners
if (userInfoLink) {
  userInfoLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    showUserInfoPopup();
  });
}

if (closePopupButton) {
  closePopupButton.addEventListener("click", closeUserInfoPopup);
}

// Close the pop-up if the user clicks outside of it
window.addEventListener("click", (event) => {
  if (event.target === userInfoPopup) {
    closeUserInfoPopup();
  }
});



weekly.js