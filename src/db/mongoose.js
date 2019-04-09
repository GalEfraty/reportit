//node src/db/mongoose.js
/*LOCAL ENVIROMENT DEV ONLY:: RUN TERMINAL MONGO CONNECTION:: 
    C:\Users\USER\mongodb\bin\mongod.exe --dbpath=C:\Users\USER\mongodb-data
*/
const mongoose = require('mongoose')

//process.env.MONGODB_URL
//mongodb+srv://reportitAdmin:reportitAdminGalgul@cluster0-vpjmw.mongodb.net/reportit?retryWrites=true
mongoose.connect(process.env.MONGODB_URL, 
{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})