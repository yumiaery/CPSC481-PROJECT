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
  
  // Add functionality for other future interactive elements here
  