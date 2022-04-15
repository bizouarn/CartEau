
// import axios
const axios = require('axios')
// import fs
const fs = require('fs')

async function genFishs(e){
  const dataFish = require('./data/fish.js')

  var dataFishV = new dataFish()
  // save places in json file
  var places = await dataFishV.getPlaces(1)
  console.log(places.length)
  fs.writeFile('public/fish_places.json', JSON.stringify(places), err => {
    if (err) {
      console.error(err.message)
      return
    }
  })
  // save fishs in json file
  //var fishs = await dataFishV.getFishs()
  //console.log(fishs.length)
  /*fs.writeFile('public/fishs.json', JSON.stringify(fishs), err => {
    if (err) {
      console.error(err.message)
      return
    }
  })*/
}

genFishs()