
const getAuthorityType = (reportScenario) =>
{
    return new Promise((resolve, reject) => 
    {
        resolve('demoAuthorityType')
    })
}

module.exports = {getAuthorityType: getAuthorityType}