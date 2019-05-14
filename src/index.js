const express = require('express')
require('./db/mongoose')
const reportRouter = require('./routers/reportRouter')
const authorityRouter = require('./routers/authorityRouter')
const scenarioRouter = require('./routers/scenarioRouter')

const app = express()
const port = process.env.PORT

//allow the front to get the json responses
app.use(cors())
app.options('*', cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

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