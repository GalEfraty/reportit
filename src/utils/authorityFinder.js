const Authority = require('../models/authorityModel')

const getAuthorityType = (i_ReportScenario) =>
{
    return new Promise(async (resolve, reject) => 
    {
        try {
            const allAuthorities = await Authority.find({})
            let matchAuthorities = await allAuthorities.filter(authority => authority.scenarios.includes(i_ReportScenario))

    
            if(!matchAuthorities)
            {
                reject('Unable to find authority')
            }
    
            resolve(matchAuthorities[0].authorityType)
        } catch (error) {
            reject(error)
        }

    })
}

module.exports = {getAuthorityType: getAuthorityType}