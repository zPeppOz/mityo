$('document').ready({
    $('#genera').on('click', {
        var data = $('#text').data();
        const url = "/genera_qr" + data;
        
        $.get("/genera_qr/2", function(data){
            var image = new Image();
            image.src = 'data:image/png;base64,' + data;
            $("#qr").append(image);
        });
    })
});