const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    orderId: {
        type: String,
        require: true
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
            status: {
                type: String,
                enum: ['Confirmed', 'shipped', 'delivered', 'Cancelled'],
                default: 'Confirmed',
            },
            reason: {
                type: String,
                require: true
            }
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
    discount: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('order', orderSchema);