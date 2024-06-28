import { WebSocket } from "ws";

import { Game } from "./Game";
import { INIT_GAME, MOVE } from "./messages";

export class GameManager{
    private games: Game[];
    private pendingUsers:WebSocket | null;
    private users:WebSocket[];


    constructor(){
    this.games = [];
    this.pendingUsers = null;
    this.users = [];
    }

    // Adding user 
    addUser(socket:WebSocket){
        this.users.push(socket);
        this.addhandler(socket)
    }
    // Removing user 
    removeUser(socket:WebSocket){
        this.users =this.users.filter(user=>user!==socket);

        // stop game because user has disconnected 

    }
    // Handle message
    private addhandler(socket:WebSocket){
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());

            if(message.type=== INIT_GAME){
                if(this.pendingUsers){
                    // if user exists then start a new game with that user 

                    const game = new Game(this.pendingUsers,socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                }

                else {
                    // if user does not exist then add user to pending users 
                    this.pendingUsers = socket;
                }
            }

            if(message.type === MOVE){
                console.log("inside move")
                const game = this.games.find(game=>game.player1===socket || game.player2===socket);
                if(game){
                    console.log("insinde makemove")
                    game.makeMove(socket,message.payload.move)
                }
            }
        })
    } 
}