import http from "http";
import { Server } from "socket.io"

interface IRoomConfig {
    players: string[];
    gameIsRunning: boolean; // useful when someone surrender
}

interface IMovementProps {
    i_pos: number;
    j_pos: number;
    userSymbol: string;
}

const getRoomName = (clientID:string, clientsRooms:Map<string,string>) => {
    const roomName = clientsRooms.get(clientID);
    if (!roomName) {
        throw new Error("Error obteniendo el nombre de la sala");
    }
    else {
        return roomName;
    }
}

const getFirstTurnID = (roomsCollection:Map<string, IRoomConfig>, roomName: string, defaultID: string) => {
    const randomValue = Math.round(Math.random());
    const storedRoom = roomsCollection.get(roomName);    
    return (storedRoom) ? storedRoom.players[randomValue] : defaultID;
}

const inputIsValid = (input:string) => {
    const regex = /[\w|\á|\é|\í|\ó|\ú]+/g;
    return regex.test(input);
}

export class SocketController {
    private socketServer: Server;
    private roomsCollection = new Map<string,IRoomConfig>();
    private clientsRooms = new Map<string,string>();

    constructor(httpServer:http.Server) {
        this.socketServer = new Server(httpServer, 
            { cors: { origin: '*', methods: ['GET', 'POST']} });
    }

    public socketListen () {
        console.log("Listening on sockets")
        this.socketServer.on('connection', (socket) => {  
            console.log(`${"#".padStart(40, "#")}\nA user has connected: ${socket.id}`);
            console.log(`Current amount of connected clients: ${this.socketServer.engine.clientsCount}\n\n\n`);

            socket.on("joinRoom", (roomName:string) => {
                if (inputIsValid(roomName)) {
                    this.socketServer.to(socket.id).emit("validRoomName");
                }
                else{
                    this.socketServer.to(socket.id).emit("invalidRoomName");
                    console.log("invalid room name");
                    return;
                }
                console.log(roomName);
                console.log(`Cliente ${socket.id} envió el nombre de sala: ${roomName}`)                
                const storedRoom = this.roomsCollection.get(roomName);
                if (!storedRoom) { //* si no existe, la creamos
                    this.roomsCollection.set(roomName, {players:[socket.id], gameIsRunning:false});
                    this.clientsRooms.set(socket.id, roomName);
                    socket.join(roomName);
                    console.log("Room creado: ", roomName);
                    return;
                } //* estamos entrando en una sala ya creada
                else if (storedRoom.players.length === 1) {
                    if (storedRoom.players.includes(socket.id)){
                        console.log("Cliente ya incluido"); return;
                    }
                    storedRoom.players.push(socket.id);
                    this.clientsRooms.set(socket.id, roomName);
                    socket.join(roomName);
                    console.log("Cliente agregado\n\n");                    

                    this.socketServer.in(roomName).emit('startGame', getFirstTurnID(this.roomsCollection, roomName, socket.id));
                    console.log("START GAME GOOGOGOGOG");
                    return;
                }                
                else return; //* the user will not join the room
            })

            socket.on("playerMovement", (payload:IMovementProps) => {   
                const room = this.clientsRooms.get(socket.id);
                if (!room) {console.log("Jugador en room inválido"); return;}
                console.log(`Jugador ${socket.id} se movió. Sala: ${room}.`);
                console.log(`Información de la jugada: ${Object.entries(payload)}`);
                // to individual socketid (private message)
                this.socketServer.to(socket.id).emit("waitUntilOppReady");
                socket.to(room).emit('opponentMovement', payload);
            })

            socket.on("oppMoveReady", () => {
                this.socketServer.to(socket.id).emit("playerCanPlay");
            })

            socket.on("playerVictory", () => {
                const roomName = getRoomName(socket.id, this.clientsRooms)
                console.log("VICTORIA")
                this.socketServer.in(roomName).emit("opponentVictory", {winnerID: socket.id})
            })

            socket.on("replayRequest", () => {                
                const roomName = getRoomName(socket.id, this.clientsRooms)
                console.log("Replay in the same room accepted");
                this.socketServer.in(roomName).emit("replayAccepted")
            })

            //? Ending of connection
            socket.on("disconnect", (reason) => {
                console.log(`${socket.id} has disconnected. REASON:${reason}`);
                console.log(`# connected clients: ${this.socketServer.engine.clientsCount}\n`);

                const roomToDelete = this.clientsRooms.get(socket.id);
                if (!roomToDelete) return;                
                console.log(`Room a borrar: ${roomToDelete}`);
                const roomClients = this.socketServer.sockets.adapter.rooms.get(roomToDelete);
                if (roomClients) {
                    roomClients.forEach((socketID:string) => this.clientsRooms.delete(socketID));
                }
                this.roomsCollection.delete(roomToDelete);
                socket.to(roomToDelete).emit("opponentHasLeft");
                console.log(`${"-".padStart(40, "-")}`)
            })
        })
    }
}