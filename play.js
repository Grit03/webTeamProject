// onload
window.onload = function () {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  x = canvas.width * 0.5;
  y = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) * 0.5;
  brickOffsetLeft = (canvas.width - brickWidth * 7) * 0.5;
  // 몬스터 생명 게이지 객체
  monsterLifeGageBar = {
    width: 420,
    height: 30,
    x: (canvas.width - 420) * 0.5,
    y: 150,
    barBottomY: 180,
  };
  ctx.drawImage(background, 0, 0);
  monster = new Monster("img/monsters/boss1.gif");
  monster.monsterImage.addEventListener("load", function () {
    monster.x = (canvas.width - monster.monsterImage.width) * 0.5;
    monster.y = 150 - monster.monsterImage.height;
  });

  // 키보드 입력 처리
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
};

// 전역변수
var canvas;
var ctx;
var ballRadius = 10;
var x;
var y;
var dx = 3;
var dy = -3;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX;
var rightPressed = false;
var leftPressed = false;
var timeId;
var speed = 3 * Math.sqrt(2);
var monster;

// 벽돌 관련 전역 함수
var brickRowCount = 7;
var brickColumnCount = 1;
var brickWidth = 50;
var brickHeight = 50;
var brickOffsetTop = 180;
var brickOffsetLeft;
var score = 0;
var lives = 5;
var randomIndexArray = random();
var max = 0;

// 몬스터 생명 게이지 객체
var monsterLifeGageBar;

// 배경
var background = new Image();
background.src = "img/backgrounds/background1.png";

// 효과
var effects = [];

// 이미지 클래스
class Item {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.img = new Image();
    this.img.src = src;
  }
}

// 몬스터 클래스
class Monster {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.monsterImage = new Image();
    this.monsterImage.src = src;
  }
  draw() {
    ctx.drawImage(this.monsterImage, this.x, this.y);
  }
}

// 벽돌 클래스
class Brick {
  constructor(statusValue) {
    this.x = 0;
    this.y = 0;
    this.status = statusValue;
    this.item = new Item("./img/items/exp.gif");
  }
  itemShow() {
    ctx.drawImage(this.item.img, this.item.x, this.item.y, 30, 30);
  }
  itemFall() {
    if (this.item.y < canvas.height - paddleHeight) {
      this.itemShow();
      this.item.y += 3;
    } else {
      if (this.item.x >= paddleX && this.item.x <= paddleX + paddleWidth - 30) {
        lives++;
      }
      this.item.y = 0;
    }
  }
}

class Effect {
  constructor(src) {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = src;
    this.spriteWidth = 96;
    this.spriteHeight = 96;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.frame = 0;
    this.timer = 0;
  }
  update() {
    this.timer++;
    if (this.timer % 3 == 0) {
      this.frame++;
    }
  }
  draw() {
    console.log(this.x, this.y);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    if (randomIndexArray.indexOf(r) > 0) {
      bricks[c][r] = new Brick(1);
    } else {
      bricks[c][r] = new Brick(0);
    }
  }
}

// n개의 랜덤 인덱스 생성하는 함수
function random() {
  var randomIndexArray = [];
  var randomCount = Math.floor(Math.random() * (brickRowCount - 3) + 2);
  for (var i = 0; i < randomCount; i++) {
    var randomNum = Math.floor(Math.random() * (brickRowCount + 1));
    if (randomIndexArray.indexOf(randomNum) === -1) {
      randomIndexArray.push(randomNum);
    } else {
      i--;
    }
  }
  return randomIndexArray;
}

