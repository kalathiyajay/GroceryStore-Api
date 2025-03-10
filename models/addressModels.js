const mongoose = require('mongoose')

const addressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    address: {
        type: String,
        required: true
    },
    houseNo: {
        type: String,
        require: true
    },
    floor: {
        type: String,
        require: true
    },
    area: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    locality: {
        type: String,
        require: true
    },
    yourName: {
        type: String,
        require: true
    },
    yourPhoneNumber: {
        type: String,
        require: true
    },
    saveAddressAs: {
        type: String,
        enum: ['Home', "Work", "Hotel", "Other"],
        require: true
    },
    orderFor: {
        type: String,
        enum: ['Myself', "Someone else"],
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('address', addressSchema);