const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const gameOverMenu = document.getElementById('game-over-menu');
const finalScoreDisplay = document.getElementById('final-score');
const highScoreDisplay = document.getElementById('high-score');
const restartButton = document.getElementById('restart-btn');
const pauseMessage = document.createElement('div');

pauseMessage.style.position = 'absolute';
pauseMessage.style.top = '50%';
pauseMessage.style.left = '50%';
pauseMessage.style.transform = 'translate(-50%, -50%)';
pauseMessage.style.color = 'yellow';
pauseMessage.style.fontSize = '24px';
pauseMessage.style.fontWeight = 'bold';
pauseMessage.style.display = 'none';
pauseMessage.textContent = 'Jogo Pausado';
document.body.appendChild(pauseMessage);

const cellSize = 20;
const areaSize = 500;
let snake = [{ x: 0, y: 0 }];
let direction = 'RIGHT';
let food = generateFood();
let isImmortal = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let isPaused = false;
let gameInterval;
let gameSpeed = 100;

highScoreDisplay.textContent = `Recorde: ${highScore}`;


function drawSnake() {
    gameArea.innerHTML = '';
    snake.forEach((segment, index) => {
        const snakeSegment = document.createElement('div');
        snakeSegment.classList.add('snake');
        snakeSegment.style.left = `${segment.x}px`;
        snakeSegment.style.top = `${segment.y}px`;

        if (index === 0) {
            snakeSegment.style.clipPath = getTriangleDirection(direction);
        } else {
            snakeSegment.style.clipPath = 'none';
        }

        gameArea.appendChild(snakeSegment);
    });

    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    gameArea.appendChild(foodElement);
}


function getTriangleDirection(dir) {
    switch (dir) {
        case 'RIGHT': return 'polygon(0% 0%, 100% 50%, 0% 100%)';
        case 'LEFT': return 'polygon(100% 0%, 0% 50%, 100% 100%)';
        case 'UP': return 'polygon(50% 0%, 0% 100%, 100% 100%)';
        case 'DOWN': return 'polygon(0% 0%, 100% 0%, 50% 100%)';
        default: return 'none';
    }
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
        if (isImmortal) {
            autoTurn(head);
        } else {
            endGame();
        }
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            if (!isImmortal) endGame();
        }
    }
}

function autoTurn(head) {
    if (head.x < 0) direction = 'RIGHT';
    else if (head.x >= areaSize) direction = 'LEFT';
    else if (head.y < 0) direction = 'DOWN';
    else if (head.y >= areaSize) direction = 'UP';
}


function generateRandomPosition() {
    const x = Math.floor(Math.random() * (areaSize / cellSize)) * cellSize;
    const y = Math.floor(Math.random() * (areaSize / cellSize)) * cellSize;
    return { x, y };
}


function generateFood() {
    let position;
    do {
        position = generateRandomPosition();
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
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
    isPaused = false;
    pauseMessage.style.display = 'none';
    gameOverMenu.style.display = 'none';
    startGame();
}


restartButton.addEventListener('click', restartGame);


function startGame() {
    gameInterval = setInterval(() => {
        updateSnake();
        checkCollision();
        drawSnake();
    }, gameSpeed);
}


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        isPaused = !isPaused;
        pauseMessage.style.display = isPaused ? 'block' : 'none';
        if (isPaused) {
            clearInterval(gameInterval);
        } else {
            startGame();
        }
    }

    if (!isPaused) {
        if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
        if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
        if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    }
});


restartGame();
