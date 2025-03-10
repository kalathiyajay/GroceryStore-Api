const mongoose = require('mongoose')

const couponSchema = mongoose.Schema({
    coupenName: {
        type: String,
        require: true
    },
    coupenCode: {
        type: String,
        require: true
    },
    coupenDiscount: {
        type: Number,
        require: true
    },
    startDate: {
        type: String,
        require: true
    },
    expiryDate: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    coupenImage: {
        type: String,
        require: true
    },
    active: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        enum: ['perpercentage', 'fixedDiscount']
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('coupen', couponSchema)
