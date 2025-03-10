const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    subCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
        required: true
    },
    barcode: {
        type: String,
        require: true
    },
    productImage: [{
        type: String,
        required: true
    }],
    totalPrice: {
        type: Number,
        require: true
    },
    weight: {
        type: String,
        require: true
    },
    discount: {
        type: String,
        require: true
    },
    unit: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    quantity: {
        type: Number,
        required: true
    },
    productDetails: {
        type: String,
        require: true
    },
    NutrientValueAndBenefits: {
        type: String,
        require: true
    },
    StorageTemperature: {
        type: String,
        require: true
    },
    Decription: {
        type: String,
        require: true
    },
    disclaimer: {
        type: String,
        require: true
    },
    FSSAILicense: {
        type: String,
        require: true
    },
    customerCareDetails: {
        type: String,
        require: true
    },
    returnPolicy: {
        type: String,
        require: true
    },
    expiryDate: {
        type: String,
        require: true
    },
    SellerFSSAI: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        require: true,
        default: true
    },
    visibility: {
        type: String,
        enum: ["Published", 'Scheduled', 'Hidden'],
        default: "Published"
    },
    scheduledDate: {
        type: String,
        require: true
    },
    scheduledTime: {
        type: String,
        require: true
    },
    tax: {
        type: Number,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('product', productSchema)