// slider script
let slider = document.querySelector(".slider .list");
let items = document.querySelectorAll(".slider .list .item");
let next = document.getElementById("next");
let prev = document.getElementById("prev");
let dots = document.querySelectorAll(".slider .dots li");

let lengthItems = items.length - 1;
let active = 0;
next.onclick = function () {
  active = active + 1 <= lengthItems ? active + 1 : 0;
  reloadSlider();
};
prev.onclick = function () {
  active = active - 1 >= 0 ? active - 1 : lengthItems;
  reloadSlider();
};
let refreshInterval = setInterval(() => {
  next.click();
}, 3000);
function reloadSlider() {
  slider.style.left = -items[active].offsetLeft + "px";
  //
  let last_active_dot = document.querySelector(".slider .dots li.active");
  last_active_dot.classList.remove("active");
  dots[active].classList.add("active");

  clearInterval(refreshInterval);
  refreshInterval = setInterval(() => {
    next.click();
  }, 3000);
}

dots.forEach((li, key) => {
  li.addEventListener("click", () => {
    active = key;
    reloadSlider();
  });
});
window.onresize = function (event) {
  reloadSlider();
};

//about us animation script

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show"); //about us section animation
      entry.target.classList.add("fadein_text"); //text animation
      entry.target.classList.add("show1"); //box animation
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.remove("fadein_text");
      entry.target.classList.remove("show1");
      // entry.target.classList.remove('animated-box1')
    }
  });
});
const about = document.querySelectorAll(".about");
about.forEach((el) => observer.observe(el));
const para = document.querySelectorAll(".fadein_text");
para.forEach((el) => observer.observe(el));
const hidden = document.querySelectorAll(".show");
hidden.forEach((el) => observer.observe(el));

// join us section animation

const observer1 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated-box1"); //join us section animation
    } else {
      entry.target.classList.remove("animated-box1");
    }
  });
});
const join_boxes = document.querySelectorAll(".join_animation1");
join_boxes.forEach((el) => observer1.observe(el));

const observer2 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated-box2"); //join us section animation
    } else {
      entry.target.classList.remove("animated-box2");
    }
  });
});
const join_boxes2 = document.querySelectorAll(".join_animation2");
join_boxes2.forEach((el) => observer2.observe(el));

// premium section animation

const observer3 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("premium_animation1");
    } else {
      entry.target.classList.remove("premium_animation1");
    }
  });
});
const premium1 = document.querySelectorAll(".premium_animation1");
premium1.forEach((el) => observer3.observe(el));

const observer4 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("premium_animation2");
    } else {
      entry.target.classList.remove("premium_animation2");
    }
  });
});
const premium2 = document.querySelectorAll(".premium_animation2");
premium2.forEach((el) => observer4.observe(el));

// student section animation

// const observer5=new IntersectionObserver((entries)=>{
//     entries.forEach((entry)=>{
//         if(entry.isIntersecting){
//             entry.target.classList.add('img_animation1')
//         }
//         else{
//             entry.target.classList.remove('img_animation1')
//         }
//     })
// })
// const img_animation1=document.querySelectorAll('.img_container');
// img_animation1.forEach((el)=>observer5.observe(el))

// const observer11=new IntersectionObserver((entries)=>{
//     entries.forEach((entry)=>{
//         if(entry.isIntersecting){
//             entry.target.classList.add('img_animation2')
//         }
//         else{
//             entry.target.classList.remove('img_animation2')
//         }
//     })
// })
// const img_animation2=document.querySelectorAll('.img_container');
// img_animation2.forEach((el)=>observer11.observe(el))

// const observer10=new IntersectionObserver((entries)=>{
//     entries.forEach((entry)=>{
//         if(entry.isIntersecting){
//             entry.target.classList.add('img_animation3')
//         }
//         else{
//             entry.target.classList.remove('img_animation3')
//         }
//     })
// })
// const img_animation3=document.querySelectorAll('.img_container');
// img_animation3.forEach((el)=>observer10.observe(el))

// const observer9=new IntersectionObserver((entries)=>{
//     entries.forEach((entry)=>{
//         if(entry.isIntersecting){
//             entry.target.classList.add('img_animation4')
//         }
//         else{
//             entry.target.classList.remove('img_animation4')
//         }
//     })
// })
// const img_animation4=document.querySelectorAll('.img_container');
// img_animation4.forEach((el)=>observer9.observe(el))

// last section animation

