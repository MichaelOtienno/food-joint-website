document.getElementById('submit').addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if(username.trim() =='' || password.trim() ==''){
        alert('Please fill all fields');
        return;
    }
    const userData = {
        username:username,
        password:password
    };
    const backend = '/admin/adminSignin';
        fetch(backend, {
            method:'POST',
            headers :{'Content-Type': 'application/JSON'},
            body : JSON.stringify(userData)
        })

        .then(response => {
            if(response.ok){
                window.location.href = '/admin/adminPage'
            }
            else{
                alert('check your credentials again')
            }

        })
        .catch(error => {
            console.error('Network error:', error)
        })
        

    
   
});