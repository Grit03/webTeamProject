$(document).ready(function () {
  $("#level1").click(function () {
    $("#game_start").addClass("hide");
    $(".game").removeClass("hide");
    draw();
  });

  $("#level1_game_win").click(function () {
    $("#game_start_level1").addClass("hide");
    $(".game").removeClass("hide");
    draw();
  });

  $("#level1_game_lose").click(function () {
    $("#game_start_level1").addClass("hide");
    $(".game").removeClass("hide");
    draw();
  });
});
