const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDiv = document.getElementById('score');
const restartBtn = document.getElementById('restart');

const tileSize = 20; // 30x30 grid
const tileCount = canvas.width / tileSize;
let eatSound = new Audio('eat.mp3');
eatSound.volume = 0.5;
let gameOverSound = new Audio('gameover.mp3');
gameOverSound.volume = 0.5;
let bgMusic = new Audio('bgmusic.mp3');
bgMusic.volume = 0.2;
bgMusic.loop = true;
console.log(eatSound, gameOverSound, bgMusic);
let snake, direction, food, score, gameInterval, changingDirection;

function resetGame() {
  bgMusic.currentTime = 0;
  bgMusic.play();
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: -1 }; // moving up at start
  score = 0;
  food = randomFood();
  changingDirection = false;
  updateScore();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 120);
}

function gameLoop() {
  if (isGameOver()) {
    gameOverSound.play();
    bgMusic.pause();
    clearInterval(gameInterval);
    scoreDiv.textContent = `Game Over! Final Score: ${score}`;
    return;
  }
  moveSnake();
  if (didEatFood()) {
    eatSound.play();
    score++;
    updateScore();
    food = randomFood();
  } else {
    snake.pop();
  }
  draw();
  changingDirection = false;
}

function draw() {
  // Clear canvas
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.fillRect
  (food.x * tileSize, food.y * tileSize, tileSize, tileSize);

  // Draw snake
  ctx.fillStyle = '#0FA';
  snake.forEach((part, i) => {
    ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
  });
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
}

function isGameOver() {
  const [head, ...body] = snake;
  // Wall collision
  if (
    head.x < 0 || head.x >= tileSize ||
    head.y < 0 || head.y >= tileSize
  ) {
    return true;
  }

  // Self collision
  if(body.length >2){

  return body.some(segment => segment.x === head.x && segment.y === head.y);
}
return false;
}

function didEatFood() {
  return snake[0].x === food.x && snake[0].y === food.y;
}

function randomFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } while (snake.some(part => part.x === pos.x && part.y === pos.y));
  return pos;
}

function updateScore() {
  scoreDiv.textContent = `Score: ${score}`;
}

document.addEventListener('keydown', e => {
  if (changingDirection) return;
  changingDirection = true;
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 1) break;
      direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
});

restartBtn.addEventListener('click', () => {
  bgMusic.currentTime=0;
  bgMusic.play().catch (e => console.log(e));
  resetGame();
});