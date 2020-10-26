let btnSend = document.querySelector('#send');
let inputNick = document.querySelector('#nick');
let inputMessage = document.querySelector('#msg');

function showMessage(inputNick, inputMessage) {
    let divChat = document.querySelector('#chat');
    let msgDiv = document.createElement('div');
    msgDiv.innerHTML = inputNick + ": " + inputMessage;
    divChat.prepend(msgDiv);
}


const URL = 'http://students.a-level.com.ua:10012';
let lastMessageId = 0;
const delay = ms => new Promise((resolve) => setTimeout(() => resolve(ms), ms));

async function jsonPost(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (response.status == 200) {
        let data2 = await response.json();
        return data2;
    }

    throw new Error('failed');
}

async function sendMessage(nick, message) {
    try {
        await jsonPost(URL, {
            func: 'addMessage',
            nick: nick,
            message: message
        });
    } catch (e) {
        console.log('error')
    }
}


async function getMessages() {
    try {
        let data = await jsonPost(URL, {
            func: 'getMessages',
            messageId: lastMessageId
        });
        for (let value of data.data) {
            showMessage(value.nick, value.message);
        }
        lastMessageId = data.messageId;
    } catch (e) {
        console.log('error')
    }
}


async function sendAndCheck() {
    await sendMessage(inputNick.value, inputMessage.value);
    await getMessages();
}

async function checkLoop() {
    while (true) {
        await delay(5000);
        await getMessages();
    }
}

btnSend.addEventListener('click', sendAndCheck);
getMessages().then();
checkLoop().then();