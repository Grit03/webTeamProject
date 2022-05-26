$(document).ready(function () {
  $("#soundoff_btn").click(function () {
    $("#background_audio").attr("muted", "muted");
  });
  $("#soundon_btn").click(function () {
    $("#background_audio").removeAttr("muted");
  });
});
