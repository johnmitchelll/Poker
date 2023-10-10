const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    password: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    created: {
        type: mongoose.SchemaTypes.Date,
        required: true,
        default: Date.now(),
    }
});


module.exports = mongoose.model('users', UserSchema);