'use strict';

$(document).ready(function () {
    $("#pub-data").on("click", function (event) {
      var id = event.target.id.substr(5, event.target.id.length);
      var identifier = $('#option'+id + " .going-button").val();
      $.ajax({
          type: "POST",
          url: "https://pubparty-bartowski20.c9users.io/going",
          data: {id: identifier},
          success: updateScreen,
          error: errGoing
      });
   });
});


function updateScreen (data) {
    alert("saved vote in mongo");
}

function errGoing (err) {
    alert("error saving RSVP");
}