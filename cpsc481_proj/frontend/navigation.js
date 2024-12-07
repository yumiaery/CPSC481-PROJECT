// navigation.js

// Function to navigate to different pages
function navigateTo(page) {
    window.location.href = page; // Redirect to the specified page
  }
  
  // Function to dynamically switch views without reloading (if on one page)
  function showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach((view) => {
      view.style.display = 'none';
    });
  
    // Show the selected view
    document.getElementById(viewId).style.display = 'block';
  }
  