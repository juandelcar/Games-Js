const categories = ["frutas", "programacion", "peliculas", "animales"];
const wordsByCategory = {
  frutas: ["manzana", "banana", "uva", "pera", "kiwi"],
  programacion: ["javascript", "developer", "programming", "hangman", "coding"],
  peliculas: ["matrix", "inception", "avatar", "titanic", "forrest gump"],
  animales: ["elefante", "tigre", "leon", "jirafa", "mono"]
};

let selectedCategory = "";
let selectedWord = "";
let guessedWord = [];
let incorrectGuesses = 0;
const maxIncorrectGuesses = 6;
let isGameOver = false;
let winCount = parseInt(localStorage.getItem("winCount")) || 0;
let lossCount = parseInt(localStorage.getItem("lossCount")) || 0;

const canvas = document.getElementById("hangmanCanvas");
const ctx = canvas.getContext("2d");

const winCountElement = document.getElementById("win-count");
const lossCountElement = document.getElementById("loss-count");

function drawHangman() {
  ctx.beginPath();
  ctx.moveTo(100, 50);
  ctx.lineTo(100, 300);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(100, 50);
  ctx.lineTo(200, 50);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(200, 50);
  ctx.lineTo(200, 100);
  ctx.stroke();

  switch (incorrectGuesses) {
    case 1:
      ctx.beginPath();
      ctx.arc(200, 150, 50, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 2:
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.lineTo(200, 300);
      ctx.stroke();
      break;
    case 3:
      ctx.beginPath();
      ctx.moveTo(200, 225);
      ctx.lineTo(150, 175);
      ctx.stroke();
      break;
    case 4:
      ctx.beginPath();
      ctx.moveTo(200, 225);
      ctx.lineTo(250, 175);
      ctx.stroke();
      break;
    case 5:
      ctx.beginPath();
      ctx.moveTo(200, 300);
      ctx.lineTo(150, 350);
      ctx.stroke();
      break;
    case 6:
      ctx.beginPath();
      ctx.moveTo(200, 300);
      ctx.lineTo(250, 350);
      ctx.stroke();
      break;
  }
}

function updateWord() {
  document.getElementById("word-container").innerText = guessedWord.join(" ");
}

function updateCounts() {
  winCountElement.textContent = winCount;
  lossCountElement.textContent = lossCount;
}

function selectCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function selectWord(category) {
  const wordsInCategory = wordsByCategory[category];
  return wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];
}

function initializeGame() {
  selectedCategory = selectCategory();
  selectedWord = selectWord(selectedCategory);
  guessedWord = Array(selectedWord.length).fill("_");
  incorrectGuesses = 0;
  isGameOver = false;

  Swal.fire({
    title: "Categoría seleccionada",
    text: `La categoría es: ${selectedCategory}`,
    icon: "info",
    confirmButtonText: "Empezar juego",
  }).then(() => {
    updateWord();
    drawHangman();
    updateCounts();
  });
}

function guessLetter(letter) {
  letter = letter.toLowerCase();
  if (!isGameOver) {
    if (selectedWord.includes(letter)) {
      for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === letter) {
          guessedWord[i] = letter;
        }
      }
      updateWord();
    } else {
      incorrectGuesses++;
      drawHangman();
    }

    if (guessedWord.join("") === selectedWord) {
      handleGameEnd(true);
    } else if (incorrectGuesses === maxIncorrectGuesses) {
      handleGameEnd(false);
    }
    updateCounts();
  }
}

function resetGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  initializeGame();
}

function handleGameEnd(isWinner) {
  isGameOver = true;
  if (isWinner) {
    Swal.fire({
      title: "¡Felicidades!",
      text: "Has adivinado la palabra.",
      icon: "success",
      confirmButtonText: "OK",
    }).then(() => {
      winCount++;
      localStorage.setItem("winCount", winCount);
      resetGame();
    });
  } else {
    Swal.fire({
      title: "¡Oh no!",
      text: `Has agotado tus intentos. La palabra era "${selectedWord}".`,
      icon: "error",
      confirmButtonText: "OK",
    }).then(() => {
      lossCount++;
      localStorage.setItem("lossCount", lossCount);
      resetGame();
    });
  }
}

document.getElementById("letter-input").addEventListener("input", (event) => {
  const inputText = event.target.value.trim().toLowerCase();
  if (/^[a-z]$/.test(inputText)) {
    guessLetter(inputText);
    event.target.value = ""; 
  }
});

const canvasElement = document.getElementById("hangmanCanvas");
let touchStartX;

canvasElement.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
});

canvasElement.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;

  if (touchEndX < touchStartX) {
    const inputElement = document.getElementById("letter-input");
    inputElement.focus();
  }
});

resetGame();
