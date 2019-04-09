
const getLabels = (image) =>
{
    //TODO: COMPLETE WITH GOOGLE VISION API

    return new Promise((resolve, reject) => 
    {
        resolve(['demoLabel1', 'demoLabel2', 'demoLabel3'])
    }) 
}

module.exports = {getLabels: getLabels}