// Hardcoded users
const users = [
    { username: "RebeccaRebeccason", password: "password1" },
    { username: "NellyNellyson", password: "password2" },
    { username: "DavidSmith", password: "password3" },
];

// Get references to form and error message
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

// Handle form submission
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get entered username and password
    const username = document.getElementById("username").value.trim();
    sessionStorage.setItem("username", username); // Store username
    const password = document.getElementById("password").value.trim();

    // Check if the credentials match any hardcoded user
    const validUser = users.find(
        (user) => user.username === username && user.password === password
    );

    if (validUser) {
        // Redirect to the daily.html page
        window.location.href = "daily.html";
    } else {
        // Show error message
        errorMessage.style.display = "block";
    }
});