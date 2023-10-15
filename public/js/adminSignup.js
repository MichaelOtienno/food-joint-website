document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;


    if (username.trim() === '' || password.trim() === '' || confirmPassword == '') {
        alert('fill all inputs');
        return;
    } else if (confirmPassword !== password) {
        alert('passwords dont match');
        return;
    }
    else {

        const data = {
            username: username,
            password: password,
        };

        const backend = '/admin/adminSignup';

        fetch(backend,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)

        })
            .then(response => {
                if (response.ok) {
                    window.location.href = '/admin/'
                }
                else {
                    alert('check your credentials again');
                    return;
                }
            })
            .catch(error => {
                console.error('Network error:', error);
            })
    }
});