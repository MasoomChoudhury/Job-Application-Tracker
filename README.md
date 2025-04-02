# Job Application Tracker

This is a simple web app I built to help keep track of job applications. It's all client-side, meaning it runs just in the browser!

## How it Works

*   **Add Applications:** There's a form to enter details like company name, position, date applied, and status.
*   **Track Applications:** Shows a list of all the jobs you've added.
*   **Update Status:** You can change the status of an application directly from the list.
*   **Delete:** Remove applications you don't need anymore.
*   **Follow-up Reminder:** If you set a follow-up date, the application gets highlighted yellow when it's close!
*   **Export:** You can download your application list as a CSV file.
*   **Saves Data:** Uses the browser's `localStorage` so your data doesn't disappear when you close the tab.
*   **Simple Navigation:** Buttons at the top let you switch between viewing the list and adding a new application.

## What I Learned Building This

*   **HTML Structure:** Setting up the basic layout with forms, lists (`div`s), buttons, and select dropdowns.
*   **CSS Styling:** Making it look okay using Flexbox/Grid for layout, styling form elements, and adding basic responsiveness with media queries. Also learned how to use Google Fonts.
*   **JavaScript DOM Manipulation:** Getting form values, creating new HTML elements (`div`s for the job list), and updating the page when things change (like adding or deleting an application).
*   **Event Handling:** Making buttons and dropdowns actually *do* things when clicked or changed (`addEventListener`).
*   **localStorage:** Figuring out how to save the application data (as a JSON string) in the browser so it persists.
*   **Basic Data Management:** Working with arrays of objects in JavaScript to store, add, update, and delete the application data.
*   **CSV Export:** Generating a CSV file from the data and triggering a download.

It was a good exercise in putting HTML, CSS, and Vanilla JavaScript together to make something useful!
