document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim().toLowerCase();
        const password = document.getElementById('login-password').value.trim();

        fetch('http://localhost:8000/users.json')
            .then(response => response.json())
            .then(users => {
                const user = users.find(user => user.email === email);
                if (!user) {
                    console.log('User not found');
                    document.getElementById('login-error').classList.remove('hidden');
                    document.getElementById('login-password-error').classList.add('hidden');
                } else if (user.password !== password) {
                    console.log('Password does not match');
                    document.getElementById('login-password-error').classList.remove('hidden');
                    document.getElementById('login-error').classList.add('hidden');
                } else {
                    console.log('Login successful');
                    localStorage.setItem('authenticated', 'true');  // Mark the user as authenticated
                    window.location.href = 'index.html';  // Redirect to index.html after successful login
                }
            })
            .catch(error => console.error('Error fetching users:', error));
    });

    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('register-email').value.trim().toLowerCase();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        const passwordError = document.getElementById('password-error');
        const confirmPasswordError = document.getElementById('confirm-password-error');

        if (password !== confirmPassword) {
            confirmPasswordError.classList.remove('hidden');
            return;
        }

        fetch('http://localhost:8000/users.json')
            .then(response => response.json())
            .then(users => {
                if (users.find(user => user.email === email)) {
                    passwordError.textContent = 'Email already exists';
                    passwordError.classList.remove('hidden');
                    return;
                }
                const newUser = { email: email, password: password };
                users.push(newUser);

                return fetch('http://localhost:8000/save-users.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newUser)  // Send only the new user data
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
