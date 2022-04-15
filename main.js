import $ from 'jquery'
import * as L from 'leaflet'
import '/node_modules/leaflet/dist/leaflet.css'
import * as UIkit from 'uikit'
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
// var fishs
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
// Add tooltip btn
$('.leaflet-control-zoom').append(
  linkCenter
)
$('.leaflet-control-zoom').append(
  linkLocation
)

// Initialize the base layer
var osm_mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | données <a href="https://www.eaufrance.fr/">Eaufrance</a>'
}).addTo(map)

pruneCluster.PrepareLeafletMarker = function (leafletMarker, data) {
  var icon = L.icon({
    iconUrl: data.icon,
    iconAnchor: [24, 48],
    iconSize: [48, 48]
  })
  leafletMarker.setIcon(icon)
  // action lors du clic sur un marker
  leafletMarker.on('click', function () { markerClick(data) })
}

function markerClick(data) {
  // TODO : Use config.json for standardize the function
  var ret = ''
  $('#info-title').text(data.obj.localisation)
  $('#info-content').html('<div id="loading-content" class="uk-text-center"><div uk-spinner></div></div>')
  // call api for get more
  $.getJSON('https://hubeau.eaufrance.fr/api/v0/etat_piscicole/poissons?code_station=' + data.obj.code_station + '&format=json', function (data) {
    var fishs_in_station = []
    if(data.data.length > 0) {
      var ret = ''
      ret += '<table class="uk-table uk-table-small uk-table-striped uk-table-hover uk-table-small">'
      ret += '<thead><th>Espèce</th><th>Quantité</th><th>Poids</th><th>Date</th></tr></thead>'
      // sort by date
      data.data.sort(function (a, b) {
        return new Date(b.date_operation) - new Date(a.date_operation)
      })
      for (var poisson of data.data) {
        var obj = {
          code_espece_poisson: poisson.code_espece_poisson,
          code_station: poisson.code_station,
          nom_poisson: poisson.nom_poisson,
          effectif: poisson.effectif,
          poids: poisson.poids,
          densite: poisson.densite,
          surface_peche: poisson.surface_peche,
          date_operation: poisson.date_operation
        }
        console.log(obj)
        fishs_in_station[poisson.code_espece_poisson] = obj
        ret += '<tr><td>' + poisson.nom_poisson + '</td><td>' + poisson.effectif + '</td><td>' + poisson.poids + '</td><td>' + poisson.date_operation + '</td></tr>'
      }
      ret += '</table>'
      $('#info-content').append(ret)
    }
    $('#info-content').find('#loading-content').remove()
  })
  UIkit.offcanvas('#info').toggle()
}

// read json file /config.json
$.getJSON('/config.json', function (config) {
  // for each value in data
  for (var value of config) {
    // trace value
    console.log(value)
    // read data in url /fish_places.json
    $.getJSON(value.json, function (data) {
      places = data
      // for for each fishs
      for (var place of places) {
        setTimeout(function (place) {
          // for each place, create a marker
          var marker = new PruneCluster.Marker(place.y, place.x)
          marker.data.obj = place
          marker.data.icon = value.image
          pruneCluster.RegisterMarker(marker)
        }, 1, place)
      }
      setTimeout(() => { 
        map.addLayer(pruneCluster)
        pruneCluster.ProcessView()
        map.invalidateSize() // see https://github.com/Leaflet/Leaflet/issues/690
      }, 1000)
    })
  }
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
  $('#app').show()
})