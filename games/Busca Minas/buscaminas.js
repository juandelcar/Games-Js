const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

let rows, cols, mines;

let board = [];
let revealedCells = 0;
let isGameOver = false;

function startGame(difficulty) {
    setDifficulty(difficulty);
    initializeBoard();
    drawBoard();
    canvas.addEventListener('click', handleCellClick);
}

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'facil':
            rows = 8;
            cols = 8;
            mines = 10;
            break;
        case 'medio':
            rows = 10;
            cols = 10;
            mines = 15;
            break;
        case 'dificil':
            rows = 12;
            cols = 12;
            mines = 20;
            break;
        default:
            rows = 10;
            cols = 10;
            mines = 15;
            break;
    }
}

function initializeBoard() {
    board = [];
    revealedCells = 0;
    isGameOver = false;

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = {
                isMine: false,
                isRevealed: false,
                neighborMines: 0
            };
        }
    }

    for (let i = 0; i < mines; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * rows);
            col = Math.floor(Math.random() * cols);
        } while (board[row][col].isMine);

        board[row][col].isMine = true;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < rows && c >= 0 && c < cols) {
                    board[r][c].neighborMines++;
                }
            }
        }
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / cols;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * cellSize;
            const y = i * cellSize;

            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, cellSize, cellSize);

            const cell = board[i][j];

            if (cell.isRevealed) {
                ctx.fillStyle = cell.isMine ? 'red' : 'lightgray';
                ctx.fillRect(x, y, cellSize, cellSize);

                if (!cell.isMine && cell.neighborMines > 0) {
                    ctx.font = 'bold 16px Arial';
                    ctx.fillStyle = 'black';
                    ctx.textAlign = 'center';
                    ctx.fillText(cell.neighborMines, x + cellSize / 2, y + cellSize / 2 + 5);
                }
            }
        }
    }
}

function handleCellClick(event) {
    if (isGameOver) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const cellSize = canvas.width / cols;
    const clickedCol = Math.floor(mouseX / cellSize);
    const clickedRow = Math.floor(mouseY / cellSize);

    const clickedCell = board[clickedRow][clickedCol];

    if (!clickedCell.isRevealed) {
        clickedCell.isRevealed = true;
        revealedCells++;

        if (clickedCell.isMine) {
            isGameOver = true;
            revealAllCells();
            Swal.fire({
                icon: 'error',
                title: '¡Boom!',
                text: 'Juego Terminado',
            });
        } else {
            if (revealedCells === rows * cols - mines) {
                isGameOver = true;
                Swal.fire({
                    icon: 'success',
                    title: '¡Felicidades!',
                    text: 'Has Ganado',
                });
            }
        }

        drawBoard();
    }
}

function revealAllCells() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            board[i][j].isRevealed = true;
        }
    }

    drawBoard();
}

startGame('medio');
