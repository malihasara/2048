let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

let colorDict = {
    0: "#ccc1b5",
    2: "#ede4db",
    4: "#ece0ca",
    8: "#efb37f",
    16: "#f19869",
    32: "#f18064",
    64: "#f06444",
    128: "#ebd07b",
    256: "#efd15b",
    512: "#e2c142",
    1024: "#fa992c",
    2048: "#ebc345"
}

let displayBoard = document.getElementById("board");
let cells = displayBoard.children; 
let previousDirection = 0;
let score = 0;

let highScore;
if (localStorage.getItem('highScore') != null) {
    highScore = localStorage.getItem('highScore');
} else {
    highScore = 0;
}

let displayScore = document.getElementById("score");
let displayHighScore = document.getElementById("highscore");
displayHighScore.innerHTML = "High Score: " + highScore;

// Displays
function updateBoard(board) {
    let count = 0;
    if (!cells || cells.length !== 16) {
        console.error("Error: The board element is not correctly set up.");
        return;
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            cells[count].innerHTML = board[i][j];
            document.getElementById("c" + count).style.backgroundColor = colorDict[board[i][j]];
            count += 1;
        }
    }
}

function resetBoard(board) {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board.length; j++) {
            board[i][j] = 0;
        }
    }
}

function setupBoard(board) {
    let arr = [[0,0], [0,0]]

    arr[0][0] = randomNum(0, 3);
    arr[0][1] = randomNum(0, 3);
    while (arr[0][0] == arr[1][0] || arr[0][1] == arr[1][1]) {
        arr[1][0] = randomNum(0, 3);
        arr[1][1] = randomNum(0, 3);
    }

    board[arr[0][0]][arr[0][1]] = 2
    board[arr[1][0]][arr[1][1]] = (Math.random() < 0.8) ? 2 : 4;

    updateBoard(board);
}

function randomNum(lower, upper) { // inclusive
    return lower + Math.floor(Math.random() * (upper - lower + 1));
}

function combine(action, board) {
    let possibleCombinations = [
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true]
    ];

    if (action == 1 || action == 2) { // vertical

        for (let col = 0; col < board.length; col++) {
            for (let row = 1; row < board.length; row++) {
                if (board[row - 1][col] == board[row][col] && possibleCombinations[row - 1][col] == possibleCombinations[row][col]) {
                    possibleCombinations[row - 1][col] = false;
                    possibleCombinations[row][col] = false;
                    board[row - 1][col] = board[row - 1][col] + board[row][col];
                    board[row][col] = 0;

                    // Score Incrementation
                    score += board[row - 1][col];
                    displayScore.innerHTML = "Score: " + score;
                    if (highScore < score) {
                        highScore = score;
                        displayHighScore.innerHTML = "High Score: " + highScore;
                        localStorage.setItem('highScore', highScore);
                    }
                }
            }
        }

    } else { // horizontal

        for (let row = 0; row < board.length; row++) {
            for (let col = 1; col < board.length; col++) {
                if (board[row][col - 1] == board[row][col] && possibleCombinations[row][col - 1] == possibleCombinations[row][col]) {
                    possibleCombinations[row][col - 1] = false;
                    possibleCombinations[row][col] = false;
                    board[row][col - 1] = board[row][col - 1] + board[row][col];
                    board[row][col] = 0;

                    // Score Incrementation
                    score += board[row][col - 1];
                    displayScore.innerHTML = "Score: " + score;
                    if (highScore < score) {
                        highScore = score;
                        displayHighScore.innerHTML = "High Score: " + highScore;
                        localStorage.setItem('highScore', highScore);
                    }
                }
            }
        }

    }
    moveBoard(action, board);
    return board
}

