// onload
window.onload = function () {
  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  gameView = document.querySelector(".game");
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
  monster = new Monster("./img/monsters/boss1.gif");
  monster.monsterImage.addEventListener("load", function () {
    monster.x = (canvas.width - monster.monsterImage.width) * 0.5;
    monster.y = 150 - monster.monsterImage.height;
  });

  // 키보드 입력 처리
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  brickInitialize();
};
// 전역변수
var canvas;
var gameView;
var ctx;
var ballRadius;
var x;
var y;
var dx = 5;
var dy = -5;
var paddleHeight = 10;
var paddleWidth = 160;
var paddleX;
var rightPressed = false;
var leftPressed = false;
var timeId;
var speed = 3 * Math.sqrt(2);
var paddleAccel = 3;
var AccelPlus = 0.4;
var maxAccel = 18;
var paddleAccelSlide = 0;
var monster;
var level = 1;
var item_src = [
  "./img/items/exp.gif",
  "./img/items/item_red.png",
  "./img/items/item_blue.png",
  "./img/items/item_white.png",
];
var attack_damage = 70;

// 벽돌 & 공 관련 전역 함수
var bricks;
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
var brickSpeed = 600;
var brickSpeedIter = 0;
var ballIter = 0;

// 몬스터 생명 게이지 객체
var monsterLifeGageBar;

// 배경
var background = new Image();
background.src = "./img/backgrounds/background1.png";
var bgmLocation;
var bgm = new Audio();

// 효과
var effects = [];

// Sound Effect
var ballImpact = new Audio();
ballImpact.src = "./sounds/ballImpact.mp3";

// 레벨 관련 변수
var levelClear = false;

// 이미지 클래스
class Item {
  constructor() {
    var randomPosition = Math.floor(Math.random() * 10) + 1;
    this.x = 0;
    this.y = 0;
    this.img = new Image();

    if (randomPosition >= 1 && randomPosition <= 7) {
      // coin 이미지
      this.img.src = item_src[0];
      this.itemIndex = 0;
    } else if (randomPosition == 8) {
      this.img.src = item_src[1];
      this.itemIndex = 1;
    } else if (randomPosition == 9) {
      this.img.src = item_src[2];
      this.itemIndex = 2;
    } else if (randomPosition == 10) {
      this.img.src = item_src[3];
      this.itemIndex = 3;
    }
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
    this.brickImage = new Image();
    this.brickImage.src =
      "./img/bricks/" + "brick" + (Math.floor(Math.random() * 4) + 1) + ".png";
    this.item = new Item();
  }
  itemShow() {
    ctx.drawImage(this.item.img, this.item.x, this.item.y, 30, 30);
  }
  itemFall() {
    this.itemShow();
    this.item.y += 2;
    if (
      this.item.y >= canvas.height - paddleHeight - 30 &&
      this.item.y <= canvas.height - 30 &&
      this.item.x >= paddleX &&
      this.item.x <= paddleX + paddleWidth - 30
    ) {
      //포션 먹었을 때 기능
      switch (this.item.itemIndex) {
        case 0:
          break;
        case 1:
          if (lives < 5) {
            lives++;
          }
          break;
        case 2:
          ballIter = 2;
          ballRadius = 20;
          break;
        case 3:
          brickSpeedIter = 2;
          brickSpeed = 900;
          break;
      }
      this.item.y = 0;
    }
  }
}

