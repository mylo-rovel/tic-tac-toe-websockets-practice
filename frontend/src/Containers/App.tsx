import React, {useState, useEffect} from 'react';
import { GameBoard } from '../Utilities/Classes/GameBoard';
import { SocketContext } from '../Utilities/Classes/SocketClient';
import { SearchBar } from '../Components/SearchBar/SearchBar';
import './App.css';


const setParagraphTextById = (elementId:string, newText:string) => {
  const pElement = document.getElementById(elementId);
  if (pElement === null) return;
  pElement.textContent = newText;
}

const setTurnText = (elementId:string) => (newText:string) => {
  setParagraphTextById(elementId, newText);
}

function App() {
  const [container, setContainer] = useState(<div id="initialTag"></div>);
  const socketClient = React.useContext(SocketContext).getSocketObject();
  const [turnMessage, setTurnMessage] = React.useState("ESPERANDO SALA");

  useEffect(() => {
    // setTurnText("game-status-message")
    const gameBoard = new GameBoard(socketClient, setTurnMessage);
    gameBoard.listenToEvents();
    gameBoard.startGame(container, setContainer);
  // eslint-disable-next-line no-use-before-define
  },[]); // eslint-disable-line
  
  socketClient.on("opponentVictory", ({winnerID}:{winnerID:string}) => {
    const result = (socketClient.id === winnerID) ? "HAS GANADO :D" : "PERDISTE";
    setParagraphTextById("game-status-message", result);
  })

  return (
    <div className="App">
      <article><p id="game-status-message">{turnMessage}</p></article>
      {container}
      <SearchBar socketClient={socketClient} />
    </div>
  );
}

export default App;
