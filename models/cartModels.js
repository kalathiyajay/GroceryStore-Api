const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('cart', cartSchema);