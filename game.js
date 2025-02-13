const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const SEGMENT_SIZE = 20;
const INITIAL_LENGTH = 3;

let score = 0;

// Food types
const FOOD_TYPES = [
    { color: 'red', points: 1, effect: 'grow' },
    { color: 'gold', points: 3, effect: 'grow2x' },
    { color: 'purple', points: 5, effect: 'speed' }
];

// Add after the FOOD_TYPES array
const OBSTACLES = {
    portal: { color: 'cyan', effect: 'teleport' },
    ghost: { color: 'rgba(255, 255, 255, 0.3)', effect: 'phasing' },
    rainbow: { color: 'gradient', effect: 'disco' }
};

let snake = {
    segments: [],
    speed: 1,
    dx: 0,
    dy: 0,
    baseSpeed: 1
};

// Food object
let food = {
    x: 0,
    y: 0,
    size: SEGMENT_SIZE,
    type: FOOD_TYPES[0]  // Default to regular food
};

// Add to the game variables
let activeEffects = {
    phasing: false,
    disco: false
};

let obstacles = [];
let portalPair = [];

// Initialize snake segments
function initSnake() {
    const centerX = Math.floor(canvas.width / 2);
    const centerY = Math.floor(canvas.height / 2);
    
    for (let i = 0; i < INITIAL_LENGTH; i++) {
        snake.segments.push({
            x: centerX - (i * SEGMENT_SIZE),
            y: centerY
        });
    }
}

// Generate random position for food
function generateFood() {
    const gridWidth = Math.floor(canvas.width / SEGMENT_SIZE);
    const gridHeight = Math.floor(canvas.height / SEGMENT_SIZE);
    
    food.x = Math.floor(Math.random() * gridWidth) * SEGMENT_SIZE;
    food.y = Math.floor(Math.random() * gridHeight) * SEGMENT_SIZE;
    
    // Randomly select food type
    food.type = FOOD_TYPES[Math.floor(Math.random() * FOOD_TYPES.length)];
    
    // Prevent food from spawning on snake
    const isOnSnake = snake.segments.some(segment => 
        segment.x === food.x && segment.y === food.y
    );
    
    if (isOnSnake) {
        generateFood(); // Try again
    }
}

// Update score
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Apply food effects
function applyFoodEffect(foodType) {
    switch(foodType.effect) {
        case 'grow':
            // Normal growth (1 segment)
            break;
        case 'grow2x':
            // Add an extra segment
            snake.segments.push({ ...snake.segments[snake.segments.length - 1] });
            break;
        case 'speed':
            // Temporary speed boost
            snake.speed = snake.baseSpeed * 1.5;
            setTimeout(() => {
                snake.speed = snake.baseSpeed;
            }, 5000); // Speed boost lasts 5 seconds
            break;
    }
    updateScore(foodType.points);
}

// Handle keyboard controls
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
            if (snake.dx === 0) { // Prevent reversing direction
                snake.dx = -1;
                snake.dy = 0;
            }
            break;
        case 'ArrowRight':
            if (snake.dx === 0) {
                snake.dx = 1;
                snake.dy = 0;
            }
            break;
        case 'ArrowUp':
            if (snake.dy === 0) {
                snake.dx = 0;
                snake.dy = -1;
            }
            break;
        case 'ArrowDown':
            if (snake.dy === 0) {
                snake.dx = 0;
                snake.dy = 1;
            }
            break;
    }
});

// Game loop with controlled frame rate
let lastTime = 0;
const FRAME_RATE = 1000 / 10; // Slower frame rate for grid-based movement

// Add new function to generate obstacles
function generateObstacle() {
    if (Math.random() < 0.2) { // 20% chance to spawn obstacle
        const gridWidth = Math.floor(canvas.width / SEGMENT_SIZE);
        const gridHeight = Math.floor(canvas.height / SEGMENT_SIZE);
        
        const type = Object.keys(OBSTACLES)[Math.floor(Math.random() * Object.keys(OBSTACLES).length)];
        
        if (type === 'portal' && portalPair.length < 2) {
            const portal = {
                x: Math.floor(Math.random() * gridWidth) * SEGMENT_SIZE,
                y: Math.floor(Math.random() * gridHeight) * SEGMENT_SIZE,
                type: OBSTACLES.portal
            };
            portalPair.push(portal);
            if (portalPair.length === 2) {
                obstacles.push(...portalPair);
            }
        } else {
            obstacles.push({
                x: Math.floor(Math.random() * gridWidth) * SEGMENT_SIZE,
                y: Math.floor(Math.random() * gridHeight) * SEGMENT_SIZE,
                type: OBSTACLES[type]
            });
        }
    }
}

