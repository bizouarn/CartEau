const axios = require('axios')

class dataWaterQuality{
    constructor(){
        
    }
    async getPlaces(page){
        var url = 'https://hubeau.eaufrance.fr/api/vbeta/qualite_eau_potable/communes_udi?size=100'
        var places = await axios.get(url+'&page='+page).then(
            async function(response){ 
                if(response.status == 206){
                    var ret = []
                    var count = response.data.count;
                    var nbPage = Math.ceil(count/100);
                    console.log('Warning : We have to get more data. nbPage:'+nbPage);
                    for(var i = 1; i <= nbPage ; i++){
                        console.log("page",i)
                        var tmp = await axios.get(url+'&page='+page).then(
                            async function(response){ 
                                return response.data.data;
                            }
                        )
                        for(var place of tmp){
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
        //var places = []
        //var places = await this.getPlaces(1)
        //callback(places, value)
    }
    getInfo(code){
        // TODO
    }
}
module.exports = dataWaterQuality;
