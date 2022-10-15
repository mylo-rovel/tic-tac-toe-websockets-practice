import {useState, useEffect} from 'react';
import { Player } from '../Utilities/Classes/Player';
import { GameBoard } from '../Utilities/Classes/GameBoard';
import './App.css';

function App() {
  const [container, setContainer] = useState(<div id="initialTag"></div>);

  useEffect(() => {
    const playerA = new Player("PlayerA");
    const playerB = new Player("PlayerB");
    const gameBoard = new GameBoard(playerA, playerB);
    gameBoard.startGame(container, setContainer);
  // eslint-disable-next-line no-use-before-define
  },[container]); // eslint-disable-line
  
  console.log("ccc")
  return (
    <div className="App">
      {container}
    </div>
  );
}

export default App;
