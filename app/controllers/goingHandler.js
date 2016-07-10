'use strict';


$(document).ready(function () {
    alert(document.referrer);
    alert(window.parent.location);
    if (document.referrer.substr(0, 23) == "https://api.twitter.com" && window.performance.navigation.type === 0) {
       $.ajax({
           type: "GET",
           url: "//pubparty-bartowski20.c9users.io/restore",
           success: function (data) {
               $("#input").val(data.city);
               $("#go").click();
           }
       });
    }
    
    $("#pub-data").on("click", function (event) {
      var index = event.target.id.substr(5, event.target.id.length);
      if (index[0] !== "n" && index !== "ata") {
          var pubTitle = $('#option'+index + " .going-button").val();
          var userID = $("#go").val();
          if (userID === "") {
              
              var restoreCity = $("#input").val();
              $.ajax({
                  type: "POST",
                  url: "//pubparty-bartowski20.c9users.io/restore",
                  data: {restoreCity: restoreCity, pubTitle: pubTitle},
                  success: function (data) {
                      window.location.href = "/auth/twitter";
                  }
              });
          }
          else {
               $.ajax({
                  type: "POST",
                  url: "//pubparty-bartowski20.c9users.io/going",
                  data: {pubTitle: pubTitle, index: index, userID: userID},
                  success: updateField,
                  error: errGoing
              });
          }
      }
   });
});


function updateField (data) {
    var url = "//pubparty-bartowski20.c9users.io/update";
    var pubID = data.pub;
    var index = data.index;
    $.ajax({
        type: "POST",
        url: url,
        data: {pubID: pubID},
        error: errPulling,
        success: function (dt) {
            var numgoing = dt.docs[0].numgoing;
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