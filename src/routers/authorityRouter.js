//authorityRouter.js
const express = require('express')
const Authority = require('../models/authorityModel')

//allowing seperate files for each api route (so index.js wont look too long and messy)
const router = new express.Router()

//post: create new authority type:
router.post('/authorities/create', async (req, res) => 
{
    const authority = new Authority(req.body)
     try {
        await authority.save()
        res.status(201).send({message: `authority created successfully`, authority: authority})
     } catch (error) {
        res.status(400).send({error: error})
     }
})

//get all authority types and all of it's scenarios
router.get('/authorities/all', async (req, res) => 
{
    try {
        const authorities = await Authority.find({})
        res.send({message: `showing all ${authorities.length} authorities`, authorities: authorities})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//get one authority type and all of it's scenarios
router.get('/authorities/:id', async (req, res) =>
{
    const _id = req.params.id
    try {
        const authority = await Authority.findById(_id)
        if(!authority)
        {
            return res.status(404).send()
        }
        res.send({message: 'authority has been found successfully', authority: authority}) 
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//patch- update - add more scenarios to authority. node: gets' an Array of scenario or just one!
router.patch('/authorities/update/addscenariotoauthority/:id', async (req, res) =>
{
    if(!req.body.scenarios)
    {
        return res.status(404).send({error: 'no scenarios to update'})
    }

    try {
        const authority = await Authority.findById(req.params.id)
        const scenarios = req.body.scenarios
        if(!authority)
        {
            return res.status(404).send({error: 'authority not found'})
        }

        if(Array.isArray(scenarios))
        {
            scenarios.forEach((scenario) => authority.scenarios.push(scenario))
        }
        else{
            authority.scenarios.push(scenarios)
        }

        authority.save()
        res.send({message: 'updated successfully', authority: authority})
    } catch (error) {
        res.status(400).send({error: error})
    }   
})

//patch- update authority type - scenario document
router.patch('/authorities/update/:id', async (req, res) =>
{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['authorityType', 'scenarios']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error: 'invalid updates'})
    }

    try {
        const authority = await Authority.findById(req.params.id)

        if(Array.isArray(updates))
        {
            updates.forEach((update) => {
                authority[update] = req.body[update]
            })
        }
        else{
            authority[updates] = req.body[updates]
        }

        authority.save()

        if(!authority)
        {
            return res.status(404).send()
        }
        res.send({message: 'updated', authority: authority})
    } catch (error) {
        res.status(400).send({error: error})
    }
})

//delete authority
router.delete('/authorities/delete/:id', async (req, res) =>
{
    try {
        const authority = await Authority.findByIdAndDelete(req.params.id)
        if(!authority){
            return res.status(404).send()
        }
        res.send({message: 'deleted', authority: authority})
    } catch (error) {
        res.status(500).send({error: error})
    }
})

//--export--\\
module.exports = router