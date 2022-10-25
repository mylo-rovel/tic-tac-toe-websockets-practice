export class Player {
    private fieldSize:number;
    public userBoard: number[][] = [[0,0,0],[0,0,0],[0,0,0]];
    private userPoints: number = 0;
    public userSymbol: string;
    
    constructor(userSymbol:string, fieldSize:number = 3) {
      this.userSymbol = userSymbol;
      this.fieldSize = fieldSize;
    }
    public markAPoint(i_pos:number,j_pos:number): boolean {
      if (i_pos > this.fieldSize || j_pos > this.fieldSize){
        return false;
      }
      this.userBoard[i_pos][j_pos] = 1;
      return this.checkIfUserWon(i_pos, j_pos);
    }

    private checkIfUserWon(i_pos:number,j_pos:number): boolean {
      if (this.userPoints < 2) {this.userPoints++; return false;}
      
      let [diag1Sum, diag2Sum] = [0,0];
      let rowSum = this.getSumOfLine("row", i_pos);
      let columnSum = this.getSumOfLine("column", j_pos);

      if (i_pos === j_pos || i_pos + j_pos === 2) {
        // we are in the diagonal. ONLY WORKS FOR fieldSize === 3
        for (let i = 0; i < this.fieldSize; i++) {
          diag1Sum += this.userBoard[i][i];
          diag2Sum += this.userBoard[this.fieldSize - 1 - i][i];
        }
        // console.log(diag1Sum, diag2Sum)
      }
      if (rowSum === 3 || columnSum === 3 || diag1Sum === 3 || diag2Sum === 3) {
        // console.log("3 points " + this.userSymbol);
        return true;
      }
      this.userPoints++;
      return false;
    }
    private getSumOfLine(line: "row" | "column", refPos: number):number {
      let accumulator = 0;
      if (line === "row") {
        for (let i = 0; i < this.fieldSize; i++) {
          accumulator += this.userBoard[refPos][i];
        }
        return accumulator;
      }
      // else if line === "column"
      for (let i = 0; i < this.fieldSize; i++) {
        accumulator += this.userBoard[i][refPos];
      }
      return accumulator;
    }
  }