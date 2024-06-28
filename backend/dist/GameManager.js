"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const Game_1 = require("./Game");
const messages_1 = require("./messages");
class GameManager {
    constructor() {
        this.games = [];
        this.pendingUsers = null;
        this.users = [];
    }
    // Adding user 
    addUser(socket) {
        this.users.push(socket);
        this.addhandler(socket);
    }
    // Removing user 
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
        // stop game because user has disconnected 
    }
    // Handle message
    addhandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === messages_1.INIT_GAME) {
                if (this.pendingUsers) {
                    // if user exists then start a new game with that user 
                    const game = new Game_1.Game(this.pendingUsers, socket);
                    this.games.push(game);
                    this.pendingUsers = null;
                }
                else {
                    // if user does not exist then add user to pending users 
                    this.pendingUsers = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                console.log("inside move");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("insinde makemove");
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
exports.GameManager = GameManager;
