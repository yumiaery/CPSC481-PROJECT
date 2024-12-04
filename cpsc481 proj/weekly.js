document.addEventListener('DOMContentLoaded', () => {
  const appointments = document.querySelectorAll('.appointment');

  // Create the popup overlay dynamically
  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup-overlay';
  popupOverlay.style.display = 'none'; // Initially hidden
  document.body.appendChild(popupOverlay);

  let currentAppointment = null; // To store the clicked appointment element

  // Define popup content for appointment details
  const appointmentDetailsContent = `
    <div class="appointment-form-container">
      <div class="appointment-form">
        <button class="close-btn">✖</button>
        <h2>Appointment Details</h2>
        <form>
          <label for="patient-name">Patient Name:</label>
          <input type="text" id="patient-name" readonly>
          <label for="appointment-date">Appointment Date:</label>
          <input type="text" id="appointment-date" readonly>
          <label for="appointment-time">Appointment Time:</label>
          <input type="text" id="appointment-time" readonly>
          <label for="doctor-name">Doctor Name:</label>
          <input type="text" id="doctor-name" readonly>
          <label for="appointment-type">Appointment Type:</label>
          <input type="text" id="appointment-type" readonly>
          <label for="notes">Notes:</label>
          <textarea id="notes" readonly></textarea>
          <div class="form-buttons">
            <button type="submit" class="reschedule-btn">Reschedule</button>
            <button type="button" class="cancel-appointment-btn">Cancel Appointment</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Access appointment details when an appointment is clicked
  appointments.forEach((appointment) => {
    appointment.addEventListener('click', () => {
      currentAppointment = appointment; // Save the clicked appointment
      showAppointmentDetails(appointment);
    });
  });

  // Function to show appointment details
  function showAppointmentDetails(appointment) {
    popupOverlay.innerHTML = appointmentDetailsContent;
    popupOverlay.style.display = 'flex';

    // Populate fields with appointment data
    document.getElementById('patient-name').value = appointment.getAttribute('data-patient-name');
    document.getElementById('appointment-date').value = appointment.getAttribute('data-date');
    document.getElementById('appointment-time').value = appointment.getAttribute('data-time');
    document.getElementById('doctor-name').value = appointment.getAttribute('data-doctor-name');
    document.getElementById('appointment-type').value = appointment.getAttribute('data-type');
    document.getElementById('notes').value = appointment.getAttribute('data-notes');

    // Close button functionality
    popupOverlay.querySelector('.close-btn').addEventListener('click', () => {
      popupOverlay.style.display = 'none';
    });

    // Cancel appointment button functionality
    popupOverlay.querySelector('.cancel-appointment-btn').addEventListener('click', () => {
      showCancelConfirmation();
    });
  }

  // Function to display cancel confirmation
  function showCancelConfirmation() {
    const cancelConfirmationContent = `
      <div class="appointment-form-container">
        <div class="appointment-form">
          <h2>Cancel Appointment</h2>
          <p>Are you sure you want to cancel this appointment?</p>
          <div class="popup-buttons">
            <button class="btn-secondary" id="no-button">No</button>
            <button class="btn-primary" id="yes-button">Yes</button>
          </div>
          <button class="close-btn">✖</button>
        </div>
      </div>
    `;
    popupOverlay.innerHTML = cancelConfirmationContent;

    // Close confirmation popup on "No" or close button
    document.getElementById('no-button').addEventListener('click', () => {
      if (currentAppointment) {
        showAppointmentDetails(currentAppointment); // Show the appointment details again
      }
    });
    popupOverlay.querySelector('.close-btn').addEventListener('click', () => {
      popupOverlay.style.display = 'none';
    });

    // Handle "Yes" button click
    document.getElementById('yes-button').addEventListener('click', () => {
      popupOverlay.innerHTML = `
        <div class="appointment-form-container">
          <div class="appointment-form">
            <h2>Appointment Canceled</h2>
            <p>The appointment has been successfully canceled.</p>
            <button class="close-btn">✖</button>
          </div>
        </div>
      `;

      // Close final cancellation message
      popupOverlay.querySelector('.close-btn').addEventListener('click', () => {
        popupOverlay.style.display = 'none';
      });
    });
  }

  // Close popup when clicking outside the content
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });
});
