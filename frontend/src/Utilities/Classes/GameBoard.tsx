import { Player } from './Player';
import { Socket } from "socket.io-client";

interface IMovementProps {
  i_pos: number;
  j_pos: number;
  userSymbol: string;
}

export   class GameBoard {
    private gameIsOver: boolean = false;
    private fieldSize = 3;
    private player: Player = new Player("");;
    private socketClient: Socket
    private playerHasToWait = true;
    private turnMssgSetter: React.Dispatch<React.SetStateAction<string>>;

    constructor(socketClient: Socket, turnMssgSetter: React.Dispatch<React.SetStateAction<string>>){
      this.socketClient = socketClient;
      this.turnMssgSetter = turnMssgSetter;
    }

    private emitTie() {
      this.socketClient.emit("gameReachedTie");
      this.gameIsOver = true;
    }

    private gameReachedATie () {
      const cellsArr = document.querySelectorAll('.game-cell');
      let availableCells = 0;
      cellsArr.forEach(item => { availableCells += (item.textContent === '-') ? 1 : 0;});
      return (availableCells === 0);
    }

    private emitVictory() {
      this.socketClient.emit("playerVictory");
      this.gameIsOver = true;
    }
    
    public listenToEvents() {
      this.socketClient.on("startGame", (firstPlayerID:string) => {
        if (this.socketClient.id === firstPlayerID){
          this.playerHasToWait = false;
          this.player = new Player("🐸");
          // 
          this.turnMssgSetter(`ES TU TURNO: ${this.player.userSymbol}`);
        }
        else {          
          this.player = new Player("🍟");
          this.turnMssgSetter("TURNO OPONENTE");
        }
      })

      this.socketClient.on("opponentHasLeft", () => {
        window.location.reload();
      })

      this.socketClient.on("opponentVictory", () => {
        this.gameIsOver = true;
      })

      this.socketClient.on("waitUntilOppReady", () => {
        if (this.gameIsOver) return;
        this.playerHasToWait = true;
        this.turnMssgSetter("TURNO OPONENTE");
      })

      this.socketClient.on("opponentMovement", (oppMove:IMovementProps) => {
        this.registerOpponentMovement(oppMove);
      })

      this.socketClient.on("playerCanPlay", () => {
        if (this.gameIsOver) return;
        this.playerHasToWait = false;
        this.turnMssgSetter(`ES TU TURNO: ${this.player.userSymbol}`);
      })

      this.socketClient.on("gameOverForTie", () => {
        this.gameIsOver = true;
        this.turnMssgSetter(`EMPATE`);
      })
    }

    private registerOpponentMovement(oppMove: IMovementProps) {
      if (this.player.userSymbol === oppMove.userSymbol) return;
      const cellToUse = document.getElementById(`${oppMove.i_pos}-${oppMove.j_pos}`);
      if (cellToUse === null) return;
      cellToUse.textContent = oppMove.userSymbol;
      this.socketClient.emit("oppMoveReady");
    }

    private playTheCell(eventObj:React.MouseEvent<HTMLDivElement, MouseEvent>): boolean {
      //! ----------------------------------------------------------------------------------      
      // if the game is over do nothing
      if (this.gameIsOver) {alert("El juego acabó"); return false;}
      if (this.playerHasToWait) return false;

      const currentCell = eventObj.currentTarget;
      const currentCellPos = currentCell.id.split("-");
      const [i_pos, j_pos] = [parseInt(currentCellPos[0]), parseInt(currentCellPos[1])];

      if(currentCell.textContent !== "-") {return false;}
      //! ----------------------------------------------------------------------------------

      //* after all checks we are sure that the movement can be emitted
      const movementProps:IMovementProps = {i_pos, j_pos, userSymbol: this.player.userSymbol};
      this.socketClient.emit("playerMovement", movementProps);

      // this function returns a boolean => if a player just won, we'll get true
      this.gameIsOver = this.player.markAPoint(i_pos, j_pos);
      currentCell.textContent = this.player.userSymbol;
  
      if (this.gameIsOver) {
        this.emitVictory();
      }
      else if (this.gameReachedATie()) {
        this.emitTie();
      }
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
            onClick={(eventObj) => this.playTheCell(eventObj)} 
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