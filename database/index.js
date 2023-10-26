const mongoose = require('mongoose');

console.log("HELLO");

mongoose.connect('mongodb+srv://COOper3211:COOper3211@cluster0.818iaj7.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp')
.then(() => console.log("CONNECTED TO DB"))
.catch((err) => console.log(err));