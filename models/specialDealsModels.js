const mongoose = require('mongoose')

const specialDealsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    subTitle: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('SpecialDeals', specialDealsSchema);