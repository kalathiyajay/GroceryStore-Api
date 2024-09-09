const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderItems: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ],
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'address',
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'netBanking'],
        default: 'cod'
    },
    coupenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupen',
    },
    totalAmount: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'canceled'],
        default: 'pending',
    },
    discount: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    reason: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('order', orderSchema);