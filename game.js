let map;
let numberPhoto;
let marker;
let circle = [];
let line;
let currentScore;
let solutionMarker;
let solutionLocations= ["Braga", "Glasgow", "Kiev", "Marseille", "Nantes", "Riga", "Athenes", "Bratislava", "Cologne", "Cadiz", "Copenhague"];
let solutionData=[[41.5472695,-8.4464406],[55.8551261,-4.519527],[50.400622,29.958427],[43.2799863,5.0935638],[47.2382114,-1.6303742],[56.9705052,23.5686871],[37.990832,23.7033199],[48.1356952,16.9758343],[50.9576191,6.82724],[36.5163813,-6.3174866],[55.6712474,12.5237846]];
let solutionMarkers = [];

function initMap() {
    //Initiation of the map
    numberPhoto = 0;
    currentScore = 0;

    var options = {
        center: {lat: 53.267691, lng: 17.096316},
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        draggable:false,
        disableDoubleClickZoom: true,
        keyboardShortcuts:false
    };
    map = new google.maps.Map(document.getElementById("map"), options);


    //Adding listener
    google.maps.event.addListener(map, 'click', function(event) {
        if(document.getElementById("button").getAttribute("onClick")=="confirmMarker()"){addMarker(event.latLng);}
    });
}

function addMarker(location) {
    //Delete previous marker
    if(marker!=null){ marker.setMap(null); }

    //Add new marker
    marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

function confirmMarker() {
    //Check marker has been set
    if (marker!=null){
        //Show answer
        getSolution(numberPhoto);

        //Measuring distance
        drawOnMap();
        var distance = google.maps.geometry.spherical.computeDistanceBetween( marker.position, solutionMarker.position );
        updateScore(distance);

        //Update the buttons
        var button = document.getElementById("button");
        button.setAttribute("onClick", "nextPicture()");
        button.innerHTML = "Siguiente";
    }
}

function nextPicture(){
    //Reset map
    resetMap();

    //Get number of the next photo
    if(numberPhoto <10){
        numberPhoto++;

        //Change the picture
        var picture = document.getElementById("picture");
        picture.src="fotos/"+numberPhoto+".png";

        //Update the buttons
        var button = document.getElementById("button");
        button.setAttribute("onClick", "confirmMarker()");
        button.innerHTML = "Confirmar";

        //Update text
        document.getElementById("score").innerHTML = "<p>Photo "+numberPhoto+"/10</p><p>Total : "+ currentScore +"</p>";
    }
    else { end() }
}

function end(){
    //Show all answers
    for (i in solutionMarkers) { solutionMarkers[i].setMap(map); }

    //Delete picture and button
    var images = document.getElementById("images");
    images.parentNode.removeChild(images);
    var button = document.getElementById("buttonControl");
    document.getElementById("buttonsDiv").removeChild(button);

    //Print final score
    document.getElementById("score").innerHTML = "<p>Fin del juego</p><p>Vuestro resultado : "+ currentScore +"</p>";
}

function drawOnMap(){
    //Circles
    var i = 50000
    for (var j = 1; j < 5; j+= 1){
        var circleOptions = {
            strokeColor: 'blue',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'green',
            fillOpacity: 0.15,
            map: map,
            center: solutionMarker.position,
            radius: i
        };
        i+=150000;
        circle.push(new google.maps.Circle(circleOptions));
    }

    //Line
    line = new google.maps.Polyline({
        path: [solutionMarker.position, marker.position],
        strokeColor: "red",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: map
    });
}

function updateScore(distance) {
    var score;
    if(distance<=50000){score=100;}
    else if(distance>500000){score=0;}
    else if(distance<=200000 && distance >50000){score=50;}
    else if(distance<=500000 && distance >350000){score=10;}
    else{score=25;}

    currentScore+=score;

    //Update score and distance on screen
    document.getElementById("score").innerHTML = "<p>Distancia "+Math.round(distance/100)+" km</p><p>Turno : "+ score +"  -  Total : "+ currentScore +"</p>";
}

function getSolution(photo){
    //Create info Window
    var infowindow = new google.maps.InfoWindow({
        content: "<div style=\"width:100%;height:100%\" ><h3 style='text-align: center'>\n" +solutionLocations[photo]+
            "        </h3><img src=\"fotos/"+photo+".png\" alt='Foto'/>\n" +
            "    </div>",
        maxWidth:200
    });

    //Create solution marker
    solutionMarker = new google.maps.Marker({
        position: {lat: solutionData[photo][0], lng: solutionData[photo][1]},
        icon: "fotos/beachflag.png",
        map: map
    });
    solutionMarkers.push(solutionMarker);
    solutionMarker.addListener('click', function() {
        infowindow.open({
            anchor: solutionMarkers[photo],
            map,
            shouldFocus: false
        });
    });
}

function resetMap(){
    //Reset solution
    if (solutionMarker!=null){ solutionMarker.setMap(null); }

    //Reset marker
    marker.setMap(null); marker = null;

    //Reset drawings
    for(i in circle){ circle[i].setMap(null); }
    circle.length = 0;
    line.setMap(null);
}