const monogose = require('mongoose')

const categorySchema = monogose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    categoryImage: {
        type: String,
        required: true
    },
    vectorImage: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = monogose.model('category', categorySchema);