// 키보드
function keyDownHandler(e) {
  if (e.code == "ArrowRight") {
    rightPressed = true;
  } else if (e.code == "ArrowLeft") {
    leftPressed = true;
  }
}
function keyUpHandler(e) {
  if (e.code == "ArrowRight") {
    rightPressed = false;
  } else if (e.code == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  var gap = document.getElementById("gameView");
  var relativeX = e.clientX - gap.offsetLeft;
  if (
    relativeX >= paddleWidth * 0.5 &&
    relativeX <= canvas.width - paddleWidth * 0.5
  ) {
    paddleX = relativeX - paddleWidth * 0.5;
  }
}

// 충돌 감지
function collisionDetection() {
  if (y <= monsterLifeGageBar.barBottomY + ballRadius) {
    dy = -dy;
    var bricksStartLocation = (canvas.width - brickWidth * 7) * 0.5;
    // 벽돌 범위 내의 x 좌표를 가지는 바를 맞추면 몬스터 게이지 감소
    if (x >= bricksStartLocation && x <= bricksStartLocation + brickWidth * 7) {
    }
    monsterLifeGageBar.width = monsterLifeGageBar.width - 70;
    if (monsterLifeGageBar.width == 0) {
      // 몬스터 죽음.
      // 다음 스테이지로
      monsterLifeGageBar.width = 420;
    }
  }

  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        // 몬스터 생명 게이지 바에 맞을 때
        if (
          x >= b.x - ballRadius &&
          x <= b.x + brickWidth + ballRadius &&
          ((y >= b.y - ballRadius && y <= b.y) ||
            (y >= b.y + brickHeight && y < b.y + brickHeight + ballRadius)) &&
          //양 끝쪽인 경우 dy만 바꿔주고 return-->그렇지 않으면 dx도 바뀌어서 이상해짐
          !(
            b.x - x > Math.abs(y - b.y) ||
            x - (b.x + brickWidth) > Math.abs(y - b.y)
          )
        ) {
          console.log("부딛힌 벽돌 좌표: " + b.x + b.y);
          //위나 아래서 올때
          dy = -dy;
          b.status = 0;
          score++;

          // 아이템 위치 설정
          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;

          // 벽돌 깨짐 효과
          var brickOutEffect = new Effect("img/effects/IceShatter_96x96.png");
          brickOutEffect.x = b.x - (brickOutEffect.width - brickWidth) / 2;
          brickOutEffect.y = b.y - (brickOutEffect.height - brickHeight) / 2;
          effects.push(brickOutEffect);

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }

          return;
        }

        //오른쪽이나 왼쪽에서 올때
        if (
          y >= b.y - ballRadius &&
          y <= b.y + brickHeight + ballRadius &&
          ((x >= b.x - ballRadius && x <= b.x) ||
            (x >= b.x + brickWidth && x <= b.x + brickWidth + ballRadius))
        ) {
          console.log("부딛힌 벽돌 좌표: " + b.x + b.y);
          dx = -dx;
          b.status = 0;
          score++;

          // 아이템 위치 설정
          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;

          // 벽돌 깨짐 효과
          var brickOutEffect = new Effect("img/effects/IceShatter_96x96.png");
          brickOutEffect.x = b.x - (brickOutEffect.width - brickWidth) / 2;
          brickOutEffect.y = b.y - (brickOutEffect.height - brickHeight) / 2;
          effects.push(brickOutEffect);

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

//공 그리기
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 공 받침 판 그리기
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// 벽돌 그리기
function drawBricks() {
  if (timeId % 1200 === 0) {
    setBrickColumnCount();
  }
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = r * brickWidth + brickOffsetLeft;
        var brickY = (brickColumnCount - 1 - c) * brickHeight + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.strokeStyle = "black";
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
      } else {
        if (bricks[c][r].item.y != 0) {
          bricks[c][r].itemFall();
        }
      }
    }
  }
}

function setBrickColumnCount() {
  randomIndexArray = random();

  bricks[brickColumnCount] = [];
  for (var r = 0; r < brickRowCount; r++) {
    if (randomIndexArray.indexOf(r) > 0) {
      bricks[brickColumnCount][r] = new Brick(1);
    } else {
      bricks[brickColumnCount][r] = new Brick(0);
    }
  }
  brickColumnCount++;
}

// 몬스터 게이지? 그리기
function drawMonsterLifeGage() {
  ctx.beginPath();
  ctx.rect(
    monsterLifeGageBar.x,
    monsterLifeGageBar.y,
    monsterLifeGageBar.width,
    monsterLifeGageBar.height
  );
  ctx.fillStyle = "#DC1C13";
  ctx.fill();
  ctx.closePath();
}

function drawEffects() {
  for (var i = 0; i < effects.length; i++) {
    effects[i].update();
    effects[i].draw();
    if (effects[i].frame > 49) {
      effects.splice(i, 1);
      i--;
    }
  }
}

// 점수 표시
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Score: " + score, 8, 20);
}

// 목숨 표시
function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawGameOver() {
  var gameOverText = document.querySelector(".gameOver");
  gameOverText.classList.add("show");
}
// 캔버스에 전체 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);

  drawMonsterLifeGage();
  monster.draw();
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();
  drawEffects();

  max = 0;
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        temp = bricks[c][r].y;
        if (temp > max) {
          max = temp;
        }
      }
    }
  }

  // 벽돌이 바닥에 닿으면 게임오버
  if (max >= 690) {
    drawGameOver();
    return;
  }

  //화면에 부딪히면 방향 변경
  if (x >= canvas.width - ballRadius || x <= ballRadius) {
    dx = -dx;
  }
  if (y <= ballRadius) {
    dy = -dy;
  } else if (y >= canvas.height - ballRadius) {
    //정진우 수정-speed 변수 선언도 위에 있음
    if (x > paddleX && x < paddleX + paddleWidth) {
      let collidePoint = x - (paddleX + paddleWidth * 0.5);
      collidePoint = collidePoint / (paddleWidth * 0.5);
      let angle = collidePoint * (Math.PI / 3);
      dx = speed * Math.sin(angle);
      dy = speed * Math.cos(angle) * -1;
    } else {
      lives--;
      if (!lives) {
        drawGameOver();
        return;
      } else {
        x = canvas.width * 0.5;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) * 0.5;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;

  timeId = requestAnimationFrame(draw);
}
