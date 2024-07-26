document.addEventListener('DOMContentLoaded', (event) => {
    // Hide success message by default
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'none';
    }

    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            const response = await fetch('/sign-up', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Redirect or show success message
                window.location.href = '/?success=true';
            } else {
                // Attempt to parse the response as JSON to display an error message
                try {
                    const result = await response.json();
                    displayFailMessage(result.error || 'Failed to log in');
                } catch (err) {
                    // If response is not JSON, show a generic error message
                    displayFailMessage('Failed to log in');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            displayFailMessage('Failed to log in');
        }
    });

    // Check for a success parameter in the URL and show the success message if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showSuccessMessage('Successfully signed up! Login now.');
    }
});

function displayFailMessage(message) {
    const failMessage = document.getElementById('login-fail-message');
    failMessage.textContent = message;
    failMessage.style.display = 'block';
    failMessage.style.opacity = 1;
    
    setTimeout(() => {
        failMessage.style.opacity = 0;
    }, 3000);
    setTimeout(() => {
        failMessage.style.display = 'none';
    }, 5000);
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.opacity = 1;

    setTimeout(() => {
        successMessage.style.opacity = 0;
    }, 3000);
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}
