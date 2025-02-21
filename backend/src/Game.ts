import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";


export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board : Chess
    public startTime:Date;
    private moveCount=0;


    constructor(player1:WebSocket, player2:WebSocket){
        this.player1 = player1;
        this.player2 = player2;
       this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white",
            }
        }));
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black",
            }
        }));
    }

    makeMove(socket:WebSocket,move:{
        from:string;
        to:string;    
    }){
        console.log(move);
        // validation using zod
        // if other player is trying to move early
        if(this.moveCount%2===0 && socket!==this.player1){
            return ;
        }
        if(this.moveCount%2!==0 && socket!==this.player2){
            return ;
        }

        console.log("Did not early return ")
        try{
            this.board.move(move);

        }
        catch(e){
            return;
        }

        console.log("Move made successfully")

        // Check if the game is over
        if(this.board.isGameOver()){
            // Send the game over message to both players
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner: this.board.turn() === "w" ? "black" : "white",
                }
            }));
            return;
        }
        // if game is not over then send the move to the other player
        if(this.moveCount%2===0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:move
            }))
        }
            else{
                this.player1.send(JSON.stringify({
                    type:MOVE,
                    payload:move
                }))
            }
            this.moveCount++;
        }

    }   
