$(document).ready(function(){
  var config = {
    apiKey: "AIzaSyBxvXoiCvyMX2opSgX18sFO6H3iv94P1_A",
    authDomain: "p360m-776f5.firebaseapp.com",
    databaseURL: "https://p360m-776f5.firebaseio.com",
    storageBucket: "p360m-776f5.appspot.com"
  };
  firebase.initializeApp(config);

  firebase.auth().signInAnonymously().catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });

  firebase.auth().onAuthStateChanged(function(user) {
    
    if (user) {
      // User is signed in.

      var storage = firebase.storage();

      for(var i = 0; i < imageCount; i++) {
        var gsThumbRef = storage.refFromURL(images[i].gs_thumb_url);
        var gsFullRef = storage.refFromURL(images[i].gs_full_url);
        const group_name = images[i].group_name;
        const image_name = images[i].image_name;

        gsThumbRef.getDownloadURL().then((url) => {
          url = url.split('&')[0];
          $("#"+group_name+'_'+image_name).attr('src', url);
        });

        gsFullRef.getDownloadURL().then((url) => {
          url = url.split('&')[0];
          $("#"+group_name+'_'+image_name).attr('name', url);
        });
      }
      
    } else {
      console.log("You need to sign in");
      // User is signed out.
      // ...
    }
    // ...
  });

  $("img").click(function(){
    var url = $(this).attr('name');

    var loadingdiv = $(this).parent().find(".loading-cover");
    loadingdiv.show();
    $.post("/download", {
      url: url
    }, function(result) {
      loadingdiv.hide();
      window.open(window.location.origin + "/js/vrview/index-minified.html?image=/tmp/img.png&is_autopan_off=true", '_self');

    });
  });

  $("#vrview-close").click(function(){
    $("#vrview").hide();
  });
});