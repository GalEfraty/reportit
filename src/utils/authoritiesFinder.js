const Authority = require('../models/authorityModel')

const getAuthorityTypes = (i_ReportScenarios) =>
{
    return new Promise(async (resolve, reject) => 
    {
        try {
            const allAuthorities = await Authority.find({})
            if(!allAuthorities){throw Error('unable to fetch authorities')}
            let matchAuthoritiesTotal = []
            
            i_ReportScenarios.forEach(async (scenario) =>
            {
                //all the authorities that include the scenario in their scenarios array
                const matchAuthorities = await allAuthorities.filter(authority => authority.scenarios.includes(scenario))

                if(!matchAuthorities){throw Error('couldn\'t find authorities that match the scenarios')}

                await matchAuthorities.forEach((authority) => 
                {
                    matchAuthoritiesTotal.push(authority.authorityType)
                })
            })
    
            resolve(matchAuthoritiesTotal)
        } catch (error) {
            reject(error)
        }

    })
}

const getAuthoritiesFull = (i_ReportMunicipalName, i_ReportAuthorityTypes) =>
{
    return new Promise(async(resolve, reject) =>
    {
        let authoritiesFull = []
        await i_ReportAuthorityTypes.forEach((authorityType) =>
        {
            authoritiesFull.push(`${i_ReportMunicipalName}_${authorityType}`)
        })

        if(authoritiesFull.length === 0)
        {
            return reject('authorities not found')
        }

        resolve(authoritiesFull)
    })
}

module.exports = 
{   getAuthorityTypes: getAuthorityTypes,
    getAuthoritiesFull: getAuthoritiesFull
}