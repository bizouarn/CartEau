// import axios
const axios = require('axios')
// import fs
const fs = require('fs')
// Bas URL for API https://hubeau.eaufrance.fr/api
var fishs;
// create an array of places
var places = [];


async function Main(){
    // Send a GET request to get all fish at /v0/etat_piscicole/code_espece_poisson
    await axios.get('https://hubeau.eaufrance.fr/api/v0/etat_piscicole/code_espece_poisson').then(async function(response){
        fishs = response.data.data;
        // For each 10 first fish in fishs
        for(var fish of fishs){
            // Send a GET request to get all fishing place at /v0/etat_piscicole/lieux_peche where code_espece_poisson = fish.code
            try{
                fish.places = await axios.get('https://hubeau.eaufrance.fr/api/v0/etat_piscicole/lieux_peche?code_espece_poisson='+fish.code).then(
                    async function(response){ return response.data.data}
                );
                // For each place in fish.places
                for(var place of fish.places){
                    // if place.code_station not in places
                    if(places.filter(placeF => place.code_station == placeF.code_station).length == 0){
                        places.push(place);
                    }
                }
            }catch(err){
                console.log(err);
            }
        }
        // save fishs in json file
        fs.writeFile('public/fishs.json', JSON.stringify(fishs), err => {
            if (err) {
              console.error(err.message);
              return
            }
          })
        // save places in json file
        fs.writeFile('public/places.json', JSON.stringify(places), err => {
            if (err) {
              console.error(err.message);
              return
            }
          });
        });
}

Main();