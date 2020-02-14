var mongoose = require('mongoose');
// Setup schema
var placeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
                type: String,
                required: true
    },
    locationPrecise: {
                type: String,
                required: true
    },
});
// Export Place model
var Place = module.exports = mongoose.model('place', placeSchema);
module.exports.get = function (callback, limit) {
    Place.find(callback).limit(limit);
}


