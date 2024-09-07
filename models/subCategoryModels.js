const mongoose = require('mongoose')

const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    subCategoryName: {
        type: String,
        required: true
    },
    subCategoryImage: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('subCategory', subCategorySchema);