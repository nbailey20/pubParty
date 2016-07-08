'use strict';

$(document).ready(function () {
   $("#go").on("click", function (event) {
      var city = $("#input").val();
      var userID = $("#go").val();
      alert(userID);
      var url = "https://pubparty-bartowski20.c9users.io/search";
      var term = "pub";
      if ($(".special").prop("checked")) {
          term = $(".special-input").val() + " " + term;
      }
      $.ajax({
          type: "POST",
          url: url,
          data: {city: city, term: term},
          success: successHandler,
          error: errorHandler
      });
   });
   
   $(".special").on("click", function () {
      if ($(".special").prop("checked")) {
          var searchbox = "<p class='special-text'>Enter additional terms in the box below (ie Gluten-Free Vegan etc):</p><input type='text' class='special-input form-control'>";
          $(".special-options").html(searchbox);
      }
      else {
          $(".special-options").html("");
      }
   });
   
   
   $("#input").keyup(function (event) {
        if(event.keyCode == 13){
            $("#go").click();
        }
    });
});



function successHandler (data) {
    var html = "";
    var i = 1;
    data.businesses.forEach(function (element) {
        var item = {
            name: element.name,
            image: element.image_url,
            categories: element.categories,
            text: element.snippet_text,
            id: element.id
        };
        $.ajax({
            type: "POST",
            url: "https://pubparty-bartowski20.c9users.io/update",
            data: {id: item.id},
            error: errPulling,
            success: function (dt) {
                if (dt.length == 0) {
                    if ($(".special").prop("checked")) {
                        item.categories.forEach(function (el) {
                            if (el[0] == $(".special-input").val()) {
                                html += "<div id='option" + i + "' class='pub-element'><p class='pub-name'>" + item.name + "</p><img class='pub-image' src='" + item.image +"'</img>";
                                html += "<button class='btn btn-default going-button' id='going" + i + "' value='" + item.id + "'>0 GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                                i++;
                            }
                        });
                    }
                    else {
                        html += "<div id='option" + i + "' class='pub-element'><p class='pub-name'>" + item.name + "</p><img class='pub-image' src='" + item.image +"'</img>";
                        html += "<button class='btn btn-default going-button' id='going" + i + "' value='" + item.id + "'>0 GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                        i++;
                    }
                }
                else {
                    var numgoing = dt[0].numgoing;
                    if ($(".special").prop("checked")) {
                        item.categories.forEach(function (el) {
                            if (el[0] == $(".special-input").val()) {
                                html += "<div id='option" + i + "' class='pub-element'><p class='pub-name'>" + item.name + "</p><img class='pub-image' src='" + item.image +"'</img>";
                                html += "<button class='btn btn-default going-button' id='going" + i + "' value='" + item.id + "'>" + numgoing + " GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                                i++;
                            }
                        });
                    }
                    else {
                        html += "<div id='option" + i + "' class='pub-element'><p class='pub-name'>" + item.name + "</p><img class='pub-image' src='" + item.image +"'</img>";
                        html += "<button class='btn btn-default going-button' id='going" + i + "' value='" + item.id + "'>" + numgoing + " GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                        i++;
                    }
                }
                $("#pub-data").html(html);
            }
        });
    });
}



function errorHandler (err) {
    alert("yelp api error");
}

