const game = document.getElementById("game");
const ctx = game.getContext("2d");

let width = game.width;
let height = game.height;

// ширина и высота в ячейках
let blockSize = 10;
let widthBlocks = game.width/blockSize;
let heightBlocks = game.height/blockSize;

// счет
let score = 0;

// рамка 
const drawBorder = function () {
    ctx.fillStyle = "Black";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
   };
   // Счет игры 
  const drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Счет: " + score, blockSize, blockSize);
   }

const gameOver = function () {
    clearInterval(intervalId)
    ctx.font = "60px Arial";
    ctx.fillStyle = "Red"
    ctx.textAlign = "center"
    ctx.textBaseline = "bold"
    ctx.fillText(`GAME OVER`, width/2, height/2)
}

// Рисуем окружность 
var circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
    ctx.fill();
    } else {
    ctx.stroke();
    }
   };


// Конструктор ячейки
const Block = function(col, row) {
    this.col = col;
    this.row = row;
};

// drawBorder();
// drawScore();

// Рисуем квадрат в позиции ячейки
Block.prototype.drawSquare = function(color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

// const sampleBlock = new Block(3, 4);
// sampleBlock.drawSquare("Green");

// Рисуем круг в позиции ячейки
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  }
  

// Проверяем, находится ли эта ячейка в той же позиции, что и ячейка
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
   }

// Задаем конструктор Snake (змейка)
  const Snake = function () {
     this.segments = [
     new Block(7, 5),
     new Block(6, 5),
     new Block(5, 5)
     ];
     this.direction = "right";
    this.nextDirection = "right";
    }

// Рисуем квадратик для каждого сегмента тела змейки
    Snake.prototype.draw = function () {
        for (var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Green");
        }
       };

// Увеличение на 1 сегмент при съедании яблока
Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;
    this.direction = this.nextDirection;
    if (this.direction === "right") {
     newHead = new Block(head.col + 1, head.row);
     } else if (this.direction === "down") {
     newHead = new Block(head.col, head.row + 1);
     } else if (this.direction === "left") {
     newHead = new Block(head.col - 1, head.row);
     } else if (this.direction === "up") {
     newHead = new Block(head.col, head.row - 1);
     }
    if (this.checkCollision(newHead)) {
     gameOver();
     return;
     }
     this.segments.unshift(newHead);
    if (newHead.equal(apple.position)) {
      score++;
      apple.move();
      } else {
      this.segments.pop();
      }
     };


// Проверка столкновений со стеной или телом
Snake.prototype.checkCollision = function (head) {
    let leftCollision = (head.col === 0);
    let topCollision = (head.row === 0);
    let rightCollision = (head.col === widthBlocks - 1);
    let bottomCollision = (head.row === heightBlocks - 1);
    let wallCollision = leftCollision || topCollision || 
      rightCollision || bottomCollision;
     //  Проверка столкновения с собственным телом
     let selfCollision = false;
      
    for (var i = 0; i < this.segments.length; i++) {
      if (head.equal(this.segments[i])) {
    selfCollision = true;
      }
      }
 //      если змейка столкнулась либо со стенкой, либо сама с собой
    return wallCollision || selfCollision;
 };

//  проверяет, недопустимое направление
    Snake.prototype.setDirection = function (newDirection) {
        if (this.direction === "up" && newDirection === "down") {
         return;
         } else if (this.direction === "right" && newDirection === "left") {
         return;
         } else if (this.direction === "down" && newDirection === "up") {
         return;
         } else if (this.direction === "left" && newDirection === "right") {
         return;
         }
        this.nextDirection = newDirection;
        }

        
 // конструктор Apple
const Apple = function () {
    this.position = new Block(10, 10);
  }
  
  // Рисуем яблоко (круг)
  Apple.prototype.draw = function () {
    this.position.drawCircle("Red");
  }
  

//   Перемещаем яблоко
Apple.prototype.move = function () {
    // рандом столбец
    let randomCol = Math.floor(Math.random() * (widthBlocks - 3)) + 1;

       // рандом строка
       let randomRow = Math.floor(Math.random() * (heightBlocks - 3)) + 1;
    this.position = new Block(randomCol, randomRow);
    }

    // / Создаем объект-змейку и объект-яблоко
    let snake = new Snake();
    let apple = new Apple();

    // Запускаем функцию анимации через setInterval
var intervalId = setInterval(function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
   }, 100);


   let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
  };
  
  window.addEventListener("keydown", function (event) {
    var newDirection = directions[event.keyCode];
    if (newDirection !== undefined) {
      snake.setDirection(newDirection);
    }
  });

  document.getElementById('up').addEventListener('click', function() {
    snake.setDirection('up');
});

document.getElementById('right').addEventListener('click', function() {
    snake.setDirection('right');
});

document.getElementById('left').addEventListener('click', function() {
    snake.setDirection('left');
});

document.getElementById('down').addEventListener('click', function() {
    snake.setDirection('down');
});

     
      