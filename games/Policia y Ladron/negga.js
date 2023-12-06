const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const emojiSize = 40;
const police = "👮";
const thief = "🏃🏿‍♂";
const boost = "👟";
const obstacle = "🚧";
const moneyBag = "💼";
const ring = "💍";
const randomMoney = "💵";

let policeX = canvas.width / 2 - emojiSize / 2;
let policeY = canvas.height - emojiSize - 10;

let thiefX = canvas.width / 2 - emojiSize / 2;
let thiefY = canvas.height / 2 - emojiSize / 2;
let thiefSpeedX = 2;
let thiefSpeedY = 1; 

let powerObjects = [
  { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: moneyBag },
  { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: ring },
  { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: randomMoney },
];

let obstacles = [
  { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize) },
  { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize) },
];

let obstacleSpeed = 1;

let speedBoostDuration = 5000;
let immunityDuration = 7000;
let immunityActive = false;
let speedBoostActive = false;
let gameOver = false;

let moneyBagActive = true;
let ringActive = true;
let randomMoneyActive = true;

let gameStarted = false;

let startTime;
let elapsedTime;

let animationFrameId;

document.getElementById("startButton").addEventListener("click", () => {
  if (!gameStarted || gameOver) {
    gameStarted = true;
    gameOver = false;

    policeX = canvas.width / 2 - emojiSize / 2;
    policeY = canvas.height - emojiSize - 10;

    thiefX = canvas.width / 2 - emojiSize / 2;
    thiefY = canvas.height / 2 - emojiSize / 2;
    thiefSpeedX = 2;
    thiefSpeedY = 1; 

    powerObjects = [
      { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: moneyBag },
      { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: ring },
      { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize), type: randomMoney },
    ];

    obstacles = [
      { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize) },
      { x: Math.random() * (canvas.width - emojiSize), y: Math.random() * (canvas.height - emojiSize) },
    ];

    obstacleSpeed = 1;

    speedBoostDuration = 5000;
    immunityDuration = 7000;
    immunityActive = false;
    speedBoostActive = false;
    moneyBagActive = true;
    ringActive = true;
    randomMoneyActive = true;

    startTime = Date.now();

    animationFrameId = requestAnimationFrame(draw);
  }
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (event) => {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchmove", (event) => {
  event.preventDefault();
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;

  const deltaX = touchX - touchStartX;
  const deltaY = touchY - touchStartY;

  thiefSpeedX = deltaX / 50;
  thiefSpeedY = deltaY / 50;
});

canvas.addEventListener("touchend", () => {
  thiefSpeedX = 0;
  thiefSpeedY = 0;
});

document.addEventListener("keydown", (event) => {
  if (!gameStarted || gameOver) return;

  switch (event.key) {
    case "ArrowLeft":
      thiefSpeedX = -2;
      thiefSpeedY = 0;
      break;
    case "ArrowRight":
      thiefSpeedX = 2;
      thiefSpeedY = 0;
      break;
    case "ArrowUp":
      thiefSpeedX = 0;
      thiefSpeedY = -2;
      break;
    case "ArrowDown":
      thiefSpeedX = 0;
      thiefSpeedY = 2;
      break;
  }
});

document.addEventListener("keyup", () => {
  thiefSpeedX = 0;
  thiefSpeedY = 0;
});

