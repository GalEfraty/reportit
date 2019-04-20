//scenarioModel.js
const mongoose = require('mongoose')

const ScenarioSchema = mongoose.Schema({
    scenarioName: {
        type: String,
        required: true,
        trim: true
    },
    labels: {
        type:[String],
        required: true
    } 
}, {timestamps: true})

const Scenario = mongoose.model('Scenario', ScenarioSchema)

module.exports = Scenario