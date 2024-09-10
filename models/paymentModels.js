const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'netBenking'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'failed'],
        default: 'pending',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('payment', paymentSchema)