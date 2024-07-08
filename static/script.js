document.getElementById('fitnessForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
        if (!data[key]) {
            data[key] = [];
        }
        data[key].push(value);
    });

    // Prepare user message
    const userMessage = `
        Advice: ${data.advice.join(', ')}
        Food Preferences: ${data.food.join(', ') || 'None'}
        Exercise Preferences: ${data.exercise.join(', ') || 'None'}
    `;

    // Send the data to the server
    fetch('/generate-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_message: userMessage })
    })
    .then(response => response.json())
    .then(response => {
        if (response.plan) {
            const formattedPlan = breakLines(response.plan, 130); // Adjust maxLength here
            displayPlan(formattedPlan);
        } else {
            displayPlan('Failed to generate plan.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayPlan('An error occurred while generating the plan.');
    });
});

function breakLines(text, maxLength) {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine += word + ' ';
        }
    });

    if (currentLine.length > 0) {
        lines.push(currentLine.trim());
    }

    return lines.join('\n');
}

function displayPlan(plan) {
    const planContainer = document.getElementById('planContainer');
    planContainer.innerHTML = `<pre>${plan}</pre>`;
}
