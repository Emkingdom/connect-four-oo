export default class Game {
  constructor(player1, player2) {
    this.WIDTH = 7;
    this.HEIGHT = 6;
    this.board = [];
    this.players = [player1, player2];
  }

  getBoard() {
    const { WIDTH, HEIGHT, board } = this;
    for (let y = 0; y < HEIGHT; y++) {
      board.push(Array.from({ length: WIDTH }));
    }
  }

  getHtmlBoard() {
    const { WIDTH, HEIGHT } = this;
    const board = document.getElementById("board");
    const currPlayer = this.players[0].color;
    console.log(currPlayer);
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));

    for (let x = 0; x < WIDTH; x++) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < HEIGHT; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < WIDTH; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  endGame(msg) {
    alert(msg);
  }

  placeInTable(y, x) {
    const player = this.players[0].color;
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.style.backgroundColor = player;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  checkForWin() {
    const { WIDTH, HEIGHT, board } = this;
    const currPlayer = this.players[0].color;
    function _win(cells) {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < HEIGHT &&
          x >= 0 &&
          x < WIDTH &&
          board[y][x] === currPlayer
      );
    }

    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [
          [y, x],
          [y, x + 1],
          [y, x + 2],
          [y, x + 3],
        ];
        const vert = [
          [y, x],
          [y + 1, x],
          [y + 2, x],
          [y + 3, x],
        ];
        const diagDR = [
          [y, x],
          [y + 1, x + 1],
          [y + 2, x + 2],
          [y + 3, x + 3],
        ];
        const diagDL = [
          [y, x],
          [y + 1, x - 1],
          [y + 2, x - 2],
          [y + 3, x - 3],
        ];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  findSpotForCol(x) {
    const { HEIGHT, board } = this;
    for (let y = HEIGHT - 1; y >= 0; y--) {
      if (!board[y][x]) {
        return y;
      }
    }
    return null;
  }

  switchPlayers() {
    console.log(this.players);
    [this.players[0], this.players[1]] = [this.players[1], this.players[0]];
    console.log(this.players);
    // this.currPlayer = player === 1 ? 2 : 1;
  }

  handleClick(evt) {
    const { board } = this;
    const currPlayer = this.players[0].color;
    console.log(currPlayer);
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${currPlayer} won!`);
    }

    // check for tie
    if (board.every((row) => row.every((cell) => cell))) {
      return this.endGame("Tie!");
    }
    // switch players
    this.switchPlayers();
  }
}
