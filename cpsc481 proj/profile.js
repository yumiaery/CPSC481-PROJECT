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
  