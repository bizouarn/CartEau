// create object place class with constructor
class place{
  constructor(code, name, type, lat, lng, url, code_station){
    this.code = code
    this.name = name
    this.type = type
    this.lat = lat
    this.lng = lng
    this.url = url
    this.code_station = code_station
  }
}
module.exports = place;