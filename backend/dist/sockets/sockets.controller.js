import { Server } from "socket.io";
export class SocketController {
    constructor(httpServer) {
        this.socketServer = new Server(httpServer);
    }
    socketListen() {
        this.socketServer.on('connection', (socket) => {
            console.log(`A user has connected: ${socket.id}\n${socket}`);
        });
    }
}
