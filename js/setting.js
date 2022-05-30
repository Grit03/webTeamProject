$(document).ready(function () {
  $("#soundon_btn").click(function () {
    tempBgm.pause();
    tempBgm.currentTime = 0;
    introBgm.play();
  });
  $("#soundoff_btn").click(function () {
    $("input[name=background_sound]").each(function (index, item) {
      $(item).prop("checked", false);
    });
    tempBgm.pause();
    tempBgm.currentTime = 0;
    introBgm.pause();
    introBgm.currentTime = 0;
  });
  $("#backsound1").click(function () {
    introBgm.pause();
    introBgm.currentTime = 0;
    tempBgm.src = $(this).val();
    tempBgm.play();
  });
  $("#backsound2").click(function () {
    introBgm.pause();
    introBgm.currentTime = 0;
    tempBgm.src = $(this).val();
    tempBgm.play();
  });
  $("#backsound3").click(function () {
    introBgm.pause();
    introBgm.currentTime = 0;
    tempBgm.src = $(this).val();
    tempBgm.play();
  });
});