function combineNoScore(action, board) {
    let possibleCombinations = [
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true],
        [true, true, true, true]
    ];

    if (action == 1 || action == 2) { // vertical
        for (let col = 0; col < board.length; col++) {
            for (let row = 1; row < board.length; row++) {
                if (board[row - 1][col] == board[row][col] && 
                    possibleCombinations[row - 1][col] == possibleCombinations[row][col]
                ) {
                    possibleCombinations[row - 1][col] = false;
                    possibleCombinations[row][col] = false;
                    
                    board[row - 1][col] += board[row][col];
                    board[row][col] = 0;
                }
            }
        }
    } else { // horizontal
        for (let row = 0; row < board.length; row++) {
            for (let col = 1; col < board.length; col++) {
                if (board[row][col - 1] == board[row][col] && 
                    possibleCombinations[row][col - 1] == possibleCombinations[row][col]
                ) {
                    possibleCombinations[row][col - 1] = false;
                    possibleCombinations[row][col] = false;
                    
                    board[row][col - 1] += board[row][col];
                    board[row][col] = 0;
                }
            }
        }
    }

    moveBoard(action, board);
    return board;
}


function moveBoard(action, board) {
    for (let swap = 0; swap < 3; swap++) { 
        if (action == 1) { // up
            for (let col = 0; col < board.length; col++) {
                for (let row = 1; row < board.length; row++) {
                    if (board[row - 1][col] == 0) {
                        board[row - 1][col] = board[row][col];
                        board[row][col] = 0;
                    }
                }
            }
        } else if (action == 2) { // down
            for (let col = 0; col < board.length; col++) {
                for (let row = 0; row < board.length - 1; row++) {
                    if (board[row + 1][col] == 0) {
                        board[row + 1][col] = board[row][col];
                        board[row][col] = 0;
                    }
                }
            }
        } else if (action == 3) { // right
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board.length - 1; col++) {
                    if (board[row][col + 1] == 0) {
                        board[row][col + 1] = board[row][col];
                        board[row][col] = 0;
                    }
                }
            }
        } else if (action == 4) { // left
            for (let row = 0; row < board.length; row++) {
                for (let col = 1; col < board.length; col++) {
                    if (board[row][col - 1] == 0) {
                        board[row][col - 1] = board[row][col];
                        board[row][col] = 0;
                    }
                }
            }
        }
    }
    return board
}

function spawnRandomNum(action, board) {
    if (!(boardFull(board) || noCombinations(board) && previousDirection == action)) {
        let row = randomNum(0, 3);
        let col = randomNum(0, 3);
        while (board[row][col] != 0) {
            row = randomNum(0, 3);
            col = randomNum(0, 3);
        }
        board[row][col] = (Math.random() < 0.8) ? 2 : 4;
    }
}

function boardFull(board) {
    for (let row of board) {
        for (let num of row) {
            if (num == 0) return false
        }
    }
    return true
}

function checkWin(board) {
    for (let row of board) {
        for (let value of row) {
            if (value == 2048) {
                message(true);
            }
        }
    }
}

function checkLoss(board) {
    if (boardFull(board) && noCombinations(board)) {
        message(false);
    }
}

function noCombinations(board) {
    let previousBoard = board.map(innerArray => innerArray.slice());
    let newBoard;
    for (let i = 1; i < 5; i++) newBoard = combineNoScore(i, previousBoard);
    if (newBoard == board) return true;
    return false;
}

function message(win) {
    if (win) {
        alert("You Won");
    } else {
        alert("Game Over");
        resetBoard(board);
        setupBoard(board);
        score = 0;
    }
}

function move(action, gameboard) {
    board = combine(action, gameboard)
    spawnRandomNum(action, board);
    updateBoard(board);
    checkWin(board);
    checkLoss(board);
    previousDirection = action;
}

document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowUp") move(1, board); // console.log('Up');
    else if (event.key === "ArrowDown") move(2, board); // console.log('Down'); 
    else if (event.key === "ArrowRight") move(3, board); // console.log('Right'); 
    else if (event.key === "ArrowLeft") move(4, board); // console.log('Left'); 
});

setupBoard(board);