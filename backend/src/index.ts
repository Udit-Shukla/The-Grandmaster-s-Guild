// A web socket sever to communicate with the front end
import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
const wss = new WebSocketServer({port: 8080});


// Create a new instance of the GameManager class
const gameManager = new  GameManager();

// Handle connection
wss.on('connection', function connection(ws) {
    // Add user to the game
    gameManager.addUser(ws);

    // Remove user from the game
    ws.on("disconnect",()=>{gameManager.removeUser(ws)});


    ws.on("error",console.error);  
    
    ws.on("message", function message(data){
        console.log("Received: %s", data);
    });

    ws.send("Hello from the server!");
});