const observer7 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("last_img_animation1");
    } else {
      entry.target.classList.remove("last_img_animation1");
    }
  });
});
const last1 = document.querySelectorAll(".last_img_animation1");
last1.forEach((el) => observer7.observe(el));

const observer8 = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("last_img_animation2");
    } else {
      entry.target.classList.remove("last_img_animation2");
    }
  });
});
const last2 = document.querySelectorAll(".last_img_animation2");
last2.forEach((el) => observer8.observe(el));

// Get the button
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


//logic for the students section  explore button-------
// Initially hide all the additional image boxes
document.addEventListener("DOMContentLoaded", function () {
  const imageBoxes = document.querySelectorAll(".image_boxes");
  for (let i = 3; i < imageBoxes.length; i++) {
      imageBoxes[i].style.display = "none";  // Hide boxes after the first 3
  }

  // Add event listener to the "Explore" button
  const exploreButton = document.querySelector(".explore-btn");  // Ensure this class is set to your Explore button
  exploreButton.addEventListener("click", function () {
      let hiddenCount = 0;

      // Show the next 3 hidden image boxes
      for (let i = 3; i < imageBoxes.length; i++) {
          if (imageBoxes[i].style.display === "none" && hiddenCount < 4) {
              imageBoxes[i].style.display = "block";
              hiddenCount++;
          }
      }

      // Optionally, hide the explore button if all boxes are visible
      const remainingHidden = Array.from(imageBoxes).filter(box => box.style.display === "none").length;
      if (remainingHidden === 0) {
          exploreButton.style.display = "none";  // Hide the button if no more boxes are hidden
      }
  });
});


// Optional: You can add an event listener to dynamically load additional details when clicking the "Learn More" button.
const learnMoreButtons = document.querySelectorAll('.learn-more');

learnMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        alert('More details about this stakeholder will be revealed soon!');
    });
});

document.addEventListener('DOMContentLoaded', function() {
  // Check if the user has already subscribed
  if (!localStorage.getItem('subscribed')) {
    document.getElementById('popup-nl').style.display = 'flex'; // Show the popup immediately
  }

  // Close the pop-up when the user clicks the close button
  document.querySelector('.close-nl').addEventListener('click', function() {
      document.getElementById('popup-nl').style.display = 'none';
  });

  // Handle form submission
  document.getElementById('emailForm-nl').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('email-nl').value;
    console.log("Email ID",email);
    if (email) {
        try {
            const response = await fetch('/api/newsLetter/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(data.message);
                document.getElementById('popup-nl').style.display = 'none';
                localStorage.setItem('subscribed', 'true');
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    }
});
    const trustedDomains = [
      'gmail.com',
      'outlook.com',
      'yahoo.com',
      'protonmail.com',
      'icloud.com',
      'tutanota.com',
      'hotmail.com',
      'live.com',
      'mail.com',
      'zoho.com',
      'gmx.com',
      'aol.com',
      'fastmail.com',
      'yandex.com',
      '*.edu',          // Educational institutions
      '*.ac.uk'         // UK universities
  ];

  function validateEmail(email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
      const domain = email.split('@')[1];

      return (
          emailPattern.test(email) && 
          trustedDomains.some((trusted) => 
              trusted.includes('*') ? domain.endsWith(trusted.slice(1)) : domain === trusted
          )
      );
  }

  document.getElementById('emailForm-nl').addEventListener('submit', function(event) {
      event.preventDefault();

      const email = document.getElementById('email-nl').value.trim();

      // Trusted email validation
      if (!validateEmail(email)) {
          alert('Please enter a valid email address from a trusted provider.');
          return;
      }

      if (email) {
          alert(`Your email ID ${email} has been registered successfully for the newsletter.`);
          document.getElementById('popup-nl').style.display = 'none'; // Hide the popup

          // Set the subscribed flag in localStorage
          localStorage.setItem('subscribed', 'true');
      }
  });

  // Handle "No thanks" link
  document.querySelector('.no-thanks-nl').addEventListener('click', function(event) {
      event.preventDefault();
      document.getElementById('popup-nl').style.display = 'none';
  });
feedback
});

 
function handleSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Show the thank-you popup
  document.getElementById('thank-you-popup').style.display = 'flex';

  // Optionally, reset the form
  document.getElementById('feedback-form').reset();
}

function closePopup() {
  document.getElementById('thank-you-popup').style.display = 'none';
}


 main
