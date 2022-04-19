const axios = require('axios')
const { trace } = require('console')
const fs = require('fs')

class dataWaterQuality{
    constructor(){
        
    }
    async getPlaces(page){
        var communes_udi = []
        // read json file laposte_hexasmal.json
        fs.readFile('./private/laposte_hexasmal.json', 'utf8', function (err, data) {
            var data = JSON.parse(data)
            for(var communes in data){
                communes_udi[data[communes].fields.code_commune_insee] = data[communes].fields;
            }
        })
        var size = 1000;
        var url = 'https://hubeau.eaufrance.fr/api/vbeta/qualite_eau_potable/communes_udi?size='+size
        var places = await axios.get(url+'&page='+page).then(
            async function(response){ 
                if(response.status == 200 || response.status == 206){
                    var ret = []
                    var count = response.data.count;
                    var nbPage = Math.ceil(count/size);
                    console.log('Warning : We have to get more data. nbPage:'+nbPage);
                    for(var i = 1; i <= nbPage ; i++){
                        console.log("page",i)
                        var tmp = await axios.get(url+'&page='+i).then(
                            async function(response){ 
                                return response.data.data;
                            }
                        )
                        for(var place of tmp){
                            place.x = communes_udi[place.code_commune].coordonnees_gps[1]
                            place.y = communes_udi[place.code_commune].coordonnees_gps[0]
                            ret.push(place)
                        }
                        console.log('nb places',ret.length,tmp.length)
                    }
                    return ret;
                }
                return response.data.data
            }
        );
        // sort fishs by code
        places.sort(function(a, b){
            return a.code_commune - b.code_commune;
        });
        return places;
    }        
    async getData(value,callback){
        var places = await this.getPlaces(1)
        callback(places, value)
    }
    getInfo(code){
        // TODO
    }
}
module.exports = dataWaterQuality;
