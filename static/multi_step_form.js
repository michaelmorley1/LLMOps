document.addEventListener('DOMContentLoaded', () => {
    // Check if the form element exists before adding the event listener
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        // Event listener for form submission
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            clearErrors();
            if (validateForm()) {
                const formData = new FormData(event.target);

                try {
                    const response = await fetch('/multi-step-form', {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        // Redirect to the index page after successful signup
                        window.location.href = '/';
                    } else {
                        const result = await response.json();
                        displayError(result.error || 'Failed to sign up');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    displayError('Failed to sign up');
                }
            }
        });

        // Add event listeners for navigating steps
        document.querySelectorAll('.next-button').forEach((button) => {
            button.addEventListener('click', () => {
                const nextStepIndex = parseInt(button.getAttribute('data-next'), 10);
                nextStep(nextStepIndex);
            });
        });

        // Add event listeners for progress steps to navigate steps
        document.querySelectorAll('.progress-step').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                nextStep(index + 1);
            });
        });
    } else {
        console.warn('Signup form not found.');
    }
});

function displayError(message) {
    const errorField = document.getElementById('password-error');
    if (errorField) {
        errorField.textContent = message;
        errorField.style.display = 'block';
    }
}

function clearErrors() {
    const errorFields = document.querySelectorAll('.error-message');
    errorFields.forEach((field) => {
        field.textContent = '';
        field.style.display = 'none';
    });
}

function nextStep(step) {
    // Validate current step before moving to the next
    if (step > 1 && !validateCurrentStep(step - 1)) return;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepElement => {
        stepElement.classList.add('hidden');
    });

    // Show the current step
    document.getElementById('step-' + step).classList.remove('hidden');

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
