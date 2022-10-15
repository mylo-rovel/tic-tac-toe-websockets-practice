import { Server } from "socket.io";
export class SocketController {
    constructor(httpServer) {
        this.socketServer = new Server(httpServer, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }
    socketListen() {
        console.log("Listening on sockets");
        this.socketServer.on('connection', (socket) => {
            console.log(`\n\nA user has connected: ${socket.id}`);
            console.log(`Current amount of connected clients: ${this.socketServer.engine.clientsCount}\n\n\n`);
            socket.on("testing1", (payload) => {
                console.log(`Mensaje recibido desde ${socket.id}: ${payload}`);
                console.log(`# connected clients: ${this.socketServer.engine.clientsCount}`);
                socket.broadcast.emit("respuesta1", { payload: "aaa" });
            });
            //? Ending of connection
            socket.on("close", () => {
                console.log(`${socket.id} has clossed its connection\n${"-".padStart(40, "-")}`);
                console.log(`# connected clients: ${this.socketServer.engine.clientsCount}\n\n`);
                socket.broadcast.emit("respuesta1", { payload: "aaa" });
            });
            socket.on("disconnect", (reason) => {
                console.log(`${socket.id} has disconnected. REASON:${reason}\n${"-".padStart(40, "-")}`);
                console.log(`# connected clients: ${this.socketServer.engine.clientsCount}\n\n`);
                socket.broadcast.emit("respuesta1", { payload: "aaa" });
            });
        });
    }
}
