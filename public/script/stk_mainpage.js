document.addEventListener("DOMContentLoaded", function () {
  var currentStep = 1;
  showStep(currentStep);

  document.querySelectorAll(".next-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      if (currentStep < document.querySelectorAll(".form-step").length) {
        const curStepElement = document.querySelector(`input[name="step${currentStep}"]:checked`);
        if (!curStepElement || curStepElement.value === undefined) {
          const para = document.createElement('p');
          para.textContent = "*require filled";
          para.style.color='red'
          const element=document.getElementById(`step${currentStep}`)
          element.appendChild(para);
          setTimeout(()=>{
            para.style.display='none'
          },3000)
        } else {
          currentStep++;
          showStep(currentStep);
        }
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

const set = async () => {
  const level1 = document.querySelector('input[name="step1"]:checked')
  const level2 = document.querySelector('input[name="step2"]:checked')
  const level3 = document.querySelector('input[name="step3"]:checked')
  const level4 = document.querySelector('input[name="step4"]:checked')
  const level5 = document.querySelector('input[name="step5"]:checked')
  const topic = document.querySelector('input[type="text"]')
  const value1 = level1.value
  const value2 = level2.value
  const value3 = level3.value
  const value4 = level4.value
  const value5 = level5 ? level5.value : undefined;
  const topicval = topic ? topic.value : undefined;
  console.log(value1, value2, value3, value4, value5, topicval)
  const token = localStorage.getItem('accessToken');
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  const response = await fetch('http://localhost:3000/evaluation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ value1, value2, value3, value4, value5, topicval }),
  })
  if (response.ok) {
    console.log('Evaluation Criteria has been set')
    const step5 = document.getElementById('step5')
    const para = document.createElement('p')
    para.textContent = "Evaluation Criteria has been set"
    step5.appendChild(para)
    const submit = document.querySelectorAll('button')
    submit.disabled = true
    setTimeout(() => {
      para.style.display = 'none'
    }, 3000)
  }
  else if (response.status = 401) {
    console.log("Criteria Already set")
    const step5 = document.getElementById('step5')
    const para = document.createElement('p')
    para.textContent = "Criteria already set"
    step5.appendChild(para)
    setTimeout(() => {
      para.style.display = 'none'
    }, 3000)
  }
  else {
    console.log("An error occured")
    const step5 = document.getElementById('step5')
    const para = document.createElement('p')
    para.textContent = "An error occured"
    step5.appendChild(para)
    setTimeout(() => {
      para.style.display = 'none'
    }, 3000)
  }
}

