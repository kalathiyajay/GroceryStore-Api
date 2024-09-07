const monogose = require('mongoose')

const categorySchema = monogose.Schema({
    categoryName: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = monogose.model('category', categorySchema);