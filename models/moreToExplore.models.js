const mongoose = require('mongoose')

const moreToExploreSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    moreToExploreImage: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('moreToExplore', moreToExploreSchema);
