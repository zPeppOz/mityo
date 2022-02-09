var ordini = [];

function display(ordini) {
    ordini = ordini.documents;
    output = "";
    for (var j in ordini) {
        articoli = ordini[j].articoli;
        output += "<div class='col-10'>" + "<div class='card h-auto'>" +
            "<div class='card-header'>" +
            "<div class='row'>" +
            "<div class='col-10'>" + ordini[j]._id + "</div>" +
            "<div class='col-2'>" + ordini[j].n_tavolo + "</div>" +
            "</div>" + "</div>" + "<div class='card-body'>";

        for (var i in articoli) {
            output += "<div class='row'>" +
                "<div class='col-2 text-center font-card-text'>" + articoli[i].count + "</div>" +
                "<div class='col-10 text-left px-4 font-card-text'>" + articoli[i].name + "</div>" +
                "</div>"
        }

        output += "<div class='card-footer pt-1 p-1'>" + "<div class='row'>" +
            "<div class='col-8 text-left'>" + moment(ordini[j].data).calendar() + "</div>" +
            "<div class='col-4'>" + "<button type='button' data-id='"+ ordini[j]._id +"' class='btn btn-success done'>Fatto</button>" + 
            "</div>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>";
    }

    $('#out').html(output);

}

$(document).ready(function() {

    $('#out').html("Nessun Ordine Ricevuto");

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

    

    $('.done').on("click", function() {
        console.log(1);
        var id = $(this).data('id');
        var url = '/monitor_set/' + id;
        $.get(url,
            function (data) {
                console.log(data);
                if(data == 1){
                    location.reload(true);
                }
            }
        );
    });



});