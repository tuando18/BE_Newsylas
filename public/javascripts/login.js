document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const spinner = document.querySelector('.spinner-border');
    const DOMAIN = `http://localhost:3000/api/v1`;

    spinner.classList.remove('d-none'); // Show spinner

    try {
        const response = await fetch(`${DOMAIN}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        spinner.classList.add('d-none'); // Hide spinner

        if (response.ok) {
            // Redirect to dashboard on success
            window.location.href = '/dashboard';
            console.log(111111);
        } else {
            // Show error modal with message
            showErrorModal(result.message || 'Invalid username or password.');
        }
    } catch (error) {
        console.error('Login error:', error); // Add error log for debugging
        showErrorModal('An error occurred. Please try again later.');
    }
});

function showErrorModal(message) {
    const errorModal = new bootstrap.Modal(document.getElementById('loginErrorModal'));
    document.getElementById('errorMessage').textContent = message;
    errorModal.show();
}
