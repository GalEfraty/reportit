const Report = require('../models/reportModel')
const googleVisionLabelDetector = require('./googleVisionLabelDetector')
const scenarioFinder = require('./scenarioFinder')
const authorityFinder = require('./authorityFinder')
const municipalFinder = require('./municipalFinder')

const build = (i_Request) =>
{
    return new Promise(async (resolve, reject) => 
    {
        var report = new Report()

        const labels = await googleVisionLabelDetector.getLabels(i_Request.reportPicture)
        const reportScenario = await scenarioFinder.getScenario(labels) 
        const reportAuthorityType = await authorityFinder.getAuthorityType(reportScenario)
        const reportMunicipalName = await municipalFinder.getMunicipalName(i_Request.location)
        const reportAuthorityFull = await `${reportAuthorityType}_${reportMunicipalName}`
    
        report.reporterName = i_Request.reporterName
        report.reporterPhone = i_Request.reporterPhone
        report.reporterEmail = i_Request.reporterEmail
        report.reportLocation = i_Request.reportLocation
        report.reportAuthorityType = reportAuthorityType 
        report.reportMunicipalName = reportMunicipalName 
        report.reportAuthorityFull = reportAuthorityFull
        report.reportScenario = reportScenario
        report.reportStatus = i_Request.reportStatus
        report.reportPicture = i_Request.reportPicture
        report.reportTime = i_Request.reportTime ? i_Request.reportTime : Date.now()

        resolve(report)
    })
}

module.exports = {build: build}