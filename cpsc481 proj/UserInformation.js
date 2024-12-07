document.addEventListener("DOMContentLoaded", function () {
    // Get username from sessionStorage
    const username = sessionStorage.getItem("username");

    // Check if the username exists in sessionStorage
    if (username) {
        document.getElementById('username').textContent = username;
    } else {
        document.getElementById('username').textContent = "Guest";
    }
});
