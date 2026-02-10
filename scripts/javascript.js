function createPlayer(name, marker) {
    const getName = () => name;
    const setName = (newName) => name = newName;

    const getMarker = () => marker;

    return {getName, setName, getMarker};
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

    const boardFull = () => {
        for(let i = 0; i < board.length; i++) {
            for(let j = 0; j < board.length; j++) {
                if(board[i][j] === "") return false;
            }
        }

        return true;
    }

    const clearBoard = () => {
        board = [
                    ["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]
                ];
    }

    return {getBoard, markCell, threeInARow, boardFull, clearBoard};
})();

const gameController = function() {
    const players = [createPlayer("", "X"), createPlayer("", "O")];
    let activePlayer;
    let gameOver;
    let draw;

    const getActivePlayer = () => activePlayer;
    const isGameOver = () => gameOver;
    const isDraw = () => draw;

    const startNewGame = (playerNames) => {
        const firstGame = !activePlayer;
        if(firstGame) {
            for(let i = 0; i < players.length; i++) {
                players[i].setName(playerNames[i]);
            }
        }

        activePlayer = players[0];
        gameOver = false;
        draw = false;
        gameBoard.clearBoard();
    }

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const playRound = (row, column) => {
        if(!gameOver) {
            if(!gameBoard.markCell(row, column, activePlayer)) return;

            draw = gameBoard.boardFull();
            gameOver = gameBoard.threeInARow() || draw;
            if(gameOver) return;

            switchActivePlayer();
        }
    }

    return{getActivePlayer, isGameOver, isDraw, startNewGame, playRound};
}();

const screenController = function() {
    const gameBoardDisplay = document.querySelector("#game-board");

    document.querySelector("#new-game-btn").addEventListener("click", () => {
        const playerNames = [];
        document.querySelectorAll(".player-name").forEach((node, index) => {
            node.value = !node.value ? `Player ${index + 1}` : node.value;
            playerNames.push(node.value);
        });
        
        gameController.startNewGame(playerNames);
        updateScreen();
    });

    gameBoardDisplay.addEventListener("click", (event) => {
        gameController.playRound(event.target.dataset.row, event.target.dataset.column);
        updateScreen();
    });

    const updateScreen = () => {
        const playerStatus = document.querySelector("#player-status-text");
        const activePlayer = gameController.getActivePlayer();

        if(activePlayer) {
            const activePlayerName = activePlayer.getName();

            playerStatus.textContent = `${activePlayerName}'s turn`

            document.querySelectorAll(".player").forEach(node => {
                playerMarker = node.firstElementChild.textContent;
                if(playerMarker === activePlayer.getMarker()) node.className += " active";
                else node.className = "player"
            })
        }

        gameBoardDisplay.textContent = "";
        gameBoard.getBoard().forEach((row, rowIndex) => {
            row.forEach((cellValue, columnIndex) => {
                const cellButton = document.createElement("button");

                cellButton.className = "cell";
                if(cellValue !== "") {
                    cellButton.className += ` ${cellValue.toLowerCase()}-marked`
                    cellButton.textContent = cellValue;
                }

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                gameBoardDisplay.appendChild(cellButton);
            });
        });

        if(gameController.isGameOver()) {
            playerStatus.textContent = !gameController.isDraw() ? 
                                       `${activePlayer.getName()} wins!` : 
                                       "Draw!";
        }
    }
}();


