const mongoose = require('mongoose')

const whishListSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('wishList', whishListSchema)
