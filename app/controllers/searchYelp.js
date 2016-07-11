'use strict';

$(document).ready(function () {
   $("#go").on("click", function (event) {
      var city = $("#input").val();
      var url = "//pubparty-bartowski20.c9users.io/search";
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
    
    $(".special-options").keyup(function (event) {
        if(event.keyCode == 13){
            $("#go").click();
        }
    });
});



function successHandler (data) {
    var html = [];
    for (var j = 0; j < data.body.businesses.length; j++) {
        html.push("");
    }
    var index;
    var i = 0;
    html.forEach(function (element) {
       
        var item = {
            name: data.body.businesses[i].name,
            image: data.body.businesses[i].image_url,
            categories: data.body.businesses[i].categories,
            text: data.body.businesses[i].snippet_text,
            url: data.body.businesses[i].mobile_url,
            closed: data.body.businesses[i].is_closed,
            id: data.body.businesses[i].id
        };
        i++;
        
        if (!item.closed) {
            if (item.id == data.pubID) {
                index = i;
            }
            
            $.ajax({
                type: "POST",
                url: "//pubparty-bartowski20.c9users.io/update",
                data: {pubID: item.id, ind: i},
                error: errPulling,
                success: function (dt) {
                     
                    if (dt.docs.length === 0) {
                        if ($(".special").prop("checked")) {
                            item.categories.forEach(function (el) {
                                if (el[0] == $(".special-input").val()) {
                                    var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                                    text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>0 GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                                    html[dt.ind-1] = text;
                                }
                            });
                        }
                        else {
                            var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                            text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>0 GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                            html[dt.ind-1] = text;
                        }
                    }
                    else {
                        var numgoing = dt.docs[0].numgoing;
                        if ($(".special").prop("checked")) {
                            item.categories.forEach(function (el) {
                                if (el[0] == $(".special-input").val()) {
                                    var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                                    text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>" + numgoing + " GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                                    html[dt.ind-1] = text;
                                }
                            });
                        }
                        else {
                            var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                            text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>" + numgoing + " GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                            html[dt.ind-1] = text;
                        }
                    }
                    $("#pub-data").html(html.join(""));
                }
            });
        }
    });
    setTimeout(function () {$("#pub-data").find("#going" + index).click()}, 1500);
     $.ajax({
        type: "POST",
        url: "//pubparty-bartowski20.c9users.io/restore",
        data: {restoreCity: "", pubTitle: "", restoreSpecial: ""}
    });
}



function errorHandler (err) {
    alert("yelp api error");
}

