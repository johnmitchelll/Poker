const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    created: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now(),
    }, 
    totalWinnings:{
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    }, 
    bestSessionWinnings:{
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    handsPlayed:{
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    topTen:{
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "00",
    }
});


module.exports = mongoose.model('users', UserSchema);