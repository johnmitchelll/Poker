const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(process.env.MONGODB_URI ||
                'mongodb+srv://COOper3211:COOper3211@cluster0.818iaj7.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
.then(() => console.log("CONNECTED TO DB"))
.catch((err) => console.log(err));