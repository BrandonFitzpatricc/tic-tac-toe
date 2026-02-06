function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return {getName, getMarker};
}

const gameBoard = (function() {
    let board = [
                    ["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]
                ];

    const getBoard = () => board;

    const markCell = (row, column, player) => {
        // This function returns true or false to indicate whether or not the cell attempting 
        // to be marked was already taken. If it was taken, then the player must try again with
        // a different cell
        if(board[row][column] === "") {
            board[row][column] = player.getMarker();
            return true;
        }

        return false;
    };

    const threeInARow = () => {
        let row;
        let column;
        let leftDiagonal = [];
        let rightDiagonal = [];

        let threeInARow;

        for(let i = 0; i < board.length; i++) {
            row = board[i];
            column = [];
            
            for(let j = 0; j < board.length; j++) {
                column.push(board[j][i]);
            }

            for(const arr of [row, column]) {
                threeInARow = arr.every(cell => cell === arr[0] && arr[0] !== "");
                if(threeInARow) return true;
            }

            leftDiagonal.push(board[i][i]);
            rightDiagonal.push(board[i][(board.length - 1) - i]);
        }

        for(const arr of [leftDiagonal, rightDiagonal]) {
            threeInARow = arr.every(cell => cell === arr[0] && arr[0] !== "");
            if(threeInARow) return true;
        }

        return false;
    };

    const clearBoard = () => {
        board = [
                    ["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]
                ];
    }

    return {getBoard, markCell, threeInARow, clearBoard};
})();

const gameController = function() {
    const player1 = createPlayer("Player1", "X");
    const player2 = createPlayer("Player2", "O");

    let activePlayer = player1;

    let gameOver = false;

    const switchActivePlayer = () => {
        activePlayer = activePlayer === player1 ? player2 : player1;
    };

    const playRound = (row, column) => {
        if(!gameOver) {
            if(!gameBoard.markCell(row, column, activePlayer)) return;

            if(gameBoard.threeInARow()) {
                console.log(`${activePlayer.getName()} has won!`);
                gameOver = true;
                return;
            }

            switchActivePlayer();
        }
    }

    const restartGame = () => {
        activePlayer = player1;
        gameOver = false;
        gameBoard.clearBoard();
    }

    return{playRound, restartGame};
}();


