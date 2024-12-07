// Hardcoded users
const users = [
    { username: "Rebecca.R", password: "password1" },
    { username: "Nelly.N", password: "password2" },
    { username: "David.D", password: "password3" },
];

// Get references to form and error message
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("error-message");

// Handle form submission
loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get entered username and password
    const username = document.getElementById("username").value.trim();
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