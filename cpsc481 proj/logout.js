// On the logout page (logout.html), check for the logoutSuccess flag and display the message
document.addEventListener("DOMContentLoaded", function () {
    const logoutMessage = document.getElementById("logout-message");

    if (sessionStorage.getItem("logoutSuccess") === "true") {
        // Display the logout message
        logoutMessage.style.display = "block";

        // Clear the logoutSuccess flag after displaying the message
        sessionStorage.removeItem("logoutSuccess");
    }
});

// Add a click event listener for the logout link (on the calendar page)
const logoutLink = document.getElementById("logoutLink");

logoutLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior

    // Clear session storage and set logout success flag
    sessionStorage.clear();
    sessionStorage.setItem("logoutSuccess", "true");

    // Redirect to the logout.html page
    window.location.href = "logout.html";
});

