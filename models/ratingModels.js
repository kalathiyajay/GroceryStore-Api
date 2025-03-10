const mongoose = require('mongoose')

const ratingSchema = mongoose.Schema({
    name: {
        type: String,
        default: "Groccery Customer",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    star: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('rating', ratingSchema)