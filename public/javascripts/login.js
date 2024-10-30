document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const buttonLogin = document.getElementById("buttonLogin");
    const errorMessage = document.getElementById("errorMessage");
    const togglePassword = document.getElementById("togglePassword");
    const passwordField = document.getElementById("password");
    const DOMAIN = `http://localhost:3000/api/v1`;

    // Toggle password visibility
    togglePassword.addEventListener("click", () => {
        if (passwordField.type === "password") {
            passwordField.type = "text";
            togglePassword.textContent = "🙈"; // Change to "hide" icon
        } else {
            passwordField.type = "password";
            togglePassword.textContent = "👁️"; // Change to "show" icon
        }
    });

    // Handle form submission
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        buttonLogin.disabled = true;
        buttonLogin.querySelector(".spinner-border").classList.remove("d-none");

        const formData = {
            username: loginForm.username.value,
            password: loginForm.password.value,
        };

        try {
            const response = await fetch(`${DOMAIN}/users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.status === 200) {
                    window.location.href = "/";
                } else {
                    errorMessage.innerText = `*${result.message}`;
                    errorMessage.style.display = "inline-block";
                }
            } else if (response.status === 401) {
                // Display error for unauthenticated access
                errorMessage.textContent = "Authentication required. Please log in.";
                errorMessage.style.display = "inline-block";
            } else {
                const text = await response.text();
                console.error("Unexpected error:", text);
                errorMessage.textContent = "An unexpected error occurred. Please try again.";
            }
        } catch (error) {
            console.error("Login error:", error);
            errorMessage.textContent = "An unexpected error occurred. Please try again.";
        } finally {
            buttonLogin.disabled = false;
            buttonLogin.querySelector(".spinner-border").classList.add("d-none");
        }
    });
});