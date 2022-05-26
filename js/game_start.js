$(document).ready(function () {
  $("#level1").click(function () {
    $("#game_start").addClass("hide");
    $(".game").removeClass("hide");
    introBgm.pause();
    introBgm.currentTime = 0;
    draw();
  });

  $("#level2").click(function () {
    $("#game_start").addClass("hide");
    $(".game").removeClass("hide");
    level = 2;
    paddleWidth = 120;
    attack_damage = 55;
    brickSpeed = 400;
    introBgm.pause();
    introBgm.currentTime = 0;
    draw();
  });

  $("#level3").click(function () {
    $("#game_start").addClass("hide");
    $(".game").removeClass("hide");
    level = 3;
    paddleWidth = 80;
    attack_damage = 40;
    brickSpeed = 200;
    introBgm.pause();
    introBgm.currentTime = 0;
    draw();
  });
});
