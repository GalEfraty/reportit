const express = require('express')
require('./db/mongoose')
const reportRouter = require('./routers/reportRouter')
const authorityRouter = require('./routers/authorityRouter')
const scenarioRouter = require('./routers/scenarioRouter')

const app = express()
const port = process.env.PORT

//auto parse income json files to js objects
app.use(express.json())

//allowing seperate files for each api route (so index.js wont look too long and messy)
app.use(reportRouter)
app.use(authorityRouter)
app.use(scenarioRouter)

app.get('', (req, res) => 
{
    res.send('Hello Report It!')
})

//server flag
app.listen(port, () => {
    console.log('reportit: server is up on port '+ port)
})