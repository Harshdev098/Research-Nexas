const newTopics = [
  {
    id: 1,
    name: "John Doe",
    topic: "AI in Healthcare",
    description: "Exploring AI applications in modern healthcare.",
  },
  {
    id: 2,
    name: "Jane Smith",
    topic: "Quantum Computing",
    description: "Introduction to the basics of quantum computing.",
  },
  {
    id: 3,
    name: "Samuel Lee",
    topic: "Blockchain for Finance",
    description: "An analysis of blockchain technology in finance.",
  },
];

const approvedTopics = [];

document.addEventListener("DOMContentLoaded", () => {
  const newTopicsContainer = document.getElementById("newTopics");
  const approvedTopicsContainer = document.getElementById("approvedTopics");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const approveBtn = document.getElementById("approveBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  // Display initial topic cards
  displayTopics();

  function displayTopics() {
    newTopicsContainer.innerHTML = newTopics
      .map(
        (topic) => `
          <div class="topic-card">
             <h4>${topic.topic}</h4>
             <button class="view-btn" onclick="openModal(${topic.id})">View</button>
          </div>
       `
      )
      .join("");

    approvedTopicsContainer.innerHTML = approvedTopics
      .map(
        (topic) => `
          <div class="topic-card">
             <h4>${topic.topic}</h4>
          </div>
       `
      )
      .join("");
  }

  function approveTopic() {
    const topicId = +approveBtn.dataset.topicId;
    const topicIndex = newTopics.findIndex((t) => t.id === topicId);
    if (topicIndex !== -1) {
      approvedTopics.push(newTopics[topicIndex]);
      newTopics.splice(topicIndex, 1);
      displayTopics();
    }
    modal.style.display = "none";
  }

  closeModal.addEventListener("click", () => (modal.style.display = "none"));
  cancelBtn.addEventListener("click", () => (modal.style.display = "none"));
  approveBtn.addEventListener("click", approveTopic);
});

// Move openModal function outside to make it global
function openModal(topicId) {
  const topic = newTopics.find((t) => t.id === topicId);
  document.getElementById("studentName").innerText = topic.name;
  document.getElementById("topicTitle").innerText = topic.topic;
  document.getElementById("topicDescription").innerText = topic.description;
  document.getElementById("approveBtn").dataset.topicId = topicId;
  document.getElementById("modal").style.display = "flex";
}
