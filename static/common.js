document.addEventListener('DOMContentLoaded', (event) => {
    // Handle success message display
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success) {
        const successMessage = document.getElementById('success-message');
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.opacity = 0;
        }, 3000);
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

