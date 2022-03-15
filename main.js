import $ from 'jquery';
import * as L from 'leaflet'
import '/node_modules/leaflet/dist/leaflet.css'
import '/node_modules/uikit/dist/js/uikit.js'
import '/node_modules/uikit/dist/css/uikit.css'
import { PruneCluster, PruneClusterForLeaflet } from '/PruneCluster.js'
import '/css/PruneCluster.css'
import '/css/style.css'

var pruneCluster = new PruneClusterForLeaflet()
// On initialise la latitude, la longitude et le zoom (centre de la carte)
const lat = 46.561964
const lon = 0
const zoom = 6
// init data
var fishs
var places
// Initialize the map
var map = L.map('map', { maxBounds: [[101, -200], [-101, 180]] }).setView([lat, lon], zoom)

// Insert in class="leaflet-control-zoom leaflet-bar leaflet-control" the button "centrer" after the button "zoom in"
var linkCenter = document.createElement('a')
linkCenter.classList.add('leaflet-control-zoom-in')
linkCenter.onclick = function () {
  map.setView([lat, lon], zoom)
}
linkCenter.title = 'Centrer la carte'
linkCenter.innerHTML = '<span class=\'material-icons\'>zoom_out_map</span>'
var linkLocation = document.createElement('a')
linkLocation.classList.add('leaflet-control-zoom-in')
linkLocation.innerHTML = '<span class=\'material-icons\'>my_location</span>'
linkLocation.onclick = function () {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      try {
        macarte.setView([position.coords.latitude, position.coords.longitude], 12)
      } catch (e) {
        // en cas d'erreur de géolocalisation du navigateur sa recherche à partir de l'IP
        var onSuccess = function (position) {
          map.setView([position.location.latitude, position.location.longitude], 10)
        }
        var onError = function (error) {
          alert('Nous n\'arrivons pas à vous géolocaliser.')
        }
        geoip2.city(onSuccess, onError)
      }
    })
  } else {
    alert('la géolocalisation n\'est pas disponible sur votre navigateur.')
  }
}
$('.leaflet-control-zoom').append(
  linkCenter
)
// Isert in class="leaflet-control-zoom leaflet-bar leaflet-control" the button "current location" after the button "zoom in"
$('.leaflet-control-zoom').append(
  linkLocation
)

// Initialize the base layer
var osm_mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OSM Mapnik <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

pruneCluster.PrepareLeafletMarker = function (leafletMarker, data) {
  var background
  var zoomlevel = map.getZoom()
  var style
  // action lors du clic sur un marker
  leafletMarker.on('click', function () { markerClick(data) })
}

function markerClick(data) {
  // find fish in fish with attribute code_station = data.obj.code_station
  var fish = fishs.filter(
    fish => {
      return (fish?.places.filter(placeF => data.obj.code_station == placeF.code_station).length > 0)
    }
  )
  console.log(data)
  var ret = data.obj.localisation + '\n\n'
  ret += 'On y trouve : \n'
  // foreach fish in fishs
  for (var fi of fish) {
    // add to ret "- name of fish"
    ret += ' - ' + fi.nom_commun + '\n'
  }
  console.log(ret)
  alert(ret)
}

// read data in url /places.json
$.getJSON('./places.json', function (data) {
  places = data
  // for for each fishs
  for (var place of places) {
    setTimeout(function (place) {
      // for each place, create a marker
      var marker = new PruneCluster.Marker(place.y, place.x)
      marker.data.obj = place
      pruneCluster.RegisterMarker(marker)
    }, 1, place)
  }
  map.addLayer(pruneCluster)
  setTimeout(() => { pruneCluster.ProcessView() }, 1)
})

$.getJSON('./fishs.json', function (data) {
  fishs = data
})

function locationCourante() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function (position) {
      try {
        macarte.setView([position.coords.latitude, position.coords.longitude], 12)
      } catch (e) {
        // en cas d'erreur de géolocalisation du navigateur sa recherche à partir de l'IP
        var onSuccess = function (position) {
          map.setView([position.location.latitude, position.location.longitude], 10)
        }
        var onError = function (error) {
          alert('Nous n\'arrivons pas à vous géolocaliser.')
        }
        geoip2.city(onSuccess, onError)
      }
    })
  } else {
    alert('la géolocalisation n\'est pas disponible sur votre navigateur.')
  }
}

// centre la carte sur les données écrites au début du fichier
function centrer() {
  map.setView([lat, lon], zoom)
}

// when the page is loaded
$(document).ready(function () {
  $('#loading-screen').hide()
  $("#app").show()
})