document.addEventListener('DOMContentLoaded', () => {
    const fitnessForm = document.getElementById('fitnessForm');
    const signupLoginBtn = document.getElementById('signup-login-btn');

    if (fitnessForm) {
        // Initialize the multi-step form
        initMultiStepForm();

        // Event listener for form submission
        fitnessForm.addEventListener('submit', async function(e) {
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

        // Add event listeners for navigation steps
        document.querySelectorAll('.next-btn').forEach(button => {
            button.addEventListener('click', () => {
                const nextStepIndex = parseInt(button.getAttribute('data-next'), 10);
                nextStep(nextStepIndex);
            });
        });

        document.querySelectorAll('.progress-step').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                nextStep(index + 1);
            });
        });
    } else if (signupLoginBtn) {
        // If the signup/login button is present, the user is not logged in
        signupLoginBtn.addEventListener('click', () => {
            window.location.href = '/sign-up';
        });
    }
});

function initMultiStepForm() {
    nextStep(1); // Start with the first step
}

function nextStep(step) {
    // Validate current step before moving to the next if moving forward
    const currentStep = getCurrentStep();
    if (step > currentStep && !validateCurrentStep(currentStep)) return;

    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepElement => {
        stepElement.classList.add('form-step-hidden');
    });

    // Show the selected step
    document.getElementById('step-' + step).classList.remove('form-step-hidden');

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

    let inputs = [];
    if (currentStep === 1) {
        inputs = ['advice'];
    } else if (currentStep === 2) {
        inputs = ['food'];
    } else if (currentStep === 3) {
        inputs = ['exercise'];
    }

    inputs.forEach(id => {
        const input = document.querySelector(`input[name="${id}"]:checked`);
        if (!input) {
            document.querySelectorAll(`input[name="${id}"]`).forEach(item => {
                item.parentElement.classList.add('invalid');
            });
            isValid = false;
        } else {
            document.querySelectorAll(`input[name="${id}"]`).forEach(item => {
                item.parentElement.classList.remove('invalid');
            });
        }
    });

    return isValid;
}

function getCurrentStep() {
    const steps = document.querySelectorAll('.form-step');
    for (let i = 0; i < steps.length; i++) {
        if (!steps[i].classList.contains('form-step-hidden')) {
            return i + 1;
        }
    }
    return 1;
}
