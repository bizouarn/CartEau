const axios = require('axios')

class dataFish{
    constructor(){
        
    }    
    async getPlaces(page){
        var places = [];
        var url = "https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/stations?format=json&size=2000";
        console.log(url)
        var tmp = await axios.get(url).then(
            async function(response){ 
                try{
                    if(response.status == 200 || response.status == 206){
                        var count = response.data.count;
                        var nbPage = Math.ceil(count/2000);
                        for(var i = 1; i <= nbPage ; i++){
                            console.log("page",i)
                            var tmp = await axios.get(url+'&page='+i).then(
                                async function(response){ 
                                    return response.data.data;
                                }
                            )
                            for(var place of tmp){
                                places.push(place)
                            }
                            console.log('nb places',places.length,tmp.length)
                        }
                    } else {
                        return response.data.data;
                    }
                }catch(err){
                    console.log(err)
                }
            }
        )
        
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
module.exports = dataFish;
