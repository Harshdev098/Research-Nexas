// Fetch user's badges
function fetchBadges(userId) {
    fetch(`/badges/${userId}`)
      .then(response => response.json())
      .then(badges => {
        const badgeContainer = document.getElementById('badge-container');
        badgeContainer.innerHTML = '';
        
        badges.forEach(badge => {
          const badgeElement = document.createElement('div');
          badgeElement.classList.add('badge');
          badgeElement.innerHTML = `
            <h3>${badge.name}</h3>
            <p>${badge.description}</p>
            <small>Earned on: ${new Date(badge.earned_at).toLocaleDateString()}</small>
          `;
          badgeContainer.appendChild(badgeElement);
        });
      })
      .catch(error => console.error('Error fetching badges:', error));
  }
  
  // Replace with actual userId
  fetchBadges(1);
  