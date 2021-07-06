const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    sex: {
        type: String
    },
    firstame: {
        type: String
    },
    lastname: {
        type: String
    },
    streetAndNumber: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    private: {
        type: Boolean
    },
    geoCoord: {
        type: Array
    },
    email: {
        type: String
    },
    owner: {
        type: String
    }
})

module.exports = mongoose.model('Contact', contactSchema);