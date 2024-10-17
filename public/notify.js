// script.js

// Sample notification data
const notifications = [
    { message: "New research paper on AI published.", time: new Date().toLocaleTimeString() },
    { message: "New comment on your research article.", time: new Date().toLocaleTimeString() },
    { message: "Your research submission has been reviewed.", time: new Date().toLocaleTimeString() }
];

// Function to display notifications
function displayNotification(notification) {
    const notificationsContainer = document.getElementById('notifications');
    const notificationDiv = document.createElement('div');
    notificationDiv.classList.add('notification');
    notificationDiv.innerHTML = `
        <p>${notification.message}</p>
        <span class="notification-time">${notification.time}</span>
    `;
    notificationsContainer.prepend(notificationDiv); // Add new notifications to the top
}

// Simulate receiving notifications every 5 seconds
setInterval(() => {
    const randomIndex = Math.floor(Math.random() * notifications.length);
    displayNotification(notifications[randomIndex]);
}, 5000);

// Clear notifications
document.getElementById('clear-notifications').addEventListener('click', () => {
    const notificationsContainer = document.getElementById('notifications');
    notificationsContainer.innerHTML = ''; // Clear all notifications
});
