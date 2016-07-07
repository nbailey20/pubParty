'use strict';

$(document).ready(function () {
    $("#pub-data").on("click", function (event) {
      var index = event.target.id.substr(5, event.target.id.length);
      var identifier = $('#option'+index + " .going-button").val();
      $.ajax({
          type: "POST",
          url: "https://pubparty-bartowski20.c9users.io/going",
          data: {id: identifier, index: index},
          success: updateField,
          error: errGoing
      });
   });
});


function updateField (data) {
    var url = "https://pubparty-bartowski20.c9users.io/update";
    var id = data.pub;
    var index = data.index;
    $.ajax({
        type: "POST",
        url: url,
        data: {id: id},
        error: errPulling,
        success: function (dt) {
            var numgoing = dt[0].numgoing;
            $("#going" + index).html(numgoing + " GOING");
        }
    });
}

function errGoing (err) {
    alert("error saving RSVP");
}

function errPulling (data) {
    alert("error retrieving data");
}