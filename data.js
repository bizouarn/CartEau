
// import axios
const axios = require('axios')
// import fs
const fs = require('fs')

async function genFishs(e){
  const dataFish = require('./data/type/fish.js')

  var dataFishV = new dataFish()
  var places = await dataFishV.getPlaces(1)
  var fishs = await dataFishV.getFishs()
  // print places count
  console.log(fishs.length)
  console.log(places.length)
  // save places in json file
  fs.writeFile('public/fish_places.json', JSON.stringify(places), err => {
    if (err) {
      console.error(err.message)
      return
    }
  })
  // save fishs in json file
  fs.writeFile('public/fishs.json', JSON.stringify(fishs), err => {
    if (err) {
      console.error(err.message)
      return
    }
  })
}
genFishs()