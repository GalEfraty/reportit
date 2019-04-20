//municipalFinder
const request = require('request')

const getMunicipalName = (i_Lat, i_Long)=>
{
    return new Promise 
    ((resolve, reject) =>
    {
        const mapboxURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${i_Long},${i_Lat}.json?access_token=${process.env.MAPBOX_API_KEY}&language=en`
        request({url: mapboxURL, json: true} ,(error, {body}) =>
        {
            const municipalName = body.features[1].text
            const adress = body.features[1].place_name_en
            console.log(municipalName)
            console.log(adress)

            if(error){
                return reject(error)
            }

            resolve({municipalName: municipalName, fullAdress: adress})
        })
   })
}

module.exports = {getMunicipalName: getMunicipalName}