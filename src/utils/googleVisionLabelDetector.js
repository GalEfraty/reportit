const vision = require('@google-cloud/vision');

//create a secure google service acount json file
const googleAuthenticationObject = 
{
    "type": "service_account",
    "project_id": "reportit",
    "private_key_id": process.env.GOOGE_PRIVATE_KEY_ID,
    "private_key": process.env.GOOGLE_PRIVATE_KEY,
    "client_email": process.env.GOOGLE_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.GOOGLE_client_X509_CERT_URL
}

const googleAuthenticationJsonFile = JSON.stringify(googleAuthenticationObject)


const getLabels = async function(i_Path)
{
    return new Promise
    ((resolve, reject) =>
    {
        let stringLabels = []
        
        // Creates a client
        const client = new vision.ImageAnnotatorClient(googleAuthenticationJsonFile);
        
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