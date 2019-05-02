const express = require('express')
const Report = require('../models/reportModel')
const multer = require('multer')
const sharp = require('sharp')

const emailSender = require('../utils/emailSender')
const municipalFinder = require('../utils/municipalFinder')
const googleVisionLabelDetector = require('../utils/googleVisionLabelDetector')
const scenarioFinder = require('../utils/scenarioFinder')
const authorityFinder = require('../utils/authorityFinder')
const reportsBuilder = require('../utils/reportsBuilder')


//allowing seperate files for each api route (so index.js wont look too long and messy)
const router = new express.Router()



//post: create new report - REQ01

router.post('/reports/create', async (req, res) => 
{
    try {
        //const report = await reportsBuilder.build(req.params, req)

        var report = new Report()

        report.reportAuthorityFull="test1_test"

        report.reporterName = req.body.reporterName
        report.reporterPhone = req.body.reporterPhone
        report.reporterEmail = req.body.reporterEmail
        report.reportLocation = req.body.reportLocation
        report.reportStatus = "creating"

        const reportMunicipalName = await municipalFinder.getMunicipalName(req.body.reportLocation.latitude, req.body.reportLocation.longitude)
        report.reportMunicipalName = await reportMunicipalName.municipalName

        await report.save()
        res.status(201).send({
            message: `Report created succesfully`,
            report: report})

     } catch (error) {
         console.log('Error in create report: ', error)
        res.status(400).send(error)
     }
})

//create a multer instance and middlewere to allow and control file upload
const upload = multer({
    limits: {fileSize: 1500000}, //1.5 mb
    fileFilter(req, file, cb)
    {
        if(!(file.originalname.endsWith('jpg') || file.originalname.endsWith('jpeg') || file.originalname.endsWith('png')))
        {
            return cb(new Error('Please upload an image'), false)
        }
        return cb(undefined, true)
    }  
})
router.post('/reports/create/uploadPicture/:id', upload.single('reportpicture'), async (req, res) =>
{
    try {
        const report = await Report.findById(req.params.id)
        if(!report){
            throw Error('no report found')
        }
        if(!req.file){
            throw Error('no image found')
        }

        const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
        report.reportPicture = await buffer

    
        const labels = await googleVisionLabelDetector.getLabels(req.file.buffer)
        const reportScenario = await scenarioFinder.getScenario(labels) 
        
        
        const reportAuthorityType = await authorityFinder.getAuthorityType(reportScenario)
        const reportAuthorityFull = await `${reportAuthorityType}_${report.reportMunicipalName}`
        await console.log(reportAuthorityFull)


        report.reportAuthorityType = await reportAuthorityType 
        report.reportAuthorityFull = await reportAuthorityFull
        report.reportScenario = await reportScenario
        await report.save()

        if(report.reporterEmail)
        {
            emailSender.sendReportMail(report)
        }

        report.reportStatus = "created"
        res.send({message: 'success', report, labels})

    } catch (error) {
        res.status(400).send({error: error})
    }

}, (error, req, res, next) =>{
    res.status(400).send({error: error.message})
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
        res.status(500).send(error)
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
        res.status(500).send(error)
    }
})

//get all Reports for authorityFull
router.get('/reports/byauthority/:reportAuthorityFull', async (req, res) => 
{
    const reportAuthorityFull = req.params.reportAuthorityFull
    try {
        const reports = await Report.find({reportStatus : {$ne: 'creating'}, reportAuthorityFull})
        res.send({message: `found ${reports.length} reports for ${reportAuthorityFull}`, reports: reports})
    } catch (error) {
        res.status(500).send(error)
    }
})

//get all Reports for authorityFull by time (from, to,) - unix 
router.get('/reports/byauthorityintimerange/:reportAuthorityFull/:timefrom/:timeto', async (req, res) => 
{
    const reportAuthorityFull = req.params.reportAuthorityFull
    const timefrom = req.params.timefrom
    const timeto = req.params.timeto

    try {
        const reports = await Report.find({
            reportStatus : {$ne: 'creating'},
            reportAuthorityFull: reportAuthorityFull,
            createdAt:{
                $gte: timefrom,
                $lte: timeto
            }})
        res.send({message: `${reports.length} reports has been found between ${timefrom} to ${timeto}`, reports: reports})
    } catch (error) {
        res.status(500).send(error)
    }
})

//patch- update report status
router.patch('/reports/update/:id', async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['reportStatus', 'reportAuthorityFull','reportAuthorityType', 'reporterName', 'reporterPhone', 'reporterEmail']
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
        res.status(400).send(error)
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
        res.status(500).send(error)
    }
})

//--export--\\
module.exports = router
