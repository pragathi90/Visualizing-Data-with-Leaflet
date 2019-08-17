// API call to USGS API to get earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// GET request to the query URL
d3.json(queryUrl, function(data) {
  console.log(data),
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // each feature a popup describing with information
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3 > Magnitude: "+ feature.properties.mag + 
      "</h3><h3>Location: " + feature.properties.place +
      "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>" );
  }

  // GeoJSON layer containing the features
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer : pointToLayer
  });

 
  createMap(earthquakes);
}

/// Function to assign color depends on the Magnitude
function getColor(m) {
  if(m >= 5) {
      return "#FF4500"
  } else if (m >= 4 ) {
      return "#FF8600"
  } else if (m >= 3) {
      return "#FFA500" 
  } else if (m >= 2) {
      return "#FFD700" 
  } else if (m >= 1) {
      return "#FFFF00"       
  } else {
    return "#9ACD32"
  }
}



// Create Circles with a light gray circumferance line!
function pointToLayer(feature,latlng) {
    return new L.circle(latlng, {
        stroke: true,
        color: "gray",
        weight: .4,
        fillOpacity: .6,
        fillColor: getColor(feature.properties.mag),
        radius:  feature.properties.mag * 34000
    })
}

function createMap(earthquakes) {

  // light and dark map visualization
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  //var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery A© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, \
    <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery A© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object
  var baseMaps = {
    "Light Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object 
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 4,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: true
  }).addTo(myMap);

  // Add legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5],
    labels = [];
    
      // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i>' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + "   " + '<br>' : '+');
        }
        return div;
  };
    
  legend.addTo(myMap);
};  



