$(document).ready(function () {
  var buttons = document.getElementsByClassName("pointerCursor");
  console.log(buttons);
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      clickSound.play();
    });
  }
  $("#home_menu1_span").hover(
    function () {
      $("#home_menu1").css("transform", "scale(1.2)");
      $("#home_menu1_span").css("transform", "scale(1.2)");
    },
    function () {
      $("#home_menu1").css("transform", "scale(1.0)");
      $("#home_menu1_span").css("transform", "scale(1.0)");
    }
  );
  $("#home_menu2_span").hover(
    function () {
      $("#home_menu2").css("transform", "scale(1.2)");
      $("#home_menu2_span").css("transform", "scale(1.2)");
    },
    function () {
      $("#home_menu2").css("transform", "scale(1.0)");
      $("#home_menu2_span").css("transform", "scale(1.0)");
    }
  );
  $("#home_menu3_span").hover(
    function () {
      $("#home_menu3").css("transform", "scale(1.2)");
      $("#home_menu3_span").css("transform", "scale(1.2)");
    },
    function () {
      $("#home_menu3").css("transform", "scale(1.0)");
      $("#home_menu3_span").css("transform", "scale(1.0)");
    }
  );

  $("#home_menu1_span").click(function () {
    introBgm.play();
    $("#game_start").removeClass("hide");
    $("#home").addClass("hide");
  });
  $("#home_menu2_span").click(function () {
    introBgm.play();
    $("#explanation").removeClass("hide");
    $("#home").addClass("hide");
  });
  $("#home_menu3_span").click(function () {
    introBgm.play();
    $("#setting").removeClass("hide");
    $("#home").addClass("hide");
  });

  $("#gamestart_home").click(function () {
    $("#home").removeClass("hide");
    $("#game_start").addClass("hide");
  });
  $("#explanation_home").click(function () {
    $("#home").removeClass("hide");
    $("#explanation").addClass("hide");
  });
  $("#setting_home").click(function () {
    $("#home").removeClass("hide");
    $("#setting").addClass("hide");
  });
});

var clickSound = new Audio();
clickSound.src = "./sounds/clickSound.mp3";

var introBgm = new Audio();
introBgm.autoplay = true;
introBgm.volume = 0.3;
introBgm.loop = true;
introBgm.src = "./sounds/Intro.mp3";
