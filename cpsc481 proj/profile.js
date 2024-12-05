// JavaScript to handle the popup behavior
document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openPopupButton = document.getElementById("open-popup");
    const closePopupButton = document.getElementById("close-popup");
    const userName = document.getElementById("user-name");

    // Example: Dynamically set the user's name
    const userData = "David (Last Name)"; // Replace with actual dynamic user data
    userName.textContent = userData;

    // Open popup
    openPopupButton.addEventListener("click", () => {
        popup.classList.remove("hidden");
    });

    // Close popup
    closePopupButton.addEventListener("click", () => {
        popup.classList.add("hidden");
    });

    // Optional: Close the popup when clicking outside the content box
    popup.addEventListener("click", (event) => {
        if (event.target === popup) {
            popup.classList.add("hidden");
        }
    });
});
