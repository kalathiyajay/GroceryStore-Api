const mongoose = require('mongoose');

const sequenceValueSchema = mongoose.Schema({
    prefix: {
        type: String,
        required: true
    },
    lastSequenceNumber: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('sequenceValue', sequenceValueSchema);
