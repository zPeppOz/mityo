var ordini = [];

function display(ordini) {
    ordini = ordini.documents;
    output = "";
    for (var j in ordini) {
        articoli = ordini[j].articoli;
        output += "<div class='card h-100'>" +
            "<div class='card-header'>" +
            "<div class='row'>" +
            "<div class='col-8'>" + ordini[j]._id + "</div>" +
            "<div class='col-4'>" + ordini[j].n_tavolo + "</div>" +
            "</div>" + "</div>" + "<div class='card-body'>";

        for (var i in articoli) {
            output += "<div class='row'>" +
                "<div class='col-2 text-center font-card-text'>" + articoli[i].count + "</div>" +
                "<div class='col-10 text-left px-4 font-card-text'>" + articoli[i].name + "</div>" +
                "</div>"
        }

        output += "<div class='card-footer'>" + "<div class='row'>" +
            "<div class='col-6 text-left'>" + moment(ordini[j].data).calendar() + "</div>" +
            "<div class='col-6'>Bottone</div>" + "</div>" + "</div>" + "</div>" + "</div>";
    }

    $('#out').html(output);

}

$(document).ready(function() {

    $.ajax({
        url: '/monitor_get',
        type: "GET",
        contentType: "application/json",
        success: function(data) {
            ordini = JSON.parse(data);
            moment.locale('it');
            display(ordini);
        }
    });


});