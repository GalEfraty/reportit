//scenarioRouter.js
const express = require('express')
const Scenario = require('../models/scenarioModel')

//allowing seperate files for each api route (so index.js wont look too long and messy)
const router = new express.Router()

//post: create new scenario:
router.post('/scenarios/create', async (req, res) => 
{
    const scenario = new Scenario(req.body) 
     try {
        await scenario.save()
        res.status(201).send(scenario)
     } catch (error) {
        res.status(400).send({error: error})
     }
})

//get all scenarios and it's labels
router.get('/scenarios/all', async (req, res) => 
{
    try {
        const scenarios = await Scenario.find({})
        res.send({message: `showing all ${scenarios.length} scenarios`, scenarios: scenarios})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//get one scenario type and all of it's Labels
router.get('/scenarios/:id', async (req, res) =>
{
    const _id = req.params.id
    try {
        const scenario = await Scenario.findById(_id)
        if(!scenario)
        {
            return res.status(404).send()
        }
        res.send({message: 'found successfully', scenario: scenario}) 
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//patch- update - add more labels to scenario
router.patch('/scenarios/update/addlabels/:id', async (req, res) =>
{
    const labels = req.body.labels
    if(!labels)
    {
        return res.status(400).send({error: 'no scenarios to update'})
    }

    try {
        const scenario = await Scenario.findById(req.params.id)
        if(Array.isArray(labels))
        {
            labels.forEach((label) => scenario.labels.push(label))
        }
        else{
            scenario.labels.push(labels)
        }

        scenario.save()

        if(!scenario)
        {
            return res.status(404).send()
        }

        const addedLabels = req.body.length? labels.length : 1
        res.send({message: `Updated successfully: ${addedLabels} labels added`, senario: scenario})
    } catch (error) {
        res.status(400).send({error: error})
    }   
})

//patch- update scenario - scenario document
router.patch('/scenarios/update/:id', async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['scenarioName', 'labels']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'})
    }

    try {
        const scenario = await Scenario.findById(req.params.id)
        updates.forEach((update) => {
            scenario[update] = req.body[update]
        })
        scenario.save()

        if(!scenario)
        {
            return res.status(404).send()
        }
        res.send({message: 'updated successfully', scenario: scenario})
    } catch (error) {
        res.status(400).send({error: error})
    }
})

//delete scenario
router.delete('/scenarios/delete/:id', async (req, res) =>
{
    try {
        const scenario = await Scenario.findByIdAndDelete(req.params.id)
        if(!scenario){
            return res.status(404).send()
        }
        res.send({message: 'deleted successfully', scenario: scenario})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//--export--\\
module.exports = router