document.addEventListener('DOMContentLoaded', (event) => {
    // Event listener for the login form submission
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                window.location.href = '/?success=true';
            } else {
                const result = await response.json();
                const failMessage = document.getElementById('login-fail-message');
                failMessage.style.display = 'block';
                setTimeout(() => {
                    failMessage.style.opacity = 0;
                }, 3000);
                setTimeout(() => {
                    failMessage.style.display = 'none';
                }, 5000);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to log in');
        }
    });
});
