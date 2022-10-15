import React from "react";
import { io, Socket } from "socket.io-client";

const API_ENDPOINT = "http://192.168.1.91:3001";

export class SocketClient {
    private socket:Socket;
    
    public constructor(apiURL:string) {
        this.socket = io(apiURL);
        this.listenToEvents();
        console.log("adentroooo")
    }

    public getSocketID() { 
        return this.socket.id; 
    }

    public closeSocket() {
        this.socket.close();
    }

    public disconnectSocket() {
        this.socket.disconnect();
    }
      
    public emitEvent(event:string, payload:unknown) {
        this.socket.emit(event, payload);
    }
    
    //* from here we handle the data we receive from the server
    public listenToEvents() {
        this.socket.on('connect', () => this.handleConnect());
        this.socket.on('respuesta1', (payload) => console.log(payload));
    }
    // the following methods are just handlers used in "listenToEvents"
    private handleConnect() {
        console.log('Connected as...', this.socket.id);
    }
}

export const SocketContext = React.createContext(new SocketClient(API_ENDPOINT));
// export const SocketContext = React.createContext<null | SocketClient>(null);