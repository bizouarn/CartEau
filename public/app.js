var pruneCluster = new PruneClusterForLeaflet();
// On initialise la latitude, la longitude et le zoom (centre de la carte)
const lat = 46.561964;
const lon = 0;
const zoom = 6;
// init data
var fishs;
var places;
// Initialize the map
var map = L.map('map', { maxBounds: [[101, -200], [-101, 180]] }).setView([lat, lon], zoom);

// Insert in class="leaflet-control-zoom leaflet-bar leaflet-control" the button "centrer" after the button "zoom in"
$(".leaflet-control-zoom").append("<a class='leaflet-control-zoom-in' onclick='centrer()' title='Centrer la carte sur la position actuelle'>C</a>");
// Isert in class="leaflet-control-zoom leaflet-bar leaflet-control" the button "current location" after the button "zoom in"
$(".leaflet-control-zoom").append("<a href='#' class='leaflet-control-zoom-in' onClick='locationCourante()' title='Centrer la carte sur votre position'>G</a>");

// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

pruneCluster.PrepareLeafletMarker = function (leafletMarker, data) {
	var background;
	var zoomlevel = map.getZoom();
	var style;
	// action lors du clic sur un marker
	leafletMarker.on('click', function () { markerClick(data) });
};

function markerClick(data) {
	// find fish in fish with attribute code_station = data.obj.code_station
	var fish = fishs.filter(
		fish => {
			return (fish?.places.filter(placeF => data.obj.code_station == placeF.code_station).length > 0)
		}
	);
	console.log(data);
	var ret = data.obj.localisation + "\n\n";
	ret += "On y trouve : \n";
	// foreach fish in fishs
	for (var fi of fish) {
		// add to ret "- name of fish"
		ret += " - " + fi.nom_commun + "\n";
	}
	console.log(ret);
	alert(ret);
}

// read data in url /public/places.json
$.getJSON("/public/places.json", function (data) {
	places = data;
	// for for each fishs
	for (var place of places) {
		setTimeout(function (place) {
			// for each place, create a marker
			var marker = new PruneCluster.Marker(place.y, place.x);
			marker.data.obj = place;
			pruneCluster.RegisterMarker(marker);
		}, 1, place);
	}
	map.addLayer(pruneCluster);
	setTimeout(() => { pruneCluster.ProcessView() }, 1);
});

$.getJSON("/public/fishs.json", function (data) {
	fishs = data;
});

function locationCourante() {
	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(function (position) {
			try {
				macarte.setView([position.coords.latitude, position.coords.longitude], 12);
			} catch (e) {
				// en cas d'erreur de géolocalisation du navigateur sa recherche à partir de l'IP
				var onSuccess = function (position) {
					map.setView([position.location.latitude, position.location.longitude], 10);
				};
				var onError = function (error) {
					alert("Nous n'arrivons pas à vous géolocaliser.");
				};
				geoip2.city(onSuccess, onError);
			}
		});
	} else {
		alert("la géolocalisation n'est pas disponible sur votre navigateur.");
	}
}

// centre la carte sur les données écrites au début du fichier
function centrer() {
	map.setView([lat, lon], zoom);
};  