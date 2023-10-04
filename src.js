// variable to store filter data based on the user input
let  filteredData = {
    type: "FeatureCollection",
    features: [],
};
// creating Geojson object for filtered data
let filteredDataLayer = L.geoJSON();

// creating leaft map object and adding map tile to it
const map = L.map("map").setView([51.1657, 10.4515], 6);
const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Creating  a new GeoJSON object for data and adding to map
const dataLayer = L.geoJSON(data);
map.addLayer(dataLayer);

// declaring function for Filter-Button
const filterButtonElement = document.querySelector("#filterButton");
filterButtonElement.addEventListener("click", getDates);

// declaring function for Reset-Button
const resetButtonElement = document.querySelector("#resetButton");
resetButtonElement.addEventListener("click", resetMap);

// function to get the the dates values from  input field and check it whether are null or not
function getDates() {
    const beginDate = document.querySelector("#beginDate").value;
    const endDate = document.querySelector("#endDate").value;  

    if (beginDate && endDate) {
        getFilteredData(beginDate, endDate);
    } else {
        alert("Please enter both dates to filter the data"); // Alerting a mesage if user dont enter dates and click on reset button
    }
}

// function to filter the data from the file based on user input dates
function getFilteredData(beginDate, endDate) {
    map.removeLayer(dataLayer); 
    clearFilteredData();    // function to clear previous filter data from map and reet variables

    for (feature of data.features) {
        featureBeginDate = feature.properties.begin;
        featureEndDate = feature.properties.end;
      
        // this is condition because some features has years in number-format and then convert it to ISO-Date format
        if (
            typeof featureBeginDate == "number" &&
            typeof featureEndDate == "number"
        ) {
            featureBeginDate = new Date(featureBeginDate, 0, 2);
            featureEndDate = new Date(featureEndDate, 0, 2);

            featureBeginDate = featureBeginDate.toISOString();
            featureEndDate = featureEndDate.toISOString();
        }      
        if (
            featureBeginDate >= beginDate && featureEndDate <= endDate) {
                filteredData.features.push(feature);
              
        }    
    }
    // displaying the filter-data  on the map
    filteredDataLayer.addData(filteredData);
    map.addLayer(filteredDataLayer);
    // getting layer bound so map can zoom on particular features
    map.fitBounds(filteredDataLayer.getBounds());
   
}

// function to reset the map and display orignal Geojson file
function resetMap(){
    map.addLayer(dataLayer);
    document.querySelector("#beginDate").value = "";
    document.querySelector("#endDate").value = "";
    clearFilteredData();
    
}

 // function to clear previous filter data from map and reet variables
function clearFilteredData(){
    map.removeLayer(filteredDataLayer);
    filteredData.features = [];
    filteredDataLayer.clearLayers();
}

