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
    planContainer.scrollIntoView({ behavior: 'smooth' }); // Scroll into view
});

document.addEventListener('DOMContentLoaded', (event) => {
    // Initialize the multi-step form
    initMultiStepForm();

    // Event listener for form submission
    document.getElementById('signup-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            const formData = new FormData(event.target);
            const data = {
                first_name: formData.get('first_name'),
                surname: formData.get('surname'),
                gender: formData.get('gender'),
                height: formData.get('height'),
                age: formData.get('age'),
                weight: formData.get('weight'),
                email: formData.get('email'),
                password: formData.get('password')
            };

            try {
                const response = await fetch('/multi-step-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message);
                } else {
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
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(stepElement => {
        stepElement.style.display = 'none';
    });

    // Show the current step
    document.getElementById('step-' + step).style.display = 'block';

    // Update progress bar
    document.querySelectorAll('.progress-bar .progress-step').forEach((indicator, index) => {
        if (index < step) {
            indicator.classList.add('active-indicator');
        } else {
            indicator.classList.remove('active-indicator');
        }
    });
}

function validateForm() {
    let isValid = true;

    // Validate first name and surname
    const firstName = document.getElementById('first-name');
    const surname = document.getElementById('surname');
    if (!firstName.value || !/^[a-zA-Z]+$/.test(firstName.value)) {
        firstName.style.borderColor = 'red';
        firstName.placeholder = 'Invalid input';
        firstName.value = '';
        isValid = false;
    } else {
        firstName.style.borderColor = '';
    }
    if (!surname.value || !/^[a-zA-Z]+$/.test(surname.value)) {
        surname.style.borderColor = 'red';
        surname.placeholder = 'Invalid input';
        surname.value = '';
        isValid = false;
    } else {
        surname.style.borderColor = '';
    }

    // Validate gender
    const gender = document.getElementById('gender');
    if (!gender.value) {
        gender.style.borderColor = 'red';
        isValid = false;
    } else {
        gender.style.borderColor = '';
    }

    // Validate height, age, weight
    const height = document.getElementById('height');
    const age = document.getElementById('age');
    const weight = document.getElementById('weight');
    if (!height.value || isNaN(height.value)) {
        height.style.borderColor = 'red';
        height.placeholder = 'Invalid input';
        height.value = '';
        isValid = false;
    } else {
        height.style.borderColor = '';
    }
    if (!age.value || isNaN(age.value)) {
        age.style.borderColor = 'red';
        age.placeholder = 'Invalid input';
        age.value = '';
        isValid = false;
    } else {
        age.style.borderColor = '';
    }
    if (!weight.value || isNaN(weight.value)) {
        weight.style.borderColor = 'red';
        weight.placeholder = 'Invalid input';
        weight.value = '';
        isValid = false;
    } else {
        weight.style.borderColor = '';
    }

    // Validate email
    const email = document.getElementById('email');
    if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = 'red';
        email.placeholder = 'Invalid email';
        email.value = '';
        isValid = false;
    } else {
        email.style.borderColor = '';
    }

    // Validate passwords
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    if (!password.value) {
        password.style.borderColor = 'red';
        password.placeholder = 'Password required';
        password.value = '';
        isValid = false;
    } else {
        password.style.borderColor = '';
    }
    if (!confirmPassword.value || password.value !== confirmPassword.value) {
        confirmPassword.style.borderColor = 'red';
        confirmPassword.placeholder = 'Passwords do not match';
        confirmPassword.value = '';
        isValid = false;
    } else {
        confirmPassword.style.borderColor = '';
    }

    return isValid;
}

function validatePasswords() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        confirmPassword.style.borderColor = 'red';
        confirmPassword.placeholder = 'Passwords do not match';
        return;
    }

    // Proceed to submit the form
    document.getElementById('signup-form').submit();
}
