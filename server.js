const express = require('express');
const https = require('https');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');

const app = express();

const port = 5500;

const server = new https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);
const wss = new WebSocket.Server({ server });


app.use(express.static(__dirname + '/public'));


wss.on('connection', function connection(ws, req){
    ws.id = uuidv4();
    ws.on('message', function incoming(data, isBinary){
        wss.clients.forEach(function each(client){
            if(client !== ws && client.readyState === WebSocket.OPEN){
                client.send(data, { binary: isBinary });
            }
            
        })
        // console.log('dado: ' + data);
    })
    // wss.clients.forEach(function each(client){
    //     if(client !== ws && client.readyState === WebSocket.OPEN){
    //         console.log('entrou');
    //     }
        
    // })
    // console.log(uuidv4());
    // ws.send(JSON.stringify(ws.id) + ' entrou');
})


server.listen(port, function(){
    console.log(`Server is listening on ${port}!`);
})