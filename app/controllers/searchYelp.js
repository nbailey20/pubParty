'use strict';

$(document).ready(function () {
   $("#go").on("click", function (event) {
      var city = $("#input").val();
      var url = "//pubparty-bartowski20.c9users.io/search";
      var term = "pubs";
      if ($(".special").prop("checked")) {
          var category = $("#choice").html().toLowerCase();
          if (category === "gluten-free") {
              category = "gluten_free";
          }
          if (category === "indian") {
              category = "indpak";
          }
          $.ajax({
              type: "POST",
              url: url,
              data: {city: city, term: term, category: category},
              success: successHandler,
              error: errorHandler
          });
      }
      else {
        $.ajax({
          type: "POST",
          url: url,
          data: {city: city, term: term},
          success: successHandler,
          error: errorHandler
        });  
      }
   });
   
   $(".special").on("click", function () {
      if ($(".special").prop("checked")) {
          var searchbox = "<p class='special-text'>Choose additional terms in the box below (ie Gluten-Free, Italian, etc):</p><div class='dropdown'>";
          searchbox += "<button class='special-button btn btn-default dropdown-toggle' id='choice' data-toggle='dropdown'>Choose an option...";
          searchbox += "<span class='caret'></span></button><ul id='choices' class='dropdown-menu special-options'>";
          searchbox += "<li id='option1'>African</li><li id='option2'>Argentine</li>";
          searchbox += "<li id='option3'>Australian</li><li id='option4'>BBQ</li>";
          searchbox += "<li id='option5'>Brazilian</li><li id='option6'>Buffets</li>";
          searchbox += "<li id='option7'>Burgers</li><li id='option8'>Cafes</li>";
          searchbox += "<li id='option9'>Cajun</li><li id='option10'>Chinese</li>";
          searchbox += "<li id='option11'>Delis</li><li id='option12'>French</li>";
          searchbox += "<li id='option13'>German</li><li id='option14'>Gluten-Free</li>";
          searchbox += "<li id='option15'>Greek</li><li id='option16'>Indian</li>";
          searchbox += "<li id='option17'>Italian</li><li id='option18'>Japanese</li>";
          searchbox += "<li id='option19'>Korean</li><li id='option20'>Mexican</li>";
          searchbox += "<li id='option21'>Pizza</li><li id='option22'>Portuguese</li>";
          searchbox += "<li id='option23'>Sushi</li><li id='option24'>Thai</li>";
          searchbox += "<li id='option25'>Vegan</li><li id='option26'>Vegetarian</li></ul></div>";
          $(".special-options").html(searchbox);
      }
      else {
          $(".special-options").html("");
      }
   });
   
    $(".special-options").on("click", function (event) {
       var id = event.target.id;
       var chosen = $("#"+id).html();
       $("#choice").html(chosen);
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
    if (data.body.total === 0) {
        $("#pub-data").html("<p class='nopub'>No pubs were found matching your search terms...</p>");
    }
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
                        var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                        text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>0 GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                        html[dt.ind-1] = text;
                    }
                    else {
                        var numgoing = dt.docs[0].numgoing;
                        var text = "<div id='option" + dt.ind + "' class='pub-element'><a href='" + item.url + "'><p id='name" + dt.ind + "' class='pub-name'>" + item.name + "</p></a><img class='pub-image' src='" + item.image +"'</img>";
                        text += "<button class='btn btn-default going-button' id='going" + dt.ind + "' value='" + item.id + "'>" + numgoing + " GOING</button><p class='pub-text'>" + item.text + "</p></div>";
                        html[dt.ind-1] = text;
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

