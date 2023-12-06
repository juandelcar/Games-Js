let wins = 0;
let losses = 0;
let draws = 0;

const winElement = document.getElementById("wins");
const lossElement = document.getElementById("losses");
const drawElement = document.getElementById("draws");
const resetButton = document.querySelector("#btn input");

function updateScore(result) {
  if (result === "win") {
    wins++;
    winElement.textContent = wins;
  } else if (result === "loss") {
    losses++;
    lossElement.textContent = losses;
  } else if (result === "draw") {
    draws++;
    drawElement.textContent = draws;
  }
}

function resetScore() {
  wins = 0;
  losses = 0;
  draws = 0;
  winElement.textContent = wins;
  lossElement.textContent = losses;
  drawElement.textContent = draws;
}

resetButton.addEventListener("click", resetScore);

document
  .querySelectorAll('input[name="rock-paper-scissors"]')
  .forEach((input) => {
    input.addEventListener("change", function () {
      const userChoice = this.id.split("-")[0];
      const computerChoice = this.id.split("-")[1];

      if (userChoice === computerChoice) {
        updateScore("draw");
      } else if (
        (userChoice === "rock" && computerChoice === "scissors") ||
        (userChoice === "paper" && computerChoice === "rock") ||
        (userChoice === "scissors" && computerChoice === "paper")
      ) {
        updateScore("win");
      } else {
        updateScore("loss");
      }
    });
  });
