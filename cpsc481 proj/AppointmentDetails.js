document.addEventListener("DOMContentLoaded", () => {
    const closeButton = document.querySelector(".close-btn");
    
    closeButton.addEventListener("click", () => {
      // Send a message to the parent to close the iframe
      window.parent.postMessage({ action: "close" }, "*");
    });
  
    // Populate details
    const params = new URLSearchParams(window.location.search);
    document.getElementById("patient-name").value = params.get("patient_name") || "N/A";
    document.getElementById("appointment-date").value = params.get("date") || "N/A";
    document.getElementById("start-time").value = params.get("time") || "N/A";
    document.getElementById("end-time").value = params.get("endTime") || "N/A";
    document.getElementById("doctor-name").value = params.get("doctor") || "N/A";
    document.getElementById("appointment-type").value = params.get("type") || "N/A";
    document.getElementById("notes").value = params.get("notes") || "N/A";
  });
  