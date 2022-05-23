// onload
window.onload = function () {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  x = canvas.width / 2;
  y = canvas.height - 30;
  paddleX = (canvas.width - paddleWidth) / 2;
  brickOffsetLeft = (canvas.width - brickWidth * 7) / 2;
  // 몬스터 생명 게이지 객체
  monsterLifeGageBar = {
    width: 420,
    height: 30,
    x: (canvas.width - 420) / 2,
    y: 150,
    barBottomY: 180,
  };
  ctx.drawImage(background, 0, 0);
  monsterObj = new monster("img/boss1.gif");

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
var monsterObj;

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
background.src = "./img/background1.png";

// 이미지 객체 생성 함수
function imageObj(src) {
  this.x = 0;
  this.y = 0;
  this.img = new Image();
  this.img.src = src;
}

// 벽돌 객체 생성 함수
function brick(statusValue) {
  this.x = 0;
  this.y = 0;
  this.status = statusValue;
  this.item = new imageObj("./img/exp.gif");
  this.itemShow = function () {
    ctx.drawImage(this.item.img, this.item.x, this.item.y, 30, 30);
  };
  this.itemFall = function () {
    if (this.item.y < canvas.height - paddleHeight) {
      this.itemShow();
      this.item.y += 3;
    } else {
      if (this.item.x >= paddleX && this.item.x <= paddleX + paddleWidth - 30) {
        lives++;
      }
      this.item.y = 0;
    }
  };
}

// 몬스터 생성 객체 함수
function monster(src) {
  this.monsterImage = new imageObj(src);
  this.monsterImage.x = (canvas.width - this.monsterImage.img.width) / 2;
  this.monsterImage.y = 150 - this.monsterImage.img.height;
  this.draw = function () {
    console.log(this.monsterImage.img.width);
    ctx.drawImage(
      this.monsterImage.img,
      this.monsterImage.x,
      this.monsterImage.y
    );
  };
}

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    if (randomIndexArray.indexOf(r) > 0) {
      bricks[c][r] = new brick(1);
    } else {
      bricks[c][r] = new brick(0);
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
    relativeX >= paddleWidth / 2 &&
    relativeX <= canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// 충돌 감지
function collisionDetection() {
  if (y <= monsterLifeGageBar.barBottomY + ballRadius) {
    dy = -dy;
    var bricksStartLocation = (canvas.width - brickWidth * 7) / 2;
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
          //위나 아래서 올때
          dy = -dy;
          b.status = 0;
          score++;

          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;

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
          dx = -dx;
          b.status = 0;
          score++;
          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;
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
      bricks[brickColumnCount][r] = new brick(1);
    } else {
      bricks[brickColumnCount][r] = new brick(0);
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
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();

  collisionDetection();

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
      let collidePoint = x - (paddleX + paddleWidth / 2);
      collidePoint = collidePoint / (paddleWidth / 2);
      let angle = collidePoint * (Math.PI / 3);
      dx = speed * Math.sin(angle);
      dy = speed * Math.cos(angle) * -1;
    } else {
      lives--;
      if (!lives) {
        drawGameOver();
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
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
