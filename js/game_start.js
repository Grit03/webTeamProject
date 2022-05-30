$(document).ready(function () {
  function gameStartInitializer() {
    if ($("#sound_on").is(":checked")) {
      if (getCheckedInputValue("background_sound")) {
        bgm.src = getCheckedInputValue("background_sound");
      } else {
        bgm.src = "./sounds/background_music1.mp3";
      }
    }
    background.src = getCheckedInputValue("thema");
    $(".profile__image").attr("src", getCheckedInputValue("character"));
    $("#game_start").addClass("hide");
    $(".game").removeClass("hide");
  }
  $("#level1").click(function () {
    gameStartInitializer();
    monsterInitializer(monster);
    introBgm.pause();
    introBgm.currentTime = 0;
    if (!tempBgm.paused) {
      bgm.currentTime = tempBgm.currentTime;
      tempBgm.currentTime = 0;
      tempBgm.pause();
    }
    bgm.play();
    draw();
  });

  $("#level2").click(function () {
    level = 2;
    gameStartInitializer();
    monsterInitializer(monster);
    paddleWidth = 120;
    attack_damage = 55;
    brickSpeed = 400;
    introBgm.pause();
    introBgm.currentTime = 0;
    document.querySelector(".profile__level").innerHTML = "level " + level;
    if (!tempBgm.paused) {
      bgm.currentTime = tempBgm.currentTime;
      tempBgm.currentTime = 0;
      tempBgm.pause();
    }
    bgm.play();
    draw();
  });

  $("#level3").click(function () {
    level = 3;
    gameStartInitializer();
    monsterInitializer(monster);
    paddleWidth = 80;
    attack_damage = 40;
    brickSpeed = 200;
    introBgm.pause();
    introBgm.currentTime = 0;
    document.querySelector(".profile__level").innerHTML = "level " + level;
    if (!tempBgm.paused) {
      bgm.currentTime = tempBgm.currentTime;
      tempBgm.currentTime = 0;
      tempBgm.pause();
    }
    bgm.play();
    draw();
  });
});

// 체크된 라디오 input의 value 가져오기
function getCheckedInputValue(nameAttrVal) {
  var selector = "input[name=" + nameAttrVal + "]";
  var str;
  $(selector).each(function (index, item) {
    if ($(item).is(":checked")) {
      str = $(item).val();
      character = $(item).attr("id");
      ballImg.src = 'img/balls/' + character + '_weapon.png';
    }
  });
  return str;
}
