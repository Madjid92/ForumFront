
document.getElementById("form-login").onsubmit = checkLogin;

async function checkLogin(evt) {
    evt.preventDefault();
    const login = document.getElementById("userLogin").value;
    const password = document.getElementById("userMotDePasse").value;
    console.log(login, password);
    const body = JSON.stringify({
        login ,
        password
    });
    console.log(body);
    try {
        const response = await fetch(`http://${ipAddress}/login`, {
            method: "POST",
            //mode: 'same-origin',
            headers :{
               "Content-Type": "application/json",
            },
            body
        })
        localStorage.setItem("token", (await response.json()).hashPwd);
        window.location.href = "/" 
       
    } catch (e) {
        alert("Error connection")
    };
    return false;
};

