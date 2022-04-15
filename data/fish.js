const axios = require('axios')

class dataFish{
    constructor(){
        
    }
    async getFishs(){
        var fishs = await axios.get('https://hubeau.eaufrance.fr/api/v0/etat_piscicole/code_espece_poisson?format=json&size=2000').then(
            async function(response){ 
                if(response.status == 206){
                    console.log('Warning : We have to get more data. nbPage:'+nbPage);
                }
                return response.data.data
            }
        );
        // sort fishs by code
        fishs.sort(function(a, b){
            return a.code - b.code;
        });
        return fishs;
    }        
    async getPlaces(page){
        var fishs = await this.getFishs()
        var fishstr = [];
        var nb = 10;
        for(var i = 0; i < fishs.length; i++){
            if(fishstr[((i-(i%nb))/nb)] == undefined){
                fishstr[((i-(i%nb))/nb)] = '';
            }
            fishstr[((i-(i%nb))/nb)] += ','+fishs[i].code;
        }
        var places = [];
        for(var j = 0; j < fishstr.length; j++){
            fishstr[j] = fishstr[j].substring(1);
            var url = "https://hubeau.eaufrance.fr/api/v0/etat_piscicole/lieux_peche?code_espece_poisson="+fishstr[j]+"&format=json&size=2000";
            console.log(url)
            var tmp = await axios.get(url).then(
                async function(response){ 
                    try{
                        var ret = []
                        if(response.status == 206){
                            var count = response.data.count;
                            var nbPage = Math.ceil(count/2000);
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
                        } else {
                            return response.data.data;
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
            )
            for(var place of tmp){
                if(places.filter(p => p.code_station == place.code_station).length == 0){
                    places.push(place)
                }
            }
        }
        return places;
    }
    getInfo(code){
        // TODO
    }
    icon = {
        iconUrl: './images/pin.png',
        iconAnchor: [24, 48],
        iconSize: [48, 48]
    }
}
module.exports = dataFish;
