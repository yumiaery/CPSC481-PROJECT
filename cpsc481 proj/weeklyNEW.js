document.addEventListener('DOMContentLoaded', () => {
  const appointments = document.querySelectorAll('.appointment');

  // Create the popup overlay dynamically
  const popupOverlay = document.createElement('div');
  popupOverlay.className = 'popup-overlay';
  popupOverlay.style.display = 'none'; // Initially hidden
  document.body.appendChild(popupOverlay);

  let currentAppointment = null;

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
            <button type="button" class="reschedule-btn">Reschedule</button>
            <button type="button" class="cancel-appointment-btn">Cancel Appointment</button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Loop through all appointments and disable empty ones
  appointments.forEach((appointment) => {
    if (!appointment.classList.contains('in-clinic') && !appointment.classList.contains('online')) {
      // Make empty slots unclickable
      appointment.style.pointerEvents = 'none';
    } else {
      // Add click event for booked slots only
      appointment.addEventListener('click', () => {
        currentAppointment = appointment; // Save the clicked appointment
        showAppointmentDetails(appointment);
      });
    }
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



    // Close button functionality
    popupOverlay.querySelector('.close-btn').addEventListener('click', () => {
      popupOverlay.style.display = 'none';
    });

    // Cancel appointment button functionality
    popupOverlay.querySelector('.cancel-appointment-btn').addEventListener('click', () => {
      showCancelConfirmation();
    });

    // Reschedule button functionality
    popupOverlay.querySelector('.reschedule-btn').addEventListener('click', () => {
      rescheduleAppointment();
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
      if (currentAppointment) {
        // Change the class of the appointment to appointment-empty
        currentAppointment.classList.remove('in-clinic', 'online'); // Remove any existing appointment types
        currentAppointment.classList.add('empty'); // Add the empty class
        currentAppointment.innerHTML = ''; // This will clear the content inside the div
        // Remove all attributes
        Array.from(currentAppointment.attributes).forEach(attr => {
          if (attr.name !== 'class') { // Exclude the 'class' attribute
            currentAppointment.removeAttribute(attr.name);
          }
        });
        currentAppointment.style.pointerEvents = 'none'; // Disable clicking
      }

      // Show cancellation success message
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

// Function to handle reschedule
// Assuming this function is triggered when the "Reschedule" button is clicked
function rescheduleAppointment() {
  const rescheduleContent = `
    <div class="appointment-form-container">
      <div class="appointment-form">
        <h2>Reschedule Appointment</h2>
        <div>
          <label for="new-date">Select New Date:</label>
          <select id="new-date">
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>
        <div>
          <label for="new-time">Select New Time:</label>
          <select id="new-time">
            <option value="9AM-10AM">9AM-10AM</option>
            <option value="10AM-11AM">10AM-11AM</option>
            <option value="11AM-12PM">11AM-12PM</option>
            <option value="12PM-1PM">12PM-1PM</option>
            <option value="1PM-2PM">1PM-2PM</option>
            <option value="2PM-3PM">2PM-3PM</option>
            <option value="3PM-4PM">3PM-4PM</option>
            <option value="4PM-5PM">4PM-5PM</option>
            <option value="5PM-6PM">5PM-6PM</option>
            <option value="6PM-7PM">6PM-7PM</option>
          </select>
        </div>
        <div>            
          <label for="new-type">Select Appointment Type:</label>
          <select id="new-type">
            <option value="online">Online</option>
            <option value="in-clinic">In-Clinic</option>
          </select>
        </div>           
        <div class="popup-buttons">
          <button class="btn-secondary" id="cancel-reschedule">Cancel</button>
          <button class="btn-primary" id="confirm-reschedule">Reschedule</button>
        </div>
        <button class="close-btn">✖</button>
      </div>
    </div>
  `;
  popupOverlay.innerHTML = rescheduleContent;

  // Handle Reschedule button click
  document.getElementById('confirm-reschedule').addEventListener('click', () => {
    const newDate = document.getElementById('new-date').value;
    const newTime = document.getElementById('new-time').value;
    const newType = document.getElementById('new-type').value;

    if (newDate && newTime && newType) {
      const oldDate = currentAppointment.classList[1]; // e.g., 'tuesday9'
      const oldTime = currentAppointment.getAttribute('data-time'); // e.g., '9:00 AM - 10:00 AM'

      const formattedOldTime = oldTime.replace(/:/g, '').replace(/ /g, '').replace('AM', 'am').replace('PM', 'pm');
      const oldSlotClass = oldDate + formattedOldTime.toLowerCase();

      // Remove the current appointment from the old slot
      currentAppointment.classList.remove(oldSlotClass);
      currentAppointment.classList.add('empty');
      currentAppointment.innerHTML = '';

      // Format new time string
      const newTimeParts = newTime.split('-');
      const hour = newTimeParts[0].replace(/\D/g, '').toLowerCase(); // Extract the hour from newTime (e.g., '9')

      // Format the new slot class
      const newSlotClass = `${newType} ${newDate}${hour}am`;

      // Find the new appointment slot
      const newAppointment = document.querySelector(`.appointment.${newDate}${hour}am`);

      if (newAppointment) {
        newAppointment.classList.remove('empty');
        newAppointment.classList.add(newType);
        newAppointment.setAttribute('data-title', currentAppointment.getAttribute('data-title'));
        newAppointment.setAttribute('data-time', newTime);
        newAppointment.setAttribute('data-location', currentAppointment.getAttribute('data-location'));
        newAppointment.innerHTML = `${newType.charAt(0).toUpperCase() + newType.slice(1)}`;
      }

      // Close the popup and show success message
      popupOverlay.innerHTML = `
        <div class="appointment-form-container">
          <div class="appointment-form">
            <h2>Reschedule Successful</h2>
            <p>The appointment has been successfully rescheduled.</p>
            <button class="close-btn">✖</button>
          </div>
        </div>
      `;

      popupOverlay.querySelector('.close-btn').addEventListener('click', () => {
        popupOverlay.style.display = 'none';
      });
    } else {
      alert('Please fill all the fields');
    }
  });
}







  // Close popup when clicking outside the content
  popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.style.display = 'none';
    }
  });
});
