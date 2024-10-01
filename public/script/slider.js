(function() {
    const slider = document.querySelector('.slider .list');
    const images = document.querySelectorAll('.slider .item');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const dots = document.querySelectorAll('.dots li');

    console.log(images);

    let currentIndex = 0;
    let imageWidth = images[0].clientWidth; 

    window.addEventListener('resize', () => {
        imageWidth = images[0].clientWidth;
        updateSliderPosition();
    });

    function updateSliderPosition() {
        slider.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        updateDots();
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = images.length - 1; 
        }
        updateSliderPosition();
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; 
        }
        updateSliderPosition();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateSliderPosition();
        });
    });
})();
