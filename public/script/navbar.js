const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".overlay");

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

function toggleMobileMenu() {
    mobileMenu.classList.toggle("mobile-menu_open");
    overlay.classList.toggle("overlay_visible");
}

document.addEventListener("touchstart", function(event) {
    initialPoint = event.changedTouches[0];
});

document.addEventListener("touchend", function(event) {
    finalPoint = event.changedTouches[0];
    let xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX),
        yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);

    if (xAbs > 120 || yAbs > 120) {
        if (xAbs > yAbs) {
            if (finalPoint.pageX < initialPoint.pageX) {
                // Swipe left
                mobileMenu.classList.remove("mobile-menu_open");
                overlay.classList.remove("overlay_visible");
            } else {
                // Swipe right
                mobileMenu.classList.add("mobile-menu_open");
                overlay.classList.add("overlay_visible");
            }
        }
    }
});

overlay.addEventListener("click", function() {
    mobileMenu.classList.remove("mobile-menu_open");
    overlay.classList.remove("overlay_visible");
});
