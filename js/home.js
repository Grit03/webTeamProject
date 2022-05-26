
$(document).ready(function(){

  $("#home_menu1_span").hover(function(){
    $("#home_menu1").css("transform","scale(1.2)");
    $("#home_menu1_span").css("transform","scale(1.2)");
  }, function(){
    $("#home_menu1").css("transform","scale(1.0)");
    $("#home_menu1_span").css("transform","scale(1.0)");
  })
  $("#home_menu2_span").hover(function(){
    $("#home_menu2").css("transform","scale(1.2)");
    $("#home_menu2_span").css("transform","scale(1.2)");
  }, function(){
    $("#home_menu2").css("transform","scale(1.0)");
    $("#home_menu2_span").css("transform","scale(1.0)");
  })
  $("#home_menu3_span").hover(function(){
    $("#home_menu3").css("transform","scale(1.2)");
    $("#home_menu3_span").css("transform","scale(1.2)");
  }, function(){
    $("#home_menu3").css("transform","scale(1.0)");
    $("#home_menu3_span").css("transform","scale(1.0)");
  })

  $("#home_menu1_span").click(function(){
    $("#game_start").removeClass("hide");
    $("#home").addClass("hide")
  })
  $("#home_menu2_span").click(function(){
    $("#explanation").removeClass("hide");
    $("#home").addClass("hide")
  })
  $("#home_menu3_span").click(function(){
    $("#setting").removeClass("hide");
    $("#home").addClass("hide")
  })

  $("#gamestart_home").click(function(){
    $("#home").removeClass("hide");
    $("#game_start").addClass("hide")
  })
  $("#explanation_home").click(function(){
    $("#home").removeClass("hide");
    $("#explanation").addClass("hide")
  })
  $("#setting_home").click(function(){
    $("#home").removeClass("hide");
    $("#setting").addClass("hide")
  })

});