const gameBoard = document.getElementById('gameBoard');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const levelDisplay = document.getElementById('levelDisplay');
const gameMessage = document.getElementById('gameMessage');

// Игровые переменные
let width = parseInt(widthInput.value);
let height = parseInt(heightInput.value);
let level = 1;
let wallsCount = 1;
let playerPos = { x: 0, y: 0 };
let finishPos = { x: width - 1, y: height - 1 };
let walls = [];
let gameActive = false;

// Инициализация игры
function initGame() {
     width = parseInt(widthInput.value);
     height = parseInt(heightInput.value);
     level = 1;
     wallsCount = 1;
     playerPos = { x: 0, y: 0 };
     finishPos = { x: width - 1, y: height - 1 };
     walls = [];
     gameActive = false;
     levelDisplay.textContent = level;
     gameMessage.textContent = '';
     generateBoard();
}

// Генерация игрового поля
function generateBoard() {
     gameBoard.innerHTML = '';
     gameBoard.style.gridTemplateColumns = `repeat(${width}, 40px)`;
     gameBoard.style.gridTemplateRows = `repeat(${height}, 40px)`;

     // Создаем пустое поле
     for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
               const cell = document.createElement('div');
               cell.classList.add('cell');
               cell.dataset.x = x;
               cell.dataset.y = y;
               gameBoard.appendChild(cell);
          }
     }

     // Устанавливаем игрока и финиш
     updateCell(playerPos, '😊');
     updateCell(finishPos, '🏁');
}

// Обновление клетки
function updateCell(pos, content) {
     const cell = document.querySelector(`.cell[data-x="${pos.x}"][data-y="${pos.y}"]`);
     if (cell) {
          cell.textContent = content;
     }
}

// Генерация стен
function generateWalls() {
     walls = [];
     for (let i = 0; i < wallsCount; i++) {
          let wallPos;
          do {
               wallPos = {
                    x: Math.floor(Math.random() * width),
                    y: Math.floor(Math.random() * height),
               };
          } while (
               (wallPos.x === playerPos.x && wallPos.y === playerPos.y) ||
               (wallPos.x === finishPos.x && wallPos.y === finishPos.y) ||
               walls.some(wall => wall.x === wallPos.x && wall.y === wallPos.y)
          );
          walls.push(wallPos);
          const cell = document.querySelector(`.cell[data-x="${wallPos.x}"][data-y="${wallPos.y}"]`);
          cell.classList.add('wall');
     }
}

// Проверка столкновения со стеной
function checkCollision(pos) {
    return walls.some(wall => wall.x === pos.x && wall.y === pos.y);
}

// Проверка выхода за пределы поля
function checkOutOfBounds(pos) {
    return pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height;
}

// Проверка достижения финиша
function checkWin(pos) {
    return pos.x === finishPos.x && pos.y === finishPos.y;
}

// Обработка движения
document.addEventListener('keydown', (event) => {
     if (!gameActive) return;

     let newPos = { ...playerPos };

     switch (event.key) {
          case 'ArrowUp':
               newPos.y--;
               break;
          case 'ArrowDown':
               newPos.y++;
               break;
          case 'ArrowLeft':
               newPos.x--;
               break;
          case 'ArrowRight':
               newPos.x++;
               break;
          default:
               return;
     }

     // Проверка выхода за пределы
     if (checkOutOfBounds(newPos)) {
          gameMessage.textContent = 'Game Over: Out of bounds!';
          gameActive = false;
          return;
     }

     // Проверка столкновения со стеной
     if (checkCollision(newPos)) {
          gameMessage.textContent = 'Game Over: Hit a wall!';
          gameActive = false;
          return;
     }

     // Проверка достижения финиша
     if (checkWin(newPos)) {
          level++;
          wallsCount++;
          levelDisplay.textContent = level;
          gameMessage.textContent = `Level ${level - 1} Complete! Starting Level ${level}...`;
          playerPos = { x: 0, y: 0 };
          finishPos = { x: width - 1, y: height - 1 };
          generateBoard();
          generateWalls();
          return;
     }

     // Обновляем позицию игрока
     updateCell(playerPos, '');
     playerPos = newPos;
     updateCell(playerPos, '😊');
});

// Обработчики кнопок
startButton.addEventListener('click', () => {
    initGame();
    generateWalls();
    gameActive = true;
    gameMessage.textContent = 'Use arrow keys to move!';
});

restartButton.addEventListener('click', () => {
    initGame();
    generateWalls();
    gameActive = true;
    gameMessage.textContent = 'Use arrow keys to move!';
});

// Инициализация при загрузке
initGame();