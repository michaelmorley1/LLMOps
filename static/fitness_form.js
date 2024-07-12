document.getElementById('fitnessForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const advice = formData.getAll('advice');
    const food = formData.getAll('food');
    const exercise = formData.getAll('exercise');

    const userMessage = `
        Advice: ${advice.join(', ')}
        Food Preferences: ${food.join(', ')}
        Exercise Preferences: ${exercise.join(', ')}
    `;

    const planContainer = document.getElementById('planContainer');
    const planText = document.getElementById('planText');
    const loader = document.getElementById('loader');

    planContainer.classList.add('loading'); // Add loading state
    planText.textContent = ''; // Clear previous content
    loader.style.display = 'block'; // Show the loader

    try {
        const response = await fetch('/generate-plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_message: userMessage }),
        });

        const data = await response.json();
        planText.textContent = data.plan;
        planContainer.classList.remove('loading'); // Remove loading state
        loader.style.display = 'none'; // Hide the loader
        planContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll into view
    } catch (error) {
        console.error('Error:', error);
        loader.style.display = 'none'; // Hide the loader in case of an error
        planText.textContent = 'Failed to generate plan. Please try again.';
    }
});
