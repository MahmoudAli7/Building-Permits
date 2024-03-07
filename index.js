var map = L.map('map').setView([51,-114],11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
}).addTo(map);

var markerClusters = L.markerClusterGroup().addTo(map);

document.addEventListener('DOMContentLoaded', function() {
    $("#startDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
    $("#endDate").datepicker({
        dateFormat: "yy-mm-dd"
    });
});

document.getElementById('dateRange').addEventListener('submit', function(e){
    e.preventDefault();
    var startDate = document.getElementById('startDate').value;
    var endDate = document.getElementById('endDate').value;
    var url = "https://data.calgary.ca/resource/c2es-76ed.geojson"

    // Show Loading Indicator
    document.getElementById('buttonText').style.display = 'none';
    document.getElementById('loadingIndicator').style.display = '';

    url = `https://data.calgary.ca/resource/c2es-76ed.geojson?$where=issueddate > '${startDate}' and issueddate < '${endDate}'`


    fetch(url)
        .then(function(response){
            return response.json()
        })
        .then(function(data){

            // Hide Loading Indicatior
            document.getElementById('buttonText').style.display = '';
            document.getElementById('loadingIndicator').style.display = 'none';
            if((data.features).length == 0){
                alert(`No building permits between ${startDate} and ${endDate}`)
            }
            markerClusters.clearLayers();
            L.geoJSON(data, {
                onEachFeature: function(feature, layer){
                    if (feature.properties){
                        var popupContent = `<b>Issued Date:</b> ${feature.properties.issueddate}<br>
                        <b>Work Class Group:</b> ${feature.properties.workclassgroup}<br>
                        <b>Contractor Name:</b> ${feature.properties.workclassgroup}<br>
                        <b>Community Name:</b> ${feature.properties.communityname}<br>
                        <b>Original Address:</b> ${feature.properties.originaladdress}<br>`

                        layer.bindPopup(popupContent);
                    }
                }
            }).addTo(markerClusters)
        })
        .catch(function(error){
            alert("Problem with API Response", error)
        });
});


