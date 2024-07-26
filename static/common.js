document.addEventListener('DOMContentLoaded', () => {
    // Handle success message display
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    if (success) {
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.classList.remove('hidden');
            successMessage.classList.add('visible');

            setTimeout(() => {
                successMessage.classList.remove('visible');
                successMessage.classList.add('fading');
            }, 3000);

            setTimeout(() => {
                successMessage.classList.remove('fading');
                successMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
