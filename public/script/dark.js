const toggleButton = document.getElementById('toggle-button');
const body = document.body;

toggleButton.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
});