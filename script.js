const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const gameOverMenu = document.getElementById('game-over-menu');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const restartButton = document.getElementById('restart-btn');

const cellSize = 20;
const areaSize = 500;
let snake = [{ x: 0, y: 0 }];
let direction = 'RIGHT';
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval;


highScoreDisplay.textContent = `Recorde: ${highScore}`;


function drawSnake() {
    gameArea.innerHTML = '';
    snake.forEach(segment => {
        const snakeSegment = document.createElement('div');
        snakeSegment.classList.add('snake');
        snakeSegment.style.left = `${segment.x}px`;
        snakeSegment.style.top = `${segment.y}px`;
        gameArea.appendChild(snakeSegment);
    });

    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    gameArea.appendChild(foodElement);
}

function updateSnake() {
    const head = { ...snake[0] };

    if (direction === 'RIGHT') head.x += cellSize;
    if (direction === 'LEFT') head.x -= cellSize;
    if (direction === 'UP') head.y -= cellSize;
    if (direction === 'DOWN') head.y += cellSize;

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        food = generateFood();
        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
    } else {
        snake.pop();
        snake.unshift(head);
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.y < 0 || head.x >= areaSize || head.y >= areaSize) {
        endGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function generateFood() {
    const x = Math.floor(Math.random() * (areaSize / cellSize)) * cellSize;
    const y = Math.floor(Math.random() * (areaSize / cellSize)) * cellSize;

    if (snake.some(segment => segment.x === x && segment.y === y)) {
        return generateFood();
    }
    return { x, y };
}

function endGame() {
    clearInterval(gameInterval);
    gameOverMenu.style.display = 'block';
    finalScoreDisplay.textContent = `Pontuação: ${score}`;

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    highScoreDisplay.textContent = `Recorde: ${highScore}`;
}

function restartGame() {
    snake = [{ x: 0, y: 0 }];
    direction = 'RIGHT';
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    food = generateFood();
    gameOverMenu.style.display = 'none';
    gameInterval = setInterval(gameLoop, 200);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});

function gameLoop() {
    updateSnake();
    checkCollision();
    drawSnake();
}

restartButton.addEventListener('click', restartGame);

restartGame();
