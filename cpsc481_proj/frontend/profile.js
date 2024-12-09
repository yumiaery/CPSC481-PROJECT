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

// Add functionality for other future interactive elements here



// Get references to the pop-up and its controls
const userInfoPopup = document.getElementById("userInfoPopup");
const userInfoLink = document.querySelector('#profileMenu a[href="#user-info"]');
const closePopupButton = document.getElementById("closePopup");
const buttons = userInfoPopup.querySelectorAll('button'); // Select the buttons in the popup

// Function to show the pop-up
function showUserInfoPopup() {
  const body = document.body;
  userInfoPopup.style.display = "block"; // Show the pop-up
  body.style.pointerEvents = 'none';

  // Enable interactions only for buttons inside the popup
  buttons.forEach(button => {
    button.style.pointerEvents = 'auto';  // Enable pointer events for each button
  });
}

// Function to close the pop-up
function closeUserInfoPopup() {
  const body = document.body;
  userInfoPopup.style.display = "none"; // Hide the pop-up
  body.style.pointerEvents = 'auto';
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


// Define the changePassword function
function changePassword() {
  alert("Feature under development");
}

// Add event listener for the change password button
document.addEventListener('DOMContentLoaded', () => {
  const changePasswordButton = document.querySelector('.change-password-button');
  if (changePasswordButton) {
    changePasswordButton.addEventListener('click', changePassword);
  }
});

