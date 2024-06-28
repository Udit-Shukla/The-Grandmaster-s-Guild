import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { ChessBoard } from "../components/ChessBoard";
import { useSocket } from "../hooks/useSocket";

// TODO repeaded piece of code 
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";


export const Game =()=>{
    const socket = useSocket();
    const [chess,setChess] =useState(new Chess());
    const [board,setBoard] = useState(chess.board());
    const [started,setStarted] = useState(false);
    useEffect(()=>{
        if(!socket){
            return ;
        }
        socket.onmessage=(event)=>{
            const message = JSON.parse(event.data);
            console.log(message);
            switch(message.type){
                case INIT_GAME:
                    console.log("Game is initialized");
                    setBoard(chess.board());
                    setStarted(true);
                    break;
                case MOVE: {
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move is made");
                    break;
                }
                case GAME_OVER:
                    console.log("Game is over");
                    break;
                default:
                    console.log("Unknown message type");
            }
        }
    },[socket])

    if(!socket) return <div>Connecting...</div>;
    return(
        <div className="justify-center flex ">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-8 gap-4 ">
                    <div className="col-span-6  w-full flex justify-center mx-auto ml-2">
                        <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board}/>
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                    <div className="pt-8">
                    {!started && <Button onClick={()=>{
                           socket.send(JSON.stringify({
                            type: INIT_GAME
                           }))
                       }}></Button>}
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}