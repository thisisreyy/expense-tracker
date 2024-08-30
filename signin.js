document.addEventListener('DOMContentLoaded', function () {
    // Handle login
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();

        fetch('http://localhost:8000/users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.email === email);
                if (!user) {
                    document.getElementById('login-error').classList.remove('hidden');
                    document.getElementById('login-password-error').classList.add('hidden');
                } else if (user.password !== password) {
                    document.getElementById('login-password-error').classList.remove('hidden');
                    document.getElementById('login-error').classList.add('hidden');
                } else {
                    localStorage.setItem('authenticated', 'true');  // Mark the user as authenticated
                    window.location.href = 'index.html';  // Redirect to index.html after successful login
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    });

    // Handle registration
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value.trim().toLowerCase();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');

        // Password validation regex
        const passwordValidation = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

        // Check if the password meets the requirements
        if (!passwordValidation.test(password)) {
            passwordError.classList.remove('hidden');
            passwordError.textContent = 'Password must be at least 8 characters long, include a capital letter, a number, and a special symbol.';
            confirmPasswordError.classList.add('hidden');
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            confirmPasswordError.classList.remove('hidden');
            passwordError.classList.add('hidden');
            return;
        }

        // If validation passes, proceed with registration
        fetch('http://localhost:8000/users.json')
            .then(response => response.json())
            .then(users => {
                if (users.find(user => user.email === email)) {
                    passwordError.textContent = 'Email already exists';
                    passwordError.classList.remove('hidden');
                    return;
                }
                users.push({ email: email, password: password });
                return fetch('http://localhost:8000/save-users.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(users)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to save users.json');
                }
                alert('Registration Successful, please log in.');
                document.getElementById('register-section').classList.add('hidden');
                document.getElementById('login-section').classList.remove('hidden');  // Redirect to login section after registration
            })
            .catch(error => console.error('Error during registration:', error));
    });

    document.getElementById('show-register').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('register-section').classList.remove('hidden');
    });
});
