document.addEventListener('DOMContentLoaded', () => {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');

    const fullName = document.getElementById('full-name');
    const editFullName = document.getElementById('edit-full-name');

    const gender = document.getElementById('gender');
    const editGender = document.getElementById('edit-gender');

    const height = document.getElementById('height');
    const editHeight = document.getElementById('edit-height');

    const age = document.getElementById('age');
    const editAge = document.getElementById('edit-age');

    const weight = document.getElementById('weight');
    const editWeight = document.getElementById('edit-weight');

    const email = document.getElementById('email');
    const editEmail = document.getElementById('edit-email');

    editButton.addEventListener('click', () => {
        editButton.style.display = 'none';
        saveButton.style.display = 'inline-block';

        fullName.style.display = 'none';
        editFullName.style.display = 'block';

        gender.style.display = 'none';
        editGender.style.display = 'block';

        height.style.display = 'none';
        editHeight.style.display = 'block';

        age.style.display = 'none';
        editAge.style.display = 'block';

        weight.style.display = 'none';
        editWeight.style.display = 'block';

        email.style.display = 'none';
        editEmail.style.display = 'block';
    });

    saveButton.addEventListener('click', async () => {
        const data = {
            first_name: editFullName.value.split(' ')[0],
            surname: editFullName.value.split(' ')[1],
            gender: editGender.value,
            height: editHeight.value,
            age: editAge.value,
            weight: editWeight.value
        };

        const response = await fetch('/update-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // Reflect the updated values on the UI
            fullName.textContent = editFullName.value;
            gender.textContent = editGender.value;
            height.textContent = `${editHeight.value} cm`;
            age.textContent = `${editAge.value} years`;
            weight.textContent = `${editWeight.value} kg`;

            editButton.style.display = 'inline-block';
            saveButton.style.display = 'none';

            fullName.style.display = 'block';
            editFullName.style.display = 'none';

            gender.style.display = 'block';
            editGender.style.display = 'none';

            height.style.display = 'block';
            editHeight.style.display = 'none';

            age.style.display = 'block';
            editAge.style.display = 'none';

            weight.style.display = 'block';
            editWeight.style.display = 'none';

            email.style.display = 'block';
            editEmail.style.display = 'none';
        } else {
            alert('Failed to update profile.');
        }
    });
});
