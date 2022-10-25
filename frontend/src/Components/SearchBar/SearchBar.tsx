import React from 'react';
import { Socket } from 'socket.io-client';
import './SearchBar.css';

interface IProps {
    socketClient: Socket
}

export function SearchBar({socketClient}:IProps) {
    const [roomName, setRoomName] = React.useState("");
    const [wasGameStarted, setWasGameStarted] = React.useState(false);
    const [gameState, setGameState] = React.useState("");
    const [isNameInvalid, setIsNameInvalid] = React.useState(false);
    const [isNameAccepted, setIsNameAccepted] = React.useState(false);
    // const [juegoTerminado, setJuegoTerminado] = React.useState(false);

    React.useEffect( () => {
        const isReplayPending = window.localStorage.getItem("pendingReplay");
        if (isReplayPending === "true") {
            const storedRoomName = window.localStorage.getItem("roomName");
            if (storedRoomName !== null) {
                setRoomName(storedRoomName);
                socketClient.emit("joinRoom", storedRoomName);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setRoomName(e.target.value);
    }
    
    const sendRoomName = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        socketClient.emit("joinRoom", roomName);        
    }
    socketClient.on("startGame", () => {
        window.localStorage.clear();
        window.localStorage.setItem("roomName", roomName);
        setWasGameStarted(true);
        setIsNameInvalid(false);
        setGameState("JUEGO CORRIENDO");
    });
    socketClient.on("invalidRoomName", () => setIsNameInvalid(true));
    socketClient.on("validRoomName", () => {
        setIsNameInvalid(false);
        setIsNameAccepted(true);
    });
    socketClient.on("opponentVictory", ({winnerID}:{winnerID:string}) => {
        setGameState("JUEGO TERMINADO");
    })

    //? This two handlers manage the replay functionality
    socketClient.on("replayAccepted", () => {
        window.localStorage.setItem("pendingReplay", "true");
        window.location.reload();
    })
    const replaySameRoom = () => {
        const roomName = window.localStorage.getItem("roomName");
        if (roomName === null) {
            window.location.reload();
            return;
        }
        socketClient.emit("replayRequest");
    }

    const setupJSX = (isNameAccepted) ? 
    <>
        <div className="roomNameContainer">
            <p>SALA:</p>
            <p className="roomNameLabel">{roomName}</p>
        </div>
        <button onClick={() => window.location.reload()}>Abandonar sala</button>
    </> : <> 
        {isNameInvalid ? <p>NOMBRE INVÁLIDO</p> : null}
        <input type="text" onChange={handleNameInput} value={roomName}/>
        <button onClick={sendRoomName}>INGRESAR NOMBRE SALA</button>
    </>
    
    return (
    <>
        <form className="searchBarComponent">
            {wasGameStarted ? <p>{gameState}</p> : <>{setupJSX}</> }
        </form>
        <article className="bottom-btns-container">
        {(gameState === "JUEGO TERMINADO") ? <button onClick={replaySameRoom}>RECARGAR JUEGO</button> : null }
        {(gameState === "JUEGO CORRIENDO") 
            ? <div className="roomNameContainer">
                <p>SALA:</p>
                <p className="roomNameLabel">{roomName}</p>
            </div> : null }
        </article>
    </>
    );
}