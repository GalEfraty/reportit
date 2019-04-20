const vision = require('@google-cloud/vision');

const getLabels = async function(i_Path)
{
    return new Promise
    ((resolve, reject) =>
    {
        let stringLabels = []
        
        // Creates a client
        const client = new vision.ImageAnnotatorClient();
        
        // Performs label detection on the image file
        client
        .labelDetection(i_Path)
        .then(results => {
            const labels = results[0].labelAnnotations;
    
            labels.forEach((label) => {
                stringLabels.push(label.description)
            })
    
            resolve(stringLabels)
        })
        .catch(err => {
            reject({error: err});
        });
    })
}

module.exports = {getLabels: getLabels}