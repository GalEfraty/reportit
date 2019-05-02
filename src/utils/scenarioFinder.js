
const Scenario = require('../models/scenarioModel')


const getScenario = (i_Labels) =>
{
    //TODO: complete
    return new Promise(async(resolve, reject) =>
    {
        try {
            //attention!: if one day the program will run on non-free-tier atlas server -> use Scenario.find().$where(..), and not get all the collection from the db. thats bad.
            const allScenarios = await Scenario.find({})
            let matchScenarios = await allScenarios.filter(scenario => scenario.labels.some(lable => i_Labels.includes(lable)))

            let matchesScenariosNames = []
            matchScenarios.forEach((scenario) => matchesScenariosNames.push(scenario.scenarioName))

            if(!matchScenarios)
            {
                return reject('Scenarios not found')
            }

            resolve(matchesScenariosNames[0])
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {getScenario: getScenario}