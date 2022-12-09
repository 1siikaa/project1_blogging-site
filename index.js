const mongoose = require('mongoose');
const express = require("express");
const route = require('./src/route/route.js')

const app = express();

app.use(express.json())

mongoose.connect("mongodb+srv://Vashika:Vanshikaa08@cluster0.on6mcgr.mongodb.net/test")
.then(()=> console.log("MongoDB is connected, Goodluck for the project!!!"))
.catch(err => console.log(err))


app.use("/",route)

app.listen(2200, function () {
    console.log('Express app running on port ' + 2200)
});


