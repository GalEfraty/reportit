const express = require('express')
const Report = require('../models/reportModel')
const multer = require('multer')
const sharp = require('sharp')
const moment = require('moment')

const emailSender = require('../utils/emailSender')
const municipalFinder = require('../utils/municipalFinder')
const googleVisionLabelDetector = require('../utils/googleVisionLabelDetector')
const scenariosFinder = require('../utils/scenariosFinder')
const authoritiesFinder = require('../utils/authoritiesFinder')


//allowing seperate files for each api route (so index.js wont look too long and messy)
const router = new express.Router()

//create a multer instance and middlewere to allow and control file upload
const upload = multer({
    limits: {fileSize: 4500000}, //4.5 mb
    fileFilter(req, file, cb)
    {
        if(!(file.originalname.endsWith('jpg') || file.originalname.endsWith('jpeg') || file.originalname.endsWith('png')))
        {
            return cb(new Error('Please upload an image file'), false)
        }
        return cb(undefined, true)
    }  
})

//post: create new report
router.post('/reports/create',  upload.single('reportpicture'), async (req, res) => 
{
        if(!req.file)
        {
            res.status(400).send({error: 'no image found'})
        }
        else
        {
            var report = await new Report()

            report.reporterName = await req.body.reporterName
            report.reporterPhone = await req.body.reporterPhone
            report.reporterEmail = await req.body.reporterEmail
            report.reportLocation.latitude = await req.body.latitude
            report.reportLocation.longitude = await req.body.longitude
    
            var reportMunicipalName
            try {
                reportMunicipalName = await municipalFinder.getMunicipalName(req.body.latitude, req.body.longitude)
            } catch (error) {
                return res.status(400).send({error: 'No geo location'})
            }

            if(!reportMunicipalName)
            {
                return res.status(400).send({error: 'Municipal Name not found'}) 
            }
            else
            {
                report.reportMunicipalName = await reportMunicipalName.municipalName
    
                const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
                report.reportPicture = await buffer
                
                //trycatch labels scenarios??
                var labels
                try {
                    labels = await googleVisionLabelDetector.getLabels(req.file.buffer) //labels = ['str']
                } catch (error) {
                    return res.status(400).send({error: 'Unable to analyze picture'}) 
                }

                var reportScenarios
                try {
                    reportScenarios = await scenariosFinder.getScenarios(labels) //reportScenarios =['str']
                } catch (error) {
                    return res.status(400).send({error: 'Unable to find scenario'}) 
                }

                var reportAuthorityTypes
                try {
                    reportAuthorityTypes = await authoritiesFinder.getAuthorityTypes(reportScenarios) //reportAuthorityTypes = ['str']
                } catch (error) {
                    return res.status(400).send({error: 'Unable to find the type of authorities'}) 
                }

                var reportAuthoritiesFull
                try {
                    reportAuthoritiesFull = await authoritiesFinder.getAuthoritiesFull(report.reportMunicipalName, reportAuthorityTypes) //reportAuthoritiesFull = ['str']
                } catch (error) {
                    return res.status(400).send({error: 'Unable to find the authorities'}) 
                }
        
                report.reportAuthorityTypes = await reportAuthorityTypes 
                report.reportAuthoritiesFull = await reportAuthoritiesFull
                report.reportScenarios = await reportScenarios
                report.reportStatus = await "created"
        
                if(report.reporterEmail)
                {
                    emailSender.sendReportMail(report)
                }
        
                await report.save()
                
                report.reportPicture = ''
                report.body = await emailSender.mailBody(report);
                res.status(201).send({
                    message: `Report created succesfully`,
                    report: report
                })
            }
        }
})

//get all Reports
router.get('/reports/all', async (req, res) => 
{
    try {
        const reports = await Report.find({reportStatus : {$ne: 'creating'}})
        res.send({
            message: `found ${reports.length} reports`,
            reports: reports})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//get one Report by id
router.get('/reports/:id', async (req, res) =>
{
    const _id = req.params.id
    try {
        const report = await Report.findById(_id)
        if(!report)
        {
            return res.status(404).send({message: 'no report found'})
        }
        res.send({message: 'report has been found successfully', report: report}) 
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//get all Reports for authorityFull
///:reportAuthorityFull
router.get('/reports/byauthority/:reportAuthorityFull', async (req, res) => 
{
    const reportAuthorityFull = req.params.reportAuthorityFull

    try {
        const reports = await Report.find({
            //NOT WORKING!! NEED TO FIX!
            reportAuthoritiesFull: reportAuthorityFull, //only reports that reportAuthorityFull include the parameter!
            reportStatus : {$ne: 'creating'}
        })
        res.send({message: `found ${reports.length} reports for ${reportAuthorityFull}`, reports: reports})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//get all Reports for authorityFull by time (from, to,) - unix 
router.get('/reports/byauthorityintimerange/:reportAuthorityFull/:timefrom/:timeto', async (req, res) => 
{
    const reportAuthorityFull = req.params.reportAuthorityFull
    const timefrom = moment.unix(parseInt(req.params.timefrom))
    const timeto = moment.unix(parseInt(req.params.timeto))
    console.log(timefrom)

    try {
        const reports = await Report.find({
            reportStatus : {$ne: 'creating'},
            reportAuthoritiesFull: reportAuthorityFull,
            createdAt:{
                $gte: timefrom,
                $lte: timeto
            }})
        res.send({message: `${reports.length} reports has been found between ${timefrom} to ${timeto}`, reports: reports})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//patch- update report status
router.patch('/reports/update/:id', async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['reportStatus', 'reportAuthoritiesFull','reportAuthorityTypes', 'reporterName', 'reporterPhone', 'reporterEmail']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'})
    }

    try {
        const report = await Report.findById(req.params.id)
        updates.forEach((update) => {
            report[update] = req.body[update]
        })
        report.save()

        if(!report)
        {
            return res.status(404).send()
        }
        res.send({message: `the report has been updated successfully`, report: report})
    } catch (error) {
        res.status(400).send({error: error})
    }
})

//delete Report
router.delete('/reports/delete/:id', async (req, res) =>
{
    try {
        const report = await Report.findByIdAndDelete(req.params.id)
        if(!report){
            return res.status(404).send()
        }
        res.send({message: 'deleted successfully', report: report})
    } catch (error) {
        res.status(500).send({error: error})
    }
}) 

//--export--\\
module.exports = router
