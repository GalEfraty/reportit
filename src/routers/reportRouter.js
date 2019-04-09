const express = require('express')
const Report = require('../models/reportModel')
const reportsBuilder = require('../utils/reportsBuilder')

//allowing seperate files for each api route (so index.js wont look too long and messy)
const router = new express.Router()

//post: create new report
//*****TODO INSIDE X2******//
router.post('/reports/create', async (req, res) => 
{
    /*------TODO: the method reportsBuilder.build is not completed ------*/
    try {
        const report = await reportsBuilder.build(req.body)

        await report.save()
        res.status(201).send({
            message: `Report created succesfully`,
            report: report})

        //--TODO: send Email to the citizen with all the details.
         
     } catch (error) {
         console.log('Error in create report: ', error)
        res.status(400).send(error)
     }
})

//get all Reports
router.get('/reports/all', async (req, res) => 
{
    try {
        const reports = await Report.find({})
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
        const reports = await Report.find({reportAuthorityFull})
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
            reportAuthorityFull: reportAuthorityFull,
             reportTime:{
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
