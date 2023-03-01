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
const maxBounds =  [[52, -6], [40, 10]] // Pour filtrer les stations hors de France
const maxBoundsMove = [[62, -16], [30, 20]]
// init data
// Initialize the map
var map = L.map('map', { 
  maxBounds: maxBoundsMove,
  minZoom: 6,
}).setView([lat, lon], zoom)

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
  $('#info-content').html('<div id="loading-content" class="uk-text-center"><div uk-spinner></div></div>')
  // call api for get more
  if(data.type == 'fish'){
    $('#info-title').text(data.obj.localisation)
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
          fishs_in_station[poisson.code_espece_poisson] = obj
          ret += '<tr><td>' + poisson.nom_poisson + '</td><td>' + poisson.effectif + '</td><td>' + poisson.poids + '</td><td>' + poisson.date_operation + '</td></tr>'
        }
        ret += '</table>'
        $('#info-content').append(ret)
      }
      $('#info-content').find('#loading-content').remove()
    })
  } else if(data.type == 'temperature'){
    $.getJSON('https://hubeau.eaufrance.fr/api/v1/temperature/chronique?code_station=' + data.obj.code_station + '&format=json&sort=desc', function (data) {
      if(data.data.length > 0) {
        $('#info-title').text(data.data[0].libelle_station)
        var ret = ''
        ret += '<table class="uk-table uk-table-small uk-table-striped uk-table-hover uk-table-small">'
        ret += '<thead><th>Date</th><th>Heure</th><th>Température</th></tr></thead>'

        for (var value of data.data) {
          ret += '<tr><td>' + value.date_mesure_temp + '</td><td>' + value.heure_mesure_temp + '</td><td>' + value.resultat + value.symbole_unite + '</td>'
        }
        ret += '</table>'
      }
      $('#info-content').append(ret)
      $('#info-content').find('#loading-content').remove()
    })
  } else if(data.type == 'hydrometry'){
    $.getJSON('https://hubeau.eaufrance.fr/api/v1/hydrometrie/observations_tr?code_entite=' + data.obj.code_station + '&format=json&sort=desc', function (data) {
      console.log(data)
      if(data.data.length > 0) {
        $('#info-title').text(data.data[0].libelle_station)
        var ret = ''
        ret += '<table class="uk-table uk-table-small uk-table-striped uk-table-hover uk-table-small">'
        ret += '<thead><th>Date</th><th>Hydrometry</th><th>Qualification</th></tr></thead>'

        for (var value of data.data) {
          ret += '<tr><td>' + value.date_obs + '</td><td>' + value.resultat_obs + " " + value.grandeur_hydro + '</td><td>' + value.libelle_qualification_obs + '</td>'
        }
        ret += '</table>'
      }
      $('#info-content').append(ret)
      $('#info-content').find('#loading-content').remove()
    })
  } else if(data.type == 'piezometrie'){
    console.log(data);
    $.getJSON('https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques?code_bss=' + data.obj.code_bss + '&format=json&sort=desc', function (data) {
      if(data.data.length > 0) {
        $('#info-title').text(data.data[0].libelle_station)
        var ret = ''
        ret += '<table class="uk-table uk-table-small uk-table-striped uk-table-hover uk-table-small">'
        ret += '<thead><th>Date</th><th>Niveau d\'eau</th><th>Profondeur nappe</th><th>Qualification</th></tr></thead>'

        for (var value of data.data) {
          ret += '<tr><td>' + value.date_mesure + '</td><td>' + value.niveau_nappe_eau + ' m</td><td>' + value.profondeur_nappe + ' m</td><td>' + value.qualification + '</td>'
        }
        ret += '</table>'
      }
      $('#info-content').append(ret)
      $('#info-content').find('#loading-content').remove()
    })
  } else {
    $('#info-content').append('ERROR : No content')
    $('#info-content').find('#loading-content').remove()
  }
  UIkit.offcanvas('#info').toggle()
}
function inBound(lat, lon) {
  return (
    lat >= Math.min(maxBounds[0][0], maxBounds[1][0]) 
    && lat <= Math.max(maxBounds[0][0], maxBounds[1][0])
    && lon >= Math.min(maxBounds[0][1], maxBounds[1][1])
    && lon <= Math.max(maxBounds[0][1], maxBounds[1][1])
  )
}
// read json file config.json
$.getJSON('config.json', async function (config) {
  // for each value in data
  for (var value of config) {
    //var dataClass = new data();
    // read data in json
    var places = await $.getJSON(value.json)
    // for for each fishs
    var confM = JSON.parse(JSON.stringify(value)) // deep copy
    for (var place of places) {
      setTimeout(function (place) {
        // for each place, create a marker
        if(inBound(place.y, place.x)) {
          var marker = new PruneCluster.Marker(place.y, place.x)
          marker.data.type = confM.name
          marker.data.obj = place
          marker.data.icon = confM.image+''
          pruneCluster.RegisterMarker(marker)
        }
      }, 1, place)
    }
    setTimeout(() => { 
      map.addLayer(pruneCluster)
      pruneCluster.ProcessView()
      map.invalidateSize() // see https://github.com/Leaflet/Leaflet/issues/690
    }, 1)
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