
const Scenario = require('../models/scenarioModel')


const getScenario = (i_Labels) =>
{
    //TODO: complete
    return new Promise((resolve, reject) =>
    {
        try {
            const scenarios = Scenario.find({})
            const scenario = scenarios.filter((currentScenario)=> 
            {
                return scenario.labels.includes(labels)
            })


            resolve(scenario.scenarioName)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {getScenario: getScenario}