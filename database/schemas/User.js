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
        default: -10000000,
    },
    handsPlayed:{
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: 0,
    },
    bestSessionSlots:{
        type: mongoose.SchemaTypes.Number,
        required: true,
        default: -10000000,
    },
    topTen:{
        type: mongoose.SchemaTypes.String,
        required: true,
        default: "000",
    }
});


module.exports = mongoose.model('users', UserSchema);