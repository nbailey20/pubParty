'use strict';

$(document).ready(function () {
    $("#pub-data").on("click", function (event) {
      var index = event.target.id.substr(5, event.target.id.length);
      if (index[0] !== "n" && index !== "ata") {
          var pubTitle = $('#option'+index + " .going-button").val();
          var userID = $("#go").val();
          $.ajax({
              type: "POST",
              url: "https://pubparty-bartowski20.c9users.io/going",
              data: {pubTitle: pubTitle, index: index, userID: userID},
              success: updateField,
              error: errGoing
          });
      }
   });
});


function updateField (data) {
    var url = "https://pubparty-bartowski20.c9users.io/update";
    var pubID = data.pub;
    var index = data.index;
    $.ajax({
        type: "POST",
        url: url,
        data: {pubID: pubID},
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