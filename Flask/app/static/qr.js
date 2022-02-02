$(document).ready(function () {
  $(".btn_gen").on("click", function () {
    var data = $("#text").val();
    const url = "/genera_qr/" + data;

    $.get(url, function (data) {
      var image = new Image();
      image.src = "data:image/png;base64," + data;
      $("#qr").html(image);
    });
  });
});
