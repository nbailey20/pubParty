'use strict';


$(document).ready(function () {
       $.ajax({
           type: "GET",
           url: "/restore",
           success: function (data) {
                if (data.city !== "") {
                   $("#input").val(data.city);
                   if (data.special !== "") {
                       $(".special").click();
                       $("#choice").html(data.special);
                   }
                   $("#go").click();
                }
           }
       });
    
    $("#pub-data").on("click", function (event) {
      var index = event.target.id.substr(5, event.target.id.length);
      if (index[0] !== "n" && index !== "ata" && event.target.id.substr(0, 4) !== "name") {
          var pubTitle = $('#option'+index + " .going-button").val();
          var userID = $("#go").val();
          if (userID === "") {
              
              var restoreCity = $("#input").val();
              var restoreSpecial = "";
              if ($(".special").prop("checked")) {
                  restoreSpecial = $("#choice").html();
              }
              $.ajax({
                  type: "POST",
                  url: "/restore",
                  data: {restoreCity: restoreCity, pubTitle: pubTitle, restoreSpecial: restoreSpecial},
                  success: function (data) {
                      window.location.href = "/auth/twitter";
                  }
              });
          }
          else {
               $.ajax({
                  type: "POST",
                  url: "/going",
                  data: {pubTitle: pubTitle, index: index, userID: userID},
                  success: updateField,
                  error: errGoing
              });
          }
      }
   });
});


function updateField (data) {
    var url = "/update";
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