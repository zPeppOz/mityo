var ordini = [];

$(document).ready(function() {

    $.ajax({
        url: '/monitor_get',
        type: "GET",
        contentType: "application/json",
        success: function(data) {
            ordini = data;
            console.log(ordini);
        }
    })
});