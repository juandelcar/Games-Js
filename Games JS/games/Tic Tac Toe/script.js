const canvas = document.getElementById('ticTacToeCanvas');
const ctx = canvas.getContext('2d');

const cellSize = 100;
const grid = [['', '', ''], ['', '', ''], ['', '', '']];
let currentPlayer = 'X';
let wins = 0;
let draws = 0;
let losses = 0;

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1e6241';
    ctx.lineWidth = 1;

    for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 1);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }
}

function drawX(x, y) {
    ctx.strokeStyle = '#FF0000';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(x * cellSize + 10, y * cellSize + 10);
    ctx.lineTo((x + 1) * cellSize - 10, (y + 1) * cellSize - 10);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((x + 1) * cellSize - 10, y * cellSize + 10);
    ctx.lineTo(x * cellSize + 10, (y + 1) * cellSize - 10);
    ctx.stroke();
}

function drawO(x, y) {
    ctx.strokeStyle = '#0000FF';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.arc((x + 0.5) * cellSize, (y + 0.5) * cellSize, cellSize / 2 - 10, 0, Math.PI * 2);
    ctx.stroke();
}

function checkWinner() {
  for (let i = 0; i < 3; i++) {
      if (grid[i][0] !== '' && grid[i][0] === grid[i][1] && grid[i][0] === grid[i][2]) {
          handleWin(grid[i][0]);
          return;
      }
  }

  for (let i = 0; i < 3; i++) {
      if (grid[0][i] !== '' && grid[0][i] === grid[1][i] && grid[0][i] === grid[2][i]) {
          handleWin(grid[0][i]);
          return;
      }
  }

  if (grid[0][0] !== '' && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
      handleWin(grid[0][0]);
      return;
  }

  if (grid[0][2] !== '' && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]) {
      handleWin(grid[0][2]);
      return;
  }

  let isDraw = true;
  for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
          if (grid[i][j] === '') {
              isDraw = false;
              break;
          }
      }
  }

  if (isDraw) {
      handleDraw();
  }
}

function handleWin(winner) {
    if (winner === 'X') {
        document.getElementById('winO').style.display = 'block';
        losses++;
    } else {
        document.getElementById('winX').style.display = 'block';
        wins++;
    }
    updateScore();
    resetBoard(); 
}

function handleDraw() {
    document.getElementById('isdraw').style.display = 'block';
    draws++;
    updateScore();
    resetBoard();
}

function updateScore() {
    document.getElementById('wins').innerText = wins;
    document.getElementById('draws').innerText = draws;
    document.getElementById('losses').innerText = losses;
}

function handleClick(event) {
    const x = Math.floor(event.offsetX / cellSize);
    const y = Math.floor(event.offsetY / cellSize);

    if (grid[y][x] === '') {
        grid[y][x] = currentPlayer;
        if (currentPlayer === 'X') {
            drawX(x, y);
            currentPlayer = 'O';
        } else {
            drawO(x, y);
            currentPlayer = 'X';
        }

        checkWinner();
    }
}

canvas.addEventListener('click', handleClick);

drawGrid();

document.addEventListener("DOMContentLoaded", function () {
    const resetButton = document.querySelector('.btnreset');

    resetButton.addEventListener('click', function () {
        wins = 0;
        draws = 0;
        losses = 0;
        updateScore();
    });
});

function resetBoard() {
    grid.forEach(row => {
        row.fill('');
    });
    currentPlayer = 'X';
    drawGrid();
}
