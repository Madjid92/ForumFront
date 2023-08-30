
async function getMessages(token, dateAfterTs) {
    const filter = (dateAfterTs) ? "?dateAfterTs=" + dateAfterTs : ""
    return await fetch(`http://localhost:3000/messages${filter}`, {
        method: "GET",
        //mode: 'same-origin',
        headers: {
            Authorization: token,
        },
    })

};

const latMessagtTimestamp = () => {
    let ts = 0;
    return {
        get: () => ts,
        set: (time) => { ts = time }
    }
}


const tsManager = latMessagtTimestamp();

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


const displayMsgs = (messages) => {
    if (!messages) return;
    const infoToDisp = messages.map((e, i) => {
        const { login, content, date: ts } = e;
        const date = new Date(ts);
        if (i === messages.length - 1) {
            tsManager.set(ts);
        }
        return {
            login,
            content,
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} `
        }
    });

    infoToDisp.forEach((e, i) => {
        document.getElementById("chatBox").appendChild(createSpan(e));
    });
}


getMsgsOrRedirect().then((messages) => {
    displayMsgs(messages);
    setInterval(async () => {
        const token = localStorage.getItem("token");
        const messages = await getMessages(token, tsManager.get());
        displayMsgs(await messages.json());
    }, 1000)
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
    return await fetch('http://localhost:3000/messages/send', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({ msg })
    })
};





