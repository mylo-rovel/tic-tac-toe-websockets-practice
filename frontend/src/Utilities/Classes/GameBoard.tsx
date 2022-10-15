import { Player } from './Player';

export   class GameBoard {
    private gameIsOver: boolean = false;
    private playerTurn: 1 | -1 = 1; // this will switch between -1 and 1
    private fieldSize = 3;
    private playerA: Player;
    private playerB: Player;
    public turnsQuantity = 0;

    constructor(playerA:Player, playerB:Player, fieldSize:number = 3){
      this.playerA = playerA;
      this.playerB = playerB;
      this.fieldSize = fieldSize;
    }

    private scoreAPoint(eventObj:React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
      // if the game is over do nothing
      if (this.gameIsOver) {alert("El juego acabó"); return false;}

      const currentCell = eventObj.currentTarget;
      const currentCellPos = currentCell.id.split("-");
      const [i_pos, j_pos] = [parseInt(currentCellPos[0]), parseInt(currentCellPos[1])];

      if(currentCell.textContent !== "-") {return false;}
      
      const currentPlayer = (this.playerTurn === 1) ? this.playerA : this.playerB;
      const currentPlayerSymbol = (this.playerTurn === 1) ? "A" : "B";

      // this function returns a boolean => if a player just won, we'll get true
      this.gameIsOver = currentPlayer.markAPoint(i_pos, j_pos);
      currentCell.textContent = currentPlayerSymbol;
  
      if (this.gameIsOver) {
        alert(`El jugador ${currentPlayer.userID} ganó`);
      }
      //switch player
      this.playerTurn *= -1
      return true;
    }

    private createGameBoard():{gameCreated: boolean, gameBoard?: JSX.Element} {
      let cellsList: JSX.Element[] = [];
      let rowContainersList: JSX.Element[] = [];
  
      for (let i = 0; i < this.fieldSize; i++) {
        for (let j = 0; j < this.fieldSize; j++) {
          const gameCell = <div 
            id={`${i}-${j}`} 
            key={`${i}-${j}`} 
            onClick={(eventObj) => this.scoreAPoint(eventObj)} 
            className="game-cell">
              -
            </div>
          cellsList.push(gameCell);
        }
        const rowContainer = <div key={`game-row-${i}`} className='game-board-row'>{cellsList}</div>;
        rowContainersList.push(rowContainer);
        cellsList = [];
      }
      
      const gameBoard = <div id="game-board">{rowContainersList}</div>;      
      return {gameCreated: true, gameBoard};
    }

    // MAIN FUNCTION
    public startGame(
        container: JSX.Element,
        setContainer: React.Dispatch<React.SetStateAction<JSX.Element>>
        ):boolean {
      const processStatus = this.createGameBoard();
      if (processStatus.gameCreated === false || processStatus.gameBoard === undefined) {
        alert("Error al crear juego");
        return false;
      }
      
      if (container.props["id"] === "initialTag") {
        setContainer(processStatus.gameBoard);
      }

      return true;
    }

  }