var mongoose = require('mongoose');
// Setup schema
var videoSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    videoid: {
	type: String,
	required: true
    },
    locname: {
		type: String,
		required: true
    },
    loccoords: {
		type: String,
		required: true
    },
    loccoordsPrecise: {
		type: String,
		required: true
    },
    purpose: {
	type: String,
	required: true
    },
    content: String,
    audience: String,
    detail: String,
    language: String,
    //vote: String,
});
// Export Video model
var Video = module.exports = mongoose.model('video', videoSchema);
module.exports.get = function (callback, limit) {
    Video.find(callback).limit(limit);
}
