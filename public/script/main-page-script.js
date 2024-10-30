function show() {
  document.getElementById("firsticon").style.display = "none";
  document.getElementById("secondicon").style.display = "inline-block";
}
function hide() {
  document.getElementById("firsticon").style.display = "inline-block";
  document.getElementById("secondicon").style.display = "none";
}

const scrollTopBtn = document.getElementById("scrollToTop");
scrollTopBtn.style.setProperty('visibility', 'hidden', 'important');

window.addEventListener('scroll', function() {

    if (window.scrollY > 100) {
        scrollTopBtn.style.setProperty('visibility', 'visible', 'important');
    } else {
        scrollTopBtn.style.setProperty('visibility', 'hidden', 'important');
    }
});

// Scroll to the top when the button is clicked
scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
