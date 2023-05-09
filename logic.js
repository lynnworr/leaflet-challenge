// access the URL endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data){
    //console.log(data);
    // call the createFeatures function
    createFeatures(data.features); // send the features property over
});

// make functions to process the data
function createFeatures(earthquakeData)
{
    // define a function named onEachFeature - to extract the location (name)
    // date, time, mag and depth
    function onEachFeature(feature, layer) {
        layer.bindPopup(
          `<center><b>Location:</b> ${feature.properties.place}<br>
           <b>Time:</b> ${new Date(feature.properties.time)}<br>
           <b>Magnitude:</b> ${feature.properties.mag}<br>
           <b>Depth:</b> ${feature.geometry.coordinates[2]}</center>`
        );
      }


    // define a function to return the color based on the depth of the earthquake
    function getColor(depth) {
        if (depth > 90) {
            return "#800026";
        } else if (depth > 70) {
            return "#BD0026";
        } else if (depth > 50) {
            return "#E31A1C";
        } else if (depth > 30) {
            return "#FC4E2A";
        } else if (depth > 10) {
            return "#FD8D3C";
        } else {
            return "#FEB24C";
        }
    }

    // define a function to return the marker size based on the magnitude of the earthquake
    function getMarkerSize(magnitude) {
        return magnitude * 5;
    }

    // define a function to create custom markers based on the earthquake's magnitude and depth
    function pointToLayer(feature, latlng) {
        var markerOptions = {
            radius: getMarkerSize(feature.properties.mag),
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };
        return L.circleMarker(latlng, markerOptions);
    }

    // use L.geoJSON to make the geoJSON marker layer with custom markers
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    // call another function to make the map - pass in the geoJSON
    createMap(earthquakes);
}

function createMap(earthquakes)
{
    // add the tile layer
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>, <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>'
    });
    // make a tileLayer object
    var tiles = {
        "Street Map": street,
        "Topography Map": topo
    };
    // make overlay that uses the earthquake geoJSON marker layer
    var overlays = {
        "Earthquake Data": earthquakes
    };
    // make the map with the defaults
    var myMap = L.map("map",
        {
            center: [37.0902, -95.7129],
            zoom: 4,
            layers: [street, earthquakes]
        }
    );
    
    // Set up the legend - set up the legend inside of a control L.control()

// define the contents of the legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 30, 50, 70, 90],
        colors = ['#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];

    // loop through the grades and generate a label with a colored square for each depth range
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colors[i] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

// add the legend to the map
legend.addTo(myMap);

// define the CSS style for the legend
var legendStyle = document.createElement('style');
legendStyle.innerHTML = '.info.legend i { display: inline-block; width: 12px; height: 12px; margin-right: 6px; }';
document.getElementsByTagName('head')[0].appendChild(legendStyle);


};


