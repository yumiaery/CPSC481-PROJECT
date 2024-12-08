# CalgaryCare

This is our project for CPSC 481: Human-Computer Interaction course. We are Group 4 of Tutorial 7. This project is a web-based **appointment scheduling system** designed for front-line staff in a medical clinic setting to manage and schedule patient appointments efficiently.

---

## Table of Contents
- [Access and Usage](#access-and-usage)
  - [How to Access](#how-to-access)
  - [How to Use](#how-to-use)
- [Platform and Display Requirements](#platform-and-display-requirements)

---

## Access and Usage

### How to Access:
1. Open your preferred browser (**Google Chrome** recommended).
2. Navigate to the hosted application using the provided URL: http://ec2-44-243-40-96.us-west-2.compute.amazonaws.com (**make sure to keep it http and not https**)
3. Login credentials:
   Currently we have 3 users. You can use either one of these 3 credentials to log in to the system.
   
- **User 1**:
  **Username**: RebeccaRebeccason
  **Password**: password1

- **User 2**:
  **Username**: NellyNellyson
  **Password**: password2

- **User 3**:
  **Username**: DavidSmith
  **Password**: password3

 ### How to Use:
 1. **Access the System**:
   - Navigate to the hosted application URL: http://ec2-44-243-40-96.us-west-2.compute.amazonaws.com .
   - Log in using one of the 3 user credentials provided above.

 2. **Shift between Daily/Weekly/Monthly view**:
   - You can switch through the 3 views by clicking the **DAILY**, **WEEKLY** and **MONTHLY** tabs.
     
 3. **Daily View**:
   - Use the "Daily" tab to view and manage appointments for a single day.
     
 4. **Weekly View**:
   - Switch to the "Weekly" tab to see and manage a week-long overview of appointments.
   - You can click on the Date headers to take you to the daily view of that day.

 5. **Monthly View**:
   - Use the "Monthly" tab to access a calendar-style overview.
   - You can click on a date to take you to the daily view of that day.
     
 6. **Filtering**:
   - Use the "Filters" dropdown to filter appointments by specific doctors.
   - You can also view the availability of a selected doctor by observing their schedule in the calendar view, which highlights all booked and free time slots.
     
 7. **Add Appointment**:
   - You can add an appointment by selecting a free time slot on the calendar and filling in the required details.
   - This allows you to book a slot for a patient with the desired doctor at a specific time.
   - You can do this only in the daily or weekly view, since you can view what time you are booking it for
   
   ### Detailed Steps:

     - **Daily View**:
      - Step 1: Click the arrow buttons to choose a day to book an appointment on.
      - Step 2: In the "Filters" dropdown, choose a doctor you wish to book an appointment with.
      - Step 3: Click on a free and desired time slot, and the "Add Appointment" form will appear.
      - Step 4: The date, time, and doctor information will already be set.
        - Enter other details and click **Confirm** to book the appointment.
        - Alternatively, clicking **Cancel** will discard the form.
    
    - **Weekly View**:
      - Step 1: Click the arrow buttons to choose a week to book an appointment on.
      - Step 2: In the "Filters" dropdown, choose a doctor you wish to book an appointment with.
      - Step 3: Click on a free and desired time slot, and the "Add Appointment" form will appear.
      - Step 4: The date, time, and doctor information will already be set.
        - Enter other details and click **Confirm** to book the appointment.
        - Alternatively, clicking **Cancel** will discard the form.
    
    - **Monthly View**:
      - Step 1: In the "Filters" dropdown, choose a doctor you wish to book an appointment with.
      - Step 2: Click on a specific day, and it will redirect you to the **Daily View** for that date.
      - Step 3: Follow the steps for **Daily View** mentioned above to add an appointment.
 

 8. **Reschedule Appointment**:
   - Easily reschedule an existing appointment by selecting a new available time slot.
   - Rescheduling helps accommodate patient or doctor availability changes efficiently.

   ### Detailed Steps:

    - **Daily View (Best for rescheduling appointment in a day for time changes)**:
      - Step 1: Click the arrow buttons to find the day of the booked appointment you wish to reschedule.
      - Step 2: Click on the appointment you wish to reschedule.
      - Step 3: In the "Appointment details" form that pops up, scroll down to see the **Reschedule" button** then click it.
      - Step 4: Click on the desired time slot in that day to reschedule to (cannot move to other day's view).
      - Step 5: You will see a confirmation of the rescheduling and see the appointment moved to the desired time slot.
    
    - **Weekly View (Best for rescheduling appointment in a day for time changes)**:
      - Step 1: Click the arrow buttons to find the week of the booked appointment you wish to reschedule.
      - Step 2: Click on the appointment you wish to reschedule.
      - Step 3: In the "Appointment details" form that pops up, scroll down to see the **Reschedule" button** then click it.
      - Step 4: Click on the desired time slot in any time and day of that week to reschedule to (cannot move to other week's view).
      - Step 5: You will see a confirmation of the rescheduling and see the appointment moved to the desired time slot.
    
    - **Monthly View**:
      - You cannot reschedule an appointment in this view. Either click on a date to move to that day/s daily view and reschedule an appointment, or move to weekly view, find the appointment and then reschedule it.

 9. **Cancel Appointment**:
   - Appointments can be canceled if they are no longer required.
   - The cancellation is logged, and the time slot becomes available for booking by others.
   - A confirmation step prevents accidental cancellations.
     
   ### Detailed Steps:

    - **Daily View**:
      - Step 1: Click the arrow buttons to find the day of the booked appointment you wish to cancel.
      - Step 2: Click on the appointment you wish to cancel.
      - Step 3: In the "Appointment details" form that pops up, scroll down to see the **Cancel Appointment** button, then click it.
      - Step 4: A confirmation popup will come up.
        - Click on **Cancel Appointment** to cancel the desired appointment.
        - Alternatively, clicking **Go Back** will take you back to the "Appointment Details" page. 
    
    - **Weekly View (Best for rescheduling appointment in a day for time changes)**:
      - Step 1: Click the arrow buttons to find the week of the booked appointment you wish to cancel.
      - Step 2: Click on the appointment you wish to cancel.
      - Step 3: In the "Appointment details" form that pops up, scroll down to see the **Cancel Appointment** button, then click it.
      - Step 4: A confirmation popup will come up.
        - Click on **Cancel Appointment** to cancel the desired appointment.
        - Alternatively, clicking **Go Back** will take you back to the "Appointment Details" page.
    
    - **Monthly View**:
      - Step 1: Click the arrow buttons to find the month of the booked appointment you wish to cancel.
      - Step 2: Click on the appointment you wish to cancel.
      - Step 3: In the "Appointment details" form that pops up, scroll down to see the **Cancel Appointment** button, then click it.
      - Step 4: A confirmation popup will come up.
        - Click on **Cancel Appointment** to cancel the desired appointment.
        - Alternatively, clicking **Go Back** will take you back to the "Appointment Details" page.
     
10. **Edit Details**:
    - This is for the use case that either patient name was enetered wrong, or appointment type is changed, or nurse/doctor has notes to add on before/after appointment and to track the status of the appointment.
    - Basically not for changing appointment date, time or doctor.
      
    ### Detailed Steps (Same for all view):

      - Step 1: Click the desired appointment whose details you wish to view.
      - Step 2: Click on the pencil icon to enable editing mode, click again to disable editing mode.
      - Step 4: Once done editinng the desired details
        - Click on **Confirm Changes** to save the changes.
        - Alternatively, clicking **Discard Changes** to trash the changes u made and keep the details as is.   
    
12. **Appointment Details**:
   - Click a booked appointment to view its details in a pop-up window.
   - Options for editing, rescheduling or canceling will be available as mentioned in the steps above.

12. **Search Patient**:
   - You can search a patient with a name in the Search bar at the top left of the page.

---

## Platform and Display Requirements

- **Operating Systems**:
  - Windows 11
- **Browsers**:
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge
- **Device Compatibility**:
  - A regular desktop or laptop display.

---
