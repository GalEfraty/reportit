//reportModel.js
const mongoose = require('mongoose')
const validator = require('validator')

//NOTE: REPORT SCHEMA: 
/*Report(reporterName, reporterPhone, reporterEmail, reportLocation, reportAuthorityType, reportMunicipalName, reportAuthorityFull, reportScenario, reportStatus, reportPicture, reportTime)*/

const reportSchema = mongoose.Schema({
    reporterName: {
        type: String,
        trim: true,
        required: true
    },

    reporterPhone: {
        type: String
    },

    reporterEmail: {
        type: String,
        trim: true,
        required: true,
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
        required: true
    },

    reportMunicipalName: {
        required: true,
        type: String,
        trim: true
    }, 

    reportAuthoritiesFull: {
        type: [String],
        required: true,
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

    reportScenarios: {
        type: [String],
        required: true
        }, 

    reportStatus:{
        required: true,
        type: String,
        required: true
    }, 

    reportPicture: {
        type: Buffer,
        required: true
    }, 
}, {timestamps: true})

const Report = mongoose.model('Report', reportSchema)

module.exports = Report