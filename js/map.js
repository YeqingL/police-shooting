// Function to draw your map
var map;

var drawMap = function() {
    // Create map and set viewd
    map = L.map('container');
    map.setView([34,-100],5);
    // Create an tile layer variable using the appropriate url
    var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    // Add the layer to the map
    layer.addTo(map);
    getData();
}

// Function for getting data
var getData = function() {
    var data;
    $.ajax({
    url:'data/response.json',
    type: "get",
    success:function(dat) {
        data = dat
        customBuild(dat);
    }, 
    dataType:"json"
    })
}

// Do something creative with the data here!  
var customBuild = function(data) {
    var ages = [];
    var killed = [];
    var hit = [];
    data.map(function(d){
        var circle = new L.circle([d.lat, d.lng], 300, {
            color: getColor(d["Victim's Age"]), 
            opacity:.5
            });
        circle.bindPopup("City:" + " " + d["City"] + "<br>" 
                        + "Race: " + d["Race"] + "<br>"
                        + "Summary: " + d["Summary"]);
        ages.push(circle);
        
        // Add layers to the map
        ifKilled(d, killed, hit);
    }); 
    ages = L.layerGroup(ages);
    killed = L.layerGroup(killed);
    hit = L.layerGroup(hit);
    var overlayMaps = {
        "Ages": ages,
        "Killed": killed,
        "Hit": hit
    };
    L.control.layers(null, overlayMaps).addTo(map);
    
    //Add legend to the map
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 20, 30, 50],
        labels = [];
        // loop through age intervals and generate a label with a colored square for each interval
        div.innerHTML += "Victim's Age" + '<br>';
        for (var i = 0; i < grades.length; i++) {
          div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + 
                            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(map);
}

// Different colors for different victims' ages
var getColor = function(data) {
    return data > 50 ? '#EC5104':
           data > 30 ? '#F5A040':
           data > 20 ? '#FFCD00':            
                     '#F7FF00';
}

var ifKilled = function(data, killed, hit) {
    var skullIcon = L.icon({
        iconUrl: 'js/skull.png',
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 0], // point of the icon which will correspond to marker's location
    });

    var heartIcon = L.icon({
        iconUrl: 'js/heart.png',
        iconSize:     [20, 20], // size of the icon
        iconAnchor:   [10, 0], // point of the icon which will correspond to marker's location
    });

    data["Hit or Killed?"] == "Killed" ? killed.push(L.marker([data.lat, data.lng], {icon: skullIcon}).bindPopup(
                                            "City:" + " " + data["City"] + "<br>" 
                                            + "Race: " + data["Race"] + "<br>"
                                            + "Summary: " + data["Summary"])):
                                         hit.push(L.marker([data.lat, data.lng], {icon: heartIcon}).bindPopup(
                                            "City:" + " " + data["City"] + "<br>" 
                                            + "Race: " + data["Race"] + "<br>"
                                            + "Summary: " + data["Summary"]));
};





