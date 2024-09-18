const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    mobileNo: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ["admin", "user"]
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('user', userSchema)