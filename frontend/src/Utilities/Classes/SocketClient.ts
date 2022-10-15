import React from "react";
import { io, Socket } from "socket.io-client";

export class SocketClient {
    private socket:Socket;
    
    public constructor(apiURL:string) {
        this.socket = io(apiURL);
    }

    public closeSocket() {
        this.socket.close();
    }
    public getSocketID() { return this.socket.id; }
      

    public listenToEvents() {
        this.socket.on('connect', () => this.handleConnect());
    }
    // the following methods are just handlers used in "listenToEvents"
    private handleConnect() {
        console.log('Connected as...', this.socket.id);
    }
}

export const SocketContext = React.createContext(new SocketClient("http://192.168.1.91:3001"));