const mongoose = require('mongoose')

const specialDealsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String,
        required: true
    },
    dealsImage: {
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