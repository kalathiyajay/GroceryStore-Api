const mongoose = require('mongoose')

const productAditionSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },
    data: [{
        title: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        image: {
            type: String,
            require: true
        }
    }]
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('productAditional', productAditionSchema);