//공으로 벽돌 맞추었을 때의 이펙트
class Effect {
  constructor(imgSrc) {
    this.x = 0;
    this.y = 0;
    this.image = new Image();
    this.image.src = imgSrc;
    this.spriteWidth = 96;
    this.spriteHeight = 96;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.frame = 0;
    this.timer = 0;
    this.sound = new Audio();
    this.sound.src = "";
  }
  update() {
    this.timer++;
    if (this.timer % 3 == 0) {
      this.frame++;
    }
  }
  draw() {
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

function brickInitialize() {
  brickColumnCount = 1;
  ballRadius = 10;
  brickSpeed = 600;
  ballIter = 0;
  brickSpeedIter = 0;
  effects = [];
  bricks = [];
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
  var gap = document.querySelector(".game");
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
    monsterLifeGageBar.width = monsterLifeGageBar.width - attack_damage;
    if (monsterLifeGageBar.width <= 0) {
      // 몬스터 죽음.
      // 다음 스테이지로
      if (level != 3) {
        document.getElementById("nextGamePage").classList.remove("hide");
        levelUp();
        monsterLifeGageBar.width = 420;
        endLevel();
        return;
      }
      if (level == 3) {
        levelUp();
        endLevel();
        return;
      }
    }
  }

  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        // 박스에 맞을 때
        if (
          x > b.x - ballRadius &&
          x < b.x + brickWidth + ballRadius &&
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

          //아이템 위치 설정
          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;

          // 벽돌 깨짐 효과
          var brickOutEffect = new Effect("./img/effects/IceShatter_96x96.png");
          brickOutEffect.x = b.x - (brickOutEffect.width - brickWidth) / 2;
          brickOutEffect.y = b.y - (brickOutEffect.height - brickHeight) / 2;
          effects.push(brickOutEffect);
          ballImpact.play();

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

          // 아이템 위치 설정
          b.item.x = b.x + brickWidth * 0.25;
          b.item.y = b.y + brickHeight;

          // 벽돌 깨짐 효과
          var brickOutEffect = new Effect("./img/effects/IceShatter_96x96.png");
          brickOutEffect.x = b.x - (brickOutEffect.width - brickWidth) / 2;
          brickOutEffect.y = b.y - (brickOutEffect.height - brickHeight) / 2;
          effects.push(brickOutEffect);
          ballImpact.play();
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
  if (timeId % brickSpeed === 0) {
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
        ctx.drawImage(
          bricks[c][r].brickImage,
          bricks[c][r].x,
          bricks[c][r].y,
          50,
          50
        );
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

// 몬스터 게이지 그리기
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

//이펙트 그리기
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

//다음 스테이지 버튼
function nextLevelBtnListener() {
  document.getElementById("nextGamePage").classList.add("hide");
  lives = 6; // 오류 있음
  levelClear = false;
  x = canvas.width * 0.5;
  y = canvas.height - 30;
  // monsterHealthBar.classList.remove("hide");
  draw();
  return;
}

// 점수 표시
// function drawScore() {
//   ctx.font = "16px Arial";
//   ctx.fillStyle = "#0095DD";
//   ctx.fillText("Score: " + score, 8, 20);
// }

// 목숨 하트로 표시
function drawLives() {
  var livesbar = document.getElementById("livesBar");
  livesbar.innerHTML = "";
  for (var i = 0; i < lives && i < 5; i++) {
    var img = document.createElement("img");
    img.src = "./img/lives/lives.png";
    img.style.width = "40px";
    img.style.left = i * 20 + "px";
    livesbar.appendChild(img);
  }
}

//게임 오버 화면 그리기
function drawGameOver() {
  var gameOver = document.getElementById("game_lose");
  gameView.classList.add("hide");
  gameOver.classList.remove("hide");
}

//메뉴로 돌아가기 버튼
function menuBtnListener() {
  // document.snowfall("clear"); // game_winlose.js 참고
  document.location.reload();
  return;
}

//재시작 버튼
function restartBtnListener() {
  brickInitialize();
  restart();
}

//실패한 스테이지에서 재시작
function restart() {
  var gameOver = document.getElementById("game_lose");
  gameOver.classList.add("hide");
  gameView.classList.remove("hide");
  lives = 6;
  levelClear = false;
  x = canvas.width * 0.5;
  y = canvas.height - 30;
  monsterLifeGageBar.width = 420;
  draw();
}

//해당 게임 끝내기
function endLevel() {
  return (levelClear = true);
}

//스테이지 레벨 업
function levelUp() {
  if (level == 1) {
    level = 2;
    paddleWidth = 120;
    attack_damage = 55;
    brickSpeed = 400;
    brickInitialize();
    return;
  } else if (level == 2) {
    level = 3;
    paddleWidth = 80;
    attack_damage = 40;
    brickSpeed = 200;
    brickInitialize();
    return;
  } else {
    endGamePage();
  }
}

//게임 승리 화면
function endGamePage() {
  gameView.classList.add("hide");
  document.getElementById("game_win").classList.remove("hide");
}

//캔버스에 전체 그리기
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0);

  drawMonsterLifeGage();
  monster.draw();
  drawBricks();
  drawPaddle();
  drawLives();
  collisionDetection();
  drawEffects();

  if (levelClear) {
    return;
  }

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
    document.location.reload();
    return;
  }

  if (paddleX >= 0 && paddleX <= canvas.width - paddleWidth) {
    //버튼 누를 때 패들 가속도 계산
    if (rightPressed) {
      paddleAccel += AccelPlus;
    } else if (leftPressed) {
      paddleAccel -= AccelPlus;
    }

    //버튼 누를 때 패들 움직이기
    paddleX += paddleAccel;

    //슬라이드 할 가속도 저장해두기(방향키 버튼 누르면 초기화됨)
    if (paddleAccel != 0) {
      paddleAccelSlide = paddleAccel;
    }

    //버튼에서 손 때면 패들 움직이기(미끄러지는 효과)
    if (!rightPressed && !leftPressed) {
      if (paddleAccelSlide > AccelPlus) {
        paddleAccelSlide -= AccelPlus;
        paddleX += paddleAccelSlide;
      } else if (paddleAccelSlide < AccelPlus * -1) {
        paddleAccelSlide += AccelPlus;
        paddleX += paddleAccelSlide;
      }
    }
  } //패들이 왼쪽 화면을 넘어가는 경우
  else if (paddleX < 0) {
    paddleX = 0;
    paddleAccel = 0;
    paddleAccelSlide = 0;
  } //패들이 오른쪽 화면을 넘어가는 경우
  else if (paddleX > canvas.width - paddleWidth) {
    paddleX = canvas.width - paddleWidth;
    paddleAccel = 0;
    paddleAccelSlide = 0;
  }

  if (!rightPressed && !leftPressed) {
    paddleAccel = 0;
  }

  //공이 화면에 부딪히면 방향 변경
  if (x >= canvas.width - ballRadius || x <= ballRadius) {
    dx = -dx;
    ballImpact.play();
  }
  if (y <= ballRadius) {
    dy = -dy;
    ballImpact.play();
  } else if (y >= canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      //파란 포션(볼 크기) 지속 시간
      if (ballIter > 0) {
        ballIter--;
      } else {
        ballRadius = 10;
      }
      //흰 포션(벽돌 하강 속도) 지속 시간
      if (brickSpeedIter > 0) {
        brickSpeedIter--;
      } else {
        brickSpeed = 600;
      }

      //패들 정지했을 땐 dx 방향만 바꿔주기
      if (!leftPressed && !rightPressed) {
        dy = -dy;
        ballImpact.play();
      }
      //패들 움직일 때 최대 60도로 튕겨주기
      else {
        let angle = paddleAccel / maxAccel;
        angle = angle * (Math.PI / 3);
        dx = speed * Math.sin(angle);
        dy = speed * Math.cos(angle) * -1;
        ballImpact.play();
      }
    } else {
      lives--;
      if (!lives) {
        drawGameOver();
        return;
      } else {
        x = canvas.width * 0.5;
        y = canvas.height - 30;
        dx = 5;
        dy = -5;
        paddleX = (canvas.width - paddleWidth) * 0.5;
      }
    }
  }

  x += dx;
  y += dy;

  drawBall();
  timeId = requestAnimationFrame(draw);
  console.log(level);
}
