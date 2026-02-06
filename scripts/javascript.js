function createPlayer(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return {getName, getMarker};
}

const gameBoard = (function() {
    const board = [
                    ["", "", ""],
                    ["", "", ""], 
                    ["", "", ""]
                  ];

    const getBoard = () => board;

    const markCell = (row, column, player) => {
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

    return {getBoard, markCell, threeInARow};
})();


