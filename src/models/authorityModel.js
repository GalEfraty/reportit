//authorityModel.js
const mongoose = require('mongoose')

const AuthoritySchema = mongoose.Schema({
    authorityType: {
        type: String,
        required: true,
        trim: true
    }, 
    scenarios: {
        type:[String],
        required: true
    }
})

const Authority = mongoose.model('Authority', AuthoritySchema)

module.exports = Authority