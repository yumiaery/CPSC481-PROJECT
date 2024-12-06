const userName = sessionStorage.getItem("userName");

// Check if user name exists in sessionStorage, otherwise use a default name or handle the error
if (userName) {
    // Update the name in the popup
    document.getElementById('userName').textContent = userName;
} else {
    // If no user name is found, handle this case (e.g., redirect to login or show a placeholder)
    document.getElementById('userName').textContent = "Guest";
}
