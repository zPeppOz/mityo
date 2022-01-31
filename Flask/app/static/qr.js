$('document').ready({
    $('#genera').on('click', {
        var data = $('#text').data();
        $.get("/genera_qr", data,
            function (data, status) {
                
            },
            "dataType"
        );

    })
});