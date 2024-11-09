document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/paper_matching/recommendations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming you store the access token in local storage
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const recommendations = await response.json();
        displayRecommendations(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
});

function displayRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendations-container');
    recommendationsContainer.innerHTML = ''; // Clear any existing content

    if (recommendations.length === 0) {
        recommendationsContainer.innerHTML = '<p>No recommendations available.</p>';
        return;
    }

    recommendations.forEach(({ paper, similarity }) => {
        const paperElement = document.createElement('div');
        paperElement.classList.add('recommendation');
        paperElement.innerHTML = `
            <h3>${paper.filename}</h3>
            <p>Similarity Score: ${similarity.toFixed(2)}</p>
            <a href="${paper.filepath}" target="_blank">View Paper</a>
        `;
        recommendationsContainer.appendChild(paperElement);
    });
}