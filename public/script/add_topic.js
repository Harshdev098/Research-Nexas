document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("researchForm");
  const notification = document.getElementById("notification");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (form.checkValidity()) {
      // Show notification
      notification.classList.remove("hidden");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 5000);

      // Reset the form
      form.reset();
    } else {
      // If fields are missing, use HTML5 required validation
      form.reportValidity();
    }
  });
});
