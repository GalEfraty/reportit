const sharp = require('sharp')
const Report = require('../models/reportModel')
const googleVisionLabelDetector = require('./googleVisionLabelDetector')
const scenarioFinder = require('./scenarioFinder')
const authorityFinder = require('./authorityFinder')
const municipalFinder = require('./municipalFinder')

const build = (i_Request, request) =>
{
    return new Promise(async (resolve, reject) => 
    {
        var report = new Report()
        //getting the picture's buffer
        console.log(request.file.buffer)
        const reportPictureBuffer = sharp(request.file.buffer).png().toBuffer()
        

        /*TODO:
        * save picture in directory
        * change it's name
        * give the label detector the path
        * delete the image from directory */

        const labels = await googleVisionLabelDetector.getLabels(reportPictureBuffer)
        const reportScenario = await scenarioFinder.getScenario(labels) 
        const reportAuthorityType = await authorityFinder.getAuthorityType(reportScenario)
        //const reportMunicipalName = await municipalFinder.getMunicipalName(i_Request.location)
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
        report.reportPicture = reportPictureBuffer
        resolve(report)
    })
}

module.exports = {build: build}