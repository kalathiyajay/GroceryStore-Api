const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
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
    otp: {
        type: Number
    },
    role: {
        type: String,
        enum: ["admin", "user"]
    },
    uid: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    gender: {
        type: String,
    },
    image: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    },
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('user', userSchema)