// Modify gameLoop to include obstacles
function gameLoop(currentTime) {
    window.requestAnimationFrame(gameLoop);
    
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime < FRAME_RATE) return;
    
    lastTime = currentTime;
    
    if (Math.random() < 0.02) { // 2% chance each frame
        generateObstacle();
    }
    
    clearCanvas();
    drawObstacles();
    drawFood();
    updateSnakePosition();
    drawSnake();
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake
function drawSnake() {
    snake.segments.forEach((segment, index) => {
        ctx.beginPath();
        if (activeEffects.disco) {
            ctx.fillStyle = `hsl(${(Date.now() / 10 + index * 10) % 360}, 100%, 50%)`;
        } else if (activeEffects.phasing) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.arc(
            segment.x + SEGMENT_SIZE/2, 
            segment.y + SEGMENT_SIZE/2, 
            SEGMENT_SIZE/2 - 1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();
    });
}

// Draw the food
function drawFood() {
    ctx.beginPath();
    ctx.fillStyle = food.type.color;
    ctx.arc(
        food.x + SEGMENT_SIZE/2, 
        food.y + SEGMENT_SIZE/2, 
        SEGMENT_SIZE/2 - 1, 
        0, 
        Math.PI * 2
    );
    ctx.fill();
    ctx.closePath();
}

// Update snake position
function updateSnakePosition() {
    // Only update if snake is moving
    if (snake.dx === 0 && snake.dy === 0) return;

    // Calculate new head position
    let head = {
        x: snake.segments[0].x + (snake.dx * SEGMENT_SIZE), // Move by full segment size
        y: snake.segments[0].y + (snake.dy * SEGMENT_SIZE)
    };

    // Keep snake within bounds
    if (head.x + SEGMENT_SIZE > canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - SEGMENT_SIZE;
    if (head.y + SEGMENT_SIZE > canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - SEGMENT_SIZE;

    // Handle obstacle collisions
    head = handleObstacleCollision(head);

    // Add new head
    snake.segments.unshift(head);
    
    // Check food collision
    const hasEatenFood = checkCollision();
    
    // Only remove tail if food wasn't eaten
    if (!hasEatenFood) {
        snake.segments.pop();
    }
}

// Check collision between snake and food
function checkCollision() {
    const head = snake.segments[0];
    
    if (Math.abs(head.x - food.x) < SEGMENT_SIZE && 
        Math.abs(head.y - food.y) < SEGMENT_SIZE) {
        applyFoodEffect(food.type);
        generateFood();
        return true;
    }
    return false;
}

// Add new function to draw obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.beginPath();
        if (obstacle.type.color === 'gradient') {
            const gradient = ctx.createRadialGradient(
                obstacle.x + SEGMENT_SIZE/2, 
                obstacle.y + SEGMENT_SIZE/2, 
                0,
                obstacle.x + SEGMENT_SIZE/2, 
                obstacle.y + SEGMENT_SIZE/2, 
                SEGMENT_SIZE/2
            );
            gradient.addColorStop(0, `hsl(${Date.now() / 10 % 360}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${(Date.now() / 10 + 180) % 360}, 100%, 50%)`);
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = obstacle.type.color;
        }
        ctx.arc(
            obstacle.x + SEGMENT_SIZE/2, 
            obstacle.y + SEGMENT_SIZE/2, 
            SEGMENT_SIZE/2 - 1, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
        ctx.closePath();
    });
}

// Add handleObstacleCollision call in updateSnakePosition
// After head position calculation and before bounds checking:
function handleObstacleCollision(head) {
    obstacles.forEach((obstacle, index) => {
        if (Math.abs(head.x - obstacle.x) < SEGMENT_SIZE && 
            Math.abs(head.y - obstacle.y) < SEGMENT_SIZE) {
            switch(obstacle.type.effect) {
                case 'teleport':
                    const otherPortal = portalPair[portalPair[0] === obstacle ? 1 : 0];
                    head.x = otherPortal.x;
                    head.y = otherPortal.y;
                    break;
                case 'phasing':
                    activeEffects.phasing = true;
                    setTimeout(() => {
                        activeEffects.phasing = false;
                    }, 5000);
                    obstacles.splice(index, 1);
                    break;
                case 'disco':
                    activeEffects.disco = true;
                    setTimeout(() => {
                        activeEffects.disco = false;
                    }, 8000);
                    obstacles.splice(index, 1);
                    break;
            }
        }
    });
    return head;
}

// Initialize the game
initSnake();
generateFood();

// Start the game loop
gameLoop(); 