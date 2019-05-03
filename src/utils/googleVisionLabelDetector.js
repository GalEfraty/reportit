const vision = require('@google-cloud/vision');

const {auth} = require('google-auth-library');
 
// load the environment variable with our keys
const keysEnvVar = process.env['CREDS'];
if (!keysEnvVar) {
  throw new Error('The $CREDS environment variable was not found!');
}
const keys = JSON.parse(keysEnvVar);


const getLabels = async function(i_Path)
{
    return new Promise
    ((resolve, reject) =>
    {
        let stringLabels = []
        
        // Creates a client
        const client = new vision.ImageAnnotatorClient({credentials: keys});
        
        // Performs label detection on the image file
        client
        .labelDetection(i_Path)
        .then(results => {
            const labels = results[0].labelAnnotations;
    
            labels.forEach((label) => {
                stringLabels.push(label.description)
            })

            //test
            console.log(stringLabels)
            resolve(stringLabels)
        })
        .catch(err => {
            reject({error: err});
        });
    })
}

module.exports = {getLabels: getLabels}