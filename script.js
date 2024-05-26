const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let animationFrameId;
let obstacles = [];
let isGameOver = false;
let obstacleInterval;
let mouseX = 0;
let mouseY = 0;
let obstacleSpeed = 2;

class Obstacle {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = 'Img/zombie.gif';
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
        this.draw();
    }
}

function generateObstacle() {
    const x = Math.random() * (canvas.width - 50);
    const y = -50;
    const width = 120;
    const height = 120;
    const speed = obstacleSpeed;
    obstacles.push(new Obstacle(x, y, width, height, speed));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        if (mouseX > obstacle.x && mouseX < obstacle.x + obstacle.width &&
            mouseY > obstacle.y && mouseY < obstacle.y + obstacle.height) {
            isGameOver = true;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('highScore', highScore);
            }
            cancelAnimationFrame(animationFrameId);
            clearInterval(obstacleInterval);
            alert('¡Te han comido! Puntuación: ' + score);
            startButton.style.display = 'block'; 
            return;
        }
    }
}

function updateGame() {
    if (isGameOver) return;
    clearCanvas();
    obstacles = obstacles.filter(obstacle => {
        if (obstacle.y < canvas.height) {
            obstacle.update();
            return true;
        } else {
            score++;
            return false;
        }
    });
    checkCollision();
    scoreDisplay.textContent = 'Puntuación: ' + score;
    highScoreDisplay.textContent = 'Puntuación más alta: ' + highScore;
    animationFrameId = requestAnimationFrame(updateGame);
}

function startGame() {
    score = 0;
    obstacles = [];
    isGameOver = false;
    obstacleSpeed = 2;
    clearInterval(obstacleInterval);
    obstacleInterval = setInterval(() => {
        generateObstacle();
        obstacleSpeed += 0.3;
    }, 500); 
    canvas.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updateGame);
}

function onMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    startGame();
});
