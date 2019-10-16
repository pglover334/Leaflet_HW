var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(queryUrl, function(data) {
  console.log(data)
  createFeatures(data.features);
});


function createFeatures(earthquakeData) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><h3>" + "Magnitude: " + feature.properties.mag + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function radiusSize(mag) {
    return mag * 40000;
  }

  function circleColor(mag) {
    if (mag < 1) {
      return "#ffffb2"
    }
    else if (mag < 2) {
      return "#fed976"
    }
    else if (mag < 3) {
      return "#feb24c"
    }
    else if (mag < 4) {
      return "#fd8d3c"
    }
    else if (mag < 5) {
      return "#f03b20"
    }
    else {
      return "#bd0026"
    }
  };
  

  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function(earthquakeData, latlng) {
      return L.circle(latlng, {
        radius: radiusSize(earthquakeData.properties.mag),
        color: circleColor(earthquakeData.properties.mag),
        fillOpacity: 1
      });
    },
    onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  var outdoormap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });
 

  var overlayMaps = {
    Earthquakes: earthquakes,
  };

  var myMap = L.map("map", {
    center: [
      40.4637, 3.7492
    ],
    zoom: 2,
    layers: [outdoormap, earthquakes]
  });


  function getColor(d) {
    return d > 5  ? '#bd0026' :
           d > 4  ? '#f03b20' :
           d > 3  ? '#fd8d3c' :
           d > 2  ? '#feb24c' :
           d > 1  ? '#fed976' :
                    '#ffffb2';
  };


  var legend = L.control({position: 'topright'});
  
  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          mag = [0, 1, 2, 3, 4, 5, 6],
          labels = [];
  
      for (var i = 0; i < mag.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
              mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
      }
  
      return div;
};
  
  legend.addTo(myMap);
}  