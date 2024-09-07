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
    expiryDate: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.setDate(now.getDate() + 1));
        }
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('coupen', couponSchema)
