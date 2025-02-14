const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startButton = document.getElementById('startButton');

// Game constants
const GRID_SIZE = 20;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 600;
const INITIAL_SNAKE_LENGTH = 4;
let gameSpeed = 100; // Milliseconds between updates

// Set canvas size
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

// Game state
let score = 0;
let snake = {
    body: [],
    direction: { x: 1, y: 0 },
    newDirection: { x: 1, y: 0 }
};

let food = {
    x: 0,
    y: 0
};

// Add game over state
let isGameOver = false;

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;

const FOOD_TYPES = [
    { color: '#ff0000', points: 10, effect: 'normal' },
    { color: '#00ff00', points: 20, effect: 'speed' }
];

// Initialize game
function initGame() {
    // Create initial snake
    snake.body = [];
    const centerX = Math.floor(GAME_WIDTH / (2 * GRID_SIZE)) * GRID_SIZE;
    const centerY = Math.floor(GAME_HEIGHT / (2 * GRID_SIZE)) * GRID_SIZE;
    
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.body.push({
            x: centerX - (i * GRID_SIZE),
            y: centerY
        });
    }
    
    // Reset direction
    snake.direction = { x: 1, y: 0 };
    snake.newDirection = { x: 1, y: 0 };
    
    // Generate first food
    generateFood();
    
    // Reset score
    score = 0;
    updateScore();
    
    // Reset game speed
    gameSpeed = 100;
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
}

function generateFood() {
    while (true) {
        const gridWidth = GAME_WIDTH / GRID_SIZE;
        const gridHeight = GAME_HEIGHT / GRID_SIZE;
        
        food.x = Math.floor(Math.random() * gridWidth) * GRID_SIZE;
        food.y = Math.floor(Math.random() * gridHeight) * GRID_SIZE;
        food.type = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
        
        let onSnake = snake.body.some(segment => segment.x === food.x && segment.y === food.y);
        
        if (!onSnake) break;
    }
}

function updateScore() {
    scoreElement.textContent = score;
    if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = highScore;
        localStorage.setItem('highScore', highScore);
    }
}

function checkSelfCollision(head) {
    return snake.body.some((segment, index) => {
        if (index === 0) return false; // Skip head
        return segment.x === head.x && segment.y === head.y;
    });
}

function applyFoodEffect(effect) {
    if (effect === 'speed') {
        gameSpeed = Math.max(70, gameSpeed - 5);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }
}

function update() {
    if (isGameOver) return;

    snake.direction = snake.newDirection;
    
    const head = {
        x: snake.body[0].x + snake.direction.x * GRID_SIZE,
        y: snake.body[0].y + snake.direction.y * GRID_SIZE
    };
    
    if (head.x >= GAME_WIDTH) head.x = 0;
    if (head.x < 0) head.x = GAME_WIDTH - GRID_SIZE;
    if (head.y >= GAME_HEIGHT) head.y = 0;
    if (head.y < 0) head.y = GAME_HEIGHT - GRID_SIZE;
    
    if (checkSelfCollision(head)) {
        isGameOver = true;
        return;
    }
    
    snake.body.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        score += food.type.points;
        updateScore();
        applyFoodEffect(food.type.effect);
        generateFood();
    } else {
        snake.body.pop();
    }
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '24px Arial';
    ctx.fillText('Press R to Restart', canvas.width / 2, canvas.height / 2 + 40);
    startButton.style.display = 'block';
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    for (let x = 0; x < GAME_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, GAME_HEIGHT);
        ctx.stroke();
    }
    for (let y = 0; y < GAME_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(GAME_WIDTH, y);
        ctx.stroke();
    }
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    
    snake.body.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#ffcc00' : '#fff';
        ctx.beginPath();
        ctx.arc(
            segment.x + GRID_SIZE/2,
            segment.y + GRID_SIZE/2,
            GRID_SIZE/2 - 1,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });
    
    ctx.fillStyle = food.type.color;
    ctx.beginPath();
    ctx.arc(
        food.x + GRID_SIZE/2,
        food.y + GRID_SIZE/2,
        GRID_SIZE/2 - 1,
        0,
        Math.PI * 2
    );
    ctx.fill();

    if (isGameOver) {
        drawGameOver();
    }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    if (isGameOver && event.key === 'r') {
        initGame();
        isGameOver = false;
        startButton.style.display = 'none';
        return;
    }

    switch (event.key) {
        case 'ArrowUp':
            if (snake.direction.y === 0) {
                snake.newDirection = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (snake.direction.y === 0) {
                snake.newDirection = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (snake.direction.x === 0) {
                snake.newDirection = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (snake.direction.x === 0) {
                snake.newDirection = { x: 1, y: 0 };
            }
            break;
    }
});

// Game loop
let gameInterval;
function gameLoop() {
    update();
    draw();
}

// Start game
initGame();
gameInterval = setInterval(gameLoop, gameSpeed);

startButton.addEventListener('click', () => {
    initGame();
    isGameOver = false;
    startButton.style.display = 'none';
}); 