async function getMessages(token) {
    return await fetch('http://localhost:3000/messages', {
        method: "GET",
        //mode: 'same-origin',
        headers: {
            Authorization: token,
        },
    })

};

async function getMsgsOrRedirect() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/login"
        return;
    }
    const resp = await getMessages(token)
    if (resp.status !== 200) {
        window.location.href = "/login"
        return;
    }
    return await resp.json();
}


getMsgsOrRedirect().then((messages) => {
    if(!messages) return;
    const infoToDisp = messages.map( e =>{
        const {login, content, date : ts} =e;
        const date = new Date(ts);
        return {
            login,
            content,
            date : `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} `
        }
    });
    
    infoToDisp.forEach((e) => {
        document.getElementById("chatBox").appendChild(createSpan(e));
    });
});

function createSpan(elem) {
    const span = document.createElement("span");
    span.innerHTML = `${elem.login}:&nbsp;${elem.content}&nbsp;&nbsp ${elem.date}<br>`;
    return span
};

document.getElementById("buttonSubmitMessage").onclick = saveMessages;

async function saveMessages() {
    const msg = document.getElementById("valueMessage").value;
    if (!msg) return;
    const token = localStorage.getItem("token");
    return await fetch ('http://localhost:3000/messages/send',{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({msg})
    })
};




