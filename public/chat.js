
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


const socket = io("http://localhost:3000");
socket.on("connect", () => {
    console.log("connection to socket", socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("message", (msg) =>{
    const tmsg = transformMsg(msg);
    document.getElementById("chatBox").appendChild(createSpan(tmsg));
})


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

const transformMsg = (msg) =>{
    const { login, content, date: ts } = msg;
        const date = new Date(ts);
        return {
            login,
            content,
            date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} `
        }
}

const displayMsgs = (messages) => {
    if (!messages) return;
    const infoToDisp = messages.map(transformMsg);

    infoToDisp.forEach((e) => {
        document.getElementById("chatBox").appendChild(createSpan(e));
    });
}


getMsgsOrRedirect().then((messages) => {
    displayMsgs(messages);
    /*setInterval(async () => {
        const token = localStorage.getItem("token");
        const messages = await getMessages(token, tsManager.get());
        displayMsgs(await messages.json());
    }, 1000)*/
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





