function show() {
  document.getElementById("firsticon").style.display = "none";
  document.getElementById("secondicon").style.display = "inline-block";
}
function hide() {
  document.getElementById("firsticon").style.display = "inline-block";
  document.getElementById("secondicon").style.display = "none";
}

let scrollToTopButton = document.getElementById("scrollToTop");

// Show the button when the user scrolls down 100px from the top
window.onscroll = function () {
  if (
    document.body.scrollTop > 100 ||
    document.documentElement.scrollTop > 100
  ) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
};

// Scroll to the top when the button is clicked
scrollToTopButton.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
