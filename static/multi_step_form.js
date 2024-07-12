document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the multi-step form
    initMultiStepForm();

    // Event listener for form submission
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        if (validateForm()) {
            const formData = new FormData(event.target);

            try {
                const response = await fetch('/multi-step-form', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    // Redirect to the index page with a success parameter
                    window.location.href = '/?success=true';
                } else {
                    const result = await response.json();
                    alert(result.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit form');
            }
        }
    });

    // Add event listeners for blue dots to navigate steps
    document.querySelectorAll('.progress-step').forEach((dot, index) => {
        dot.addEventListener('click', () => {
            nextStep(index + 1);
        });
    });
});

function initMultiStepForm() {
    // Show the first step initially
    nextStep(1);
}

function nextStep(step) {
    // Validate current step before moving to the next
    if (step > 1 && !validateCurrentStep(step - 1)) return;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepElement => {
        stepElement.style.display = 'none';
    });

    // Show the current step
    document.getElementById('step-' + step).style.display = 'block';

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((indicator, index) => {
        if (index < step) {
            indicator.classList.add('active-indicator');
        } else {
            indicator.classList.remove('active-indicator');
        }
    });
}

function validateCurrentStep(currentStep) {
    let isValid = true;

    // Select inputs based on the current step
    let inputs = [];
    if (currentStep === 1) {
        inputs = ['first-name', 'surname'];
    } else if (currentStep === 2) {
        inputs = ['gender', 'height'];
    } else if (currentStep === 3) {
        inputs = ['age', 'weight'];
    } else if (currentStep === 4) {
        inputs = ['email'];
    } else if (currentStep === 5) {
        inputs = ['password', 'confirm-password'];
    }

    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            if (id === 'first-name' || id === 'surname') {
                if (!input.value || !/^[a-zA-Z]+$/.test(input.value)) {
                    input.style.borderColor = 'red';
                    input.placeholder = 'Invalid input';
                    input.value = '';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            } else if (id === 'email') {
                if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    input.style.borderColor = 'red';
                    input.placeholder = 'Invalid email';
                    input.value = '';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            } else if (id === 'gender') {
                if (!input.value) {
                    input.style.borderColor = 'red';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            } else if (id === 'height' || id === 'age' || id === 'weight') {
                if (!input.value || isNaN(input.value) || input.value <= 0) {
                    input.style.borderColor = 'red';
                    input.placeholder = 'Invalid input';
                    input.value = '';
                    isValid = false;
                } else {
                    input.style.borderColor = '';
                }
            } else if (id === 'password' || id === 'confirm-password') {
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                if (password !== confirmPassword) {
                    document.getElementById('confirm-password').style.borderColor = 'red';
                    document.getElementById('confirm-password').placeholder = 'Passwords do not match';
                    document.getElementById('confirm-password').value = '';
                    isValid = false;
                } else {
                    document.getElementById('confirm-password').style.borderColor = '';
                }
            }
        }
    });

    return isValid;
}

function validateForm() {
    // Validate all steps
    let isValid = true;
    for (let step = 1; step <= 5; step++) {
        if (!validateCurrentStep(step)) {
            isValid = false;
        }
    }
    return isValid;
}

function validatePasswords() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.style.borderColor = 'red';
        confirmPassword.placeholder = 'Passwords do not match';
        confirmPassword.value = '';
        return false;
    }

    // Proceed to submit the form
    if (password && confirmPassword) {
        document.getElementById('signup-form').submit();
    }
}

function getCurrentStep() {
    const steps = document.querySelectorAll('.form-step');
    for (let i = 0; i < steps.length; i++) {
        if (steps[i].style.display !== 'none') {
            return i + 1;
        }
    }
    return 1;
}
