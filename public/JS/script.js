//require('dotenv').config()

//info messege
function myFunctionfoot() {
    swal("💻Our Team💻", "We are dedicated to making a safer world. \n ReportIt - an easy reporting system! \n \n Reportit gives you an easy way to report about municipal hazards", "success")
}

//Google map 
var map, infoWindow, pos;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 16
    });
    infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            //reportData.reportLocation.latitude = pos.lat
            document.getElementById("latitude").value = pos.lat;
            document.getElementById("longitude").value = pos.lng;
            infoWindow.setPosition(pos);
            infoWindow.setContent('&nbsp &nbsp &nbsp &nbsp 📍ReportIt Location📍');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

//File upload name fix
$(document).ready(function () {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });
    
});

//Image validation 
$(document).ready(function () {
    $(".custom-file-input").change(function () {
        var fileInput = $(this);
        if (fileInput.length && fileInput[0].files && fileInput[0]
            .files.length) {
            var url = window.URL || window.webkitURL;
            var image = new Image();
            image.onerror = function () {
                swal({
                    title: "Please upload a JPEG or JPG or PNG picture format!",
                    icon: "warning",
                    dangerMode: true,
                })
                document.getElementById("FileL").innerHTML = "Picture of the hazard";
                document.getElementById('File').innerHTML = "";
            }
            image.src = url.createObjectURL(fileInput[0].files[0]);
        } 
    });
});


$(document).ready(function(){
    //Close Toggle form
    $("#buttonC").click(function(){
        //ENV???
        //"http://localhost:3001"
        //"https://report-it.herokuapp.com"
      location.replace("http://localhost:3001")
      });
    //send Toggle form
  });
  

//FAQ Menu
//Accordian Action
var action = 'click';
var speed = "500";
//Document.Ready
$(document).ready(function () {
    //Question handler
    $('li.q').on(action, function () {
        //gets next element
        //opens .a of selected question
        $(this).next().slideToggle(speed)
            //selects all other answers and slides up any open answer
            .siblings('li.a').slideUp();
        //Grab img from clicked question
        var img = $(this).children('img');
        //Remove Rotate class from all images except the active
        $('img').not(img).removeClass('rotate');
        //toggle rotate class
        img.toggleClass('rotate');
    }); //End on click
}); //End Ready

