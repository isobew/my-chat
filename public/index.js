(function(){
    const sendBtn = document.querySelector('#send');
    const messages = document.querySelector('#messages');
    const messageBox = document.querySelector('#messageBox');
    const welcome = document.getElementById('welcome-btn');
    const chatContainer = document.getElementById('chat-container');
    const welcomeContainer = document.getElementById('welcome-container');
    const nick = document.getElementById('nick');
    

    let ws;
   

    
    welcome.onclick = function start(){

        welcomeContainer.style.display = 'none'; 
        chatContainer.style.display = 'flex';
        let userName = nick.value;  
        ws.send(userName + ' entrou'); 
        showUser(userName);
        
        return

    };

    function showMessage(message) {

        messages.textContent += `\n ${message}`;
        messages.scrollTop = messages.scrollHeight;
        messageBox.value = '';

        console.log(message)

    }

    function showUser(user) {

        messages.textContent += `\n ${user} entrou`;
        messages.scrollTop = messages.scrollHeight;
        messageBox.value = '';

        console.log('user:' + user)

    }

    function init() {
        if(ws) {
            ws.onerror = null;
            ws.onopen = null;
            ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket('wss://localhost:5500/?token=abc123');
        ws.onopen = () => {
            console.log('Connection opened');
        }

        ws.onmessage = ({ data }) => {
            showMessage(data)
        };
        ws.onclose = function() {
            ws = null;
        }
    }

    sendBtn.onclick = function() {
        if(!ws) {
            showMessage('No websocket connection');
            return;
        }

        let msgobj = {
            nick: nick.value,
            message: messageBox.value
        }

        console.log(msgobj)

        // let obj = JSON.stringify(msgobj);
        let sendMsg = `${msgobj.nick}: ${msgobj.message}`
        
        console.log(sendMsg);

        ws.send(sendMsg);
        showMessage(sendMsg);
    }

    init();
})();