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
                window.location.href = '/profile';
            } else {
                const result = await response.json();
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to log in');
        }
    });
});
