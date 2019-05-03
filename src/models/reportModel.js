//reportModel.js
const mongoose = require('mongoose')
const validator = require('validator')

//NOTE: REPORT SCHEMA: 
/*Report(reporterName, reporterPhone, reporterEmail, reportLocation, reportAuthorityType, reportMunicipalName, reportAuthorityFull, reportScenario, reportStatus, reportPicture, reportTime)*/

const reportSchema = mongoose.Schema({
    reporterName: {
        type: String,
        trim: true,
        default: "Anonymous reporter"
    },

    reporterPhone: {
        type: Number,
        default: 0,
    },

    reporterEmail: {
        type: String,
        trim: true,
        default: "Anonymousreporter@report.it",
        validate(value){
            if(!validator.isEmail(value)){throw Error('Email is invalid')}
        }
    },  
    
    reportLocation: 
    {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    }, 

    reportAuthorityTypes:{
        type: [String],
        //TODO: validate if the authority exist in db bu find. if not, Error
    },

    reportMunicipalName: {
        required: true,
        type: String,
        trim: true
    }, 

    reportAuthoritiesFull: {
        type: [String],
        validate(value)
        {
            value.forEach((element) => 
            {
                if(!element.includes('_'))
                {
                    throw Error('reportAuthorityFull must be formated like: authorityType_municipalName')
                }
            });
        }
    }, 

    //--TODO inside nice to have
    reportScenarios: {
        type: [String]
        //TODO: validate:: if the Scenario exist in db. if not, Error
    }, 

    reportStatus:{
        required: true,
        type: String,
        default: 'No Status'
    }, 

    reportPicture: {
        type: Buffer
    }, 
}, {timestamps: true})

const Report = mongoose.model('Report', reportSchema)

module.exports = Report