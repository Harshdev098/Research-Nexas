document.addEventListener("DOMContentLoaded", function () {
    var currentStep = 1;
    showStep(currentStep);
  
    document.querySelectorAll(".next-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        if (currentStep < document.querySelectorAll(".form-step").length) {
          currentStep++;
          showStep(currentStep);
        }
      });
    });
  
    document.querySelectorAll(".prev-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });
    });
  
    function showStep(step) {
      document.querySelectorAll(".form-step").forEach(function (stepElement) {
        stepElement.style.display = "none";
      });
  
      document.getElementById("step" + step).style.display = "block";
    }
  
  });
  