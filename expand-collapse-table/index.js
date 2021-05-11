$(document).ready(function () {
  $(".level-01").click(function () {
    if ($(".level-02").css("visibility") == "collapse") {
      $(".level-02").css({ visibility: "visible" });
      $(".expand-01").text("-");
    } else {
      $(".level-02").css({ visibility: "collapse" });
      $(".expand-01").text("+");
    }
  });

  $(".level-02").click(function () {
    if ($(".level-03").css("visibility") == "collapse") {
      $(".level-03").css({ visibility: "visible" });
      $(".expand-02").text("-");
    } else {
      $(".level-03").css({ visibility: "collapse" });
      $(".expand-02").text("+");
    }
  });
});