function draw() {
  if (!gameStarted || gameOver) return;

  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "40px Arial";
  ctx.fillText(police, policeX, policeY);

  ctx.fillText(thief, thiefX, thiefY);

  ctx.font = "20px Arial";
  ctx.fillText("Tiempo: " + elapsedTime + " segundos", 10, 20);

  if (
    powerObjects[0].x < thiefX + emojiSize &&
    powerObjects[0].x + emojiSize > thiefX &&
    powerObjects[0].y < thiefY + emojiSize &&
    powerObjects[0].y + emojiSize > thiefY
  ) {
    speedBoostActive = true;
    moneyBagActive = false;
    setTimeout(() => {
      speedBoostActive = false;
      moneyBagActive = true;
      powerObjects[0].x = Math.random() * (canvas.width - emojiSize);
      powerObjects[0].y = Math.random() * (canvas.height - emojiSize);
    }, speedBoostDuration);
  }

  if (
    powerObjects[1].x < thiefX + emojiSize &&
    powerObjects[1].x + emojiSize > thiefX &&
    powerObjects[1].y < thiefY + emojiSize &&
    powerObjects[1].y + emojiSize > thiefY
  ) {
    immunityActive = true;
    ringActive = false;
    setTimeout(() => {
      immunityActive = false;
      ringActive = true;
      powerObjects[1].x = Math.random() * (canvas.width - emojiSize);
      powerObjects[1].y = Math.random() * (canvas.height - emojiSize);
    }, immunityDuration);
  }

  if (
    powerObjects[2].x < thiefX + emojiSize &&
    powerObjects[2].x + emojiSize > thiefX &&
    powerObjects[2].y < thiefY + emojiSize &&
    powerObjects[2].y + emojiSize > thiefY
  ) {
    const randomPower = Math.floor(Math.random() * 2);

    switch (randomPower) {
      case 0:
        immunityActive = true;
        ringActive = false;
        setTimeout(() => {
          immunityActive = false;
          ringActive = true;
        }, immunityDuration);
        break;
      case 1:
        speedBoostActive = true;
        moneyBagActive = false;
        setTimeout(() => {
          speedBoostActive = false;
          moneyBagActive = true;
        }, speedBoostDuration);
        break;
    }

    powerObjects[2].x = Math.random() * (canvas.width - emojiSize);
    powerObjects[2].y = Math.random() * (canvas.height - emojiSize);
  }

  if (randomMoneyActive) {
    ctx.fillText(randomMoney, powerObjects[2].x, powerObjects[2].y);
  }

  if (!speedBoostActive && moneyBagActive) {
    ctx.fillText(boost, powerObjects[0].x, powerObjects[0].y);
  }

  if (!immunityActive && ringActive) {
    ctx.fillText(ring, powerObjects[1].x, powerObjects[1].y);
  }

  if (randomMoneyActive) {
    ctx.fillText(randomMoney, powerObjects[2].x, powerObjects[2].y);
  }

  obstacles.forEach((obstaclePos) => {
    ctx.fillText(obstacle, obstaclePos.x, obstaclePos.y);
  });

  if (!immunityActive && obstacles.some((obstaclePos) => isCollision(thiefX, thiefY, obstaclePos.x, obstaclePos.y))) {
    endGame();
    return;
  }

  if (!immunityActive && isCollision(thiefX, thiefY, policeX, policeY)) {
    endGame();
    return;
  }

  thiefX += speedBoostActive ? thiefSpeedX * 2 : thiefSpeedX;
  thiefY += speedBoostActive ? thiefSpeedY * 2 : thiefSpeedY;

  thiefX = (thiefX + canvas.width) % canvas.width;
  thiefY = (thiefY + canvas.height) % canvas.height;

  if (policeX < thiefX) {
    policeX += 1;
  } else if (policeX > thiefX) {
    policeX -= 1;
  }

  if (policeY < thiefY) {
    policeY += 1;
  } else if (policeY > thiefY) {
    policeY -= 1;
  }

  animationFrameId = requestAnimationFrame(draw);
}

async function endGame() {
  cancelAnimationFrame(animationFrameId);

  await Swal.fire({
    title: "¡Oh no!",
    text: `Has Perdido..`,
    icon: "error",
    confirmButtonText: "OK",
  });
  gameOver = true;
}

function isCollision(x1, y1, x2, y2) {
  return x1 < x2 + emojiSize && x1 + emojiSize > x2 && y1 < y2 + emojiSize && y1 + emojiSize > y2;
}