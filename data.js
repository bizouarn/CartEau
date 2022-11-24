
// import fs
const fs = require('fs')
var config = JSON.parse(fs.readFileSync('public/config.json'))

for(var value of config){
  const data = require(value.gen)
  var dataG = new data()
  // save places in json file
  dataG.getData(value,(places,value)=>{
    fs.writeFile('public/'+ value.json, JSON.stringify(places), err => {
      if (err) {
        console.error(err.message)
      }
    })
  })
}