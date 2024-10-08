// Show the active notification icon and display the dropdown
function show() {
    document.getElementById('firsticon').style.display = 'none'; // Hide the regular bell icon
    document.getElementById('secondicon').style.display = 'inline-block'; // Show the highlighted bell icon

    // Show notification dropdown
    document.getElementById('notificationDropdown').style.display = 'block';
}

// Hide the active notification icon and hide the dropdown
function hide() {
    document.getElementById('firsticon').style.display = 'inline-block'; // Show the regular bell icon
    document.getElementById('secondicon').style.display = 'none'; // Hide the highlighted bell icon

    // Hide notification dropdown
    document.getElementById('notificationDropdown').style.display = 'none';
}

// WebSocket or Mock for real-time notifications
let notificationCount = 3; // Initial count for notifications

// Function to simulate receiving new notifications
function receiveNotification(notification) {
    // Increment notification count
    notificationCount++;
    document.getElementById('notificationCount').innerText = notificationCount;

    // Add new notification to the dropdown list
    const notificationList = document.getElementById('notificationDropdown').querySelector('ul');
    const newNotification = document.createElement('li');
    newNotification.innerText = notification;
    notificationList.appendChild(newNotification);
}

// Example: Simulate receiving a new notification after 5 seconds
setTimeout(() => {
    receiveNotification('New project invite: Quantum Computing');
}, 5000);
