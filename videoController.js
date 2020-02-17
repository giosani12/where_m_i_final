// videoController.js
// Import video model
Video = require('./videoModel');
// Handle index actions
exports.entryPoint = function (req, res) {
    Video.get(function (err, videos) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Videos retrieved suddenly",
            data: videos
        });
    });
};
// Handle create video actions
exports.new = function (req, res) {
    console.log(req);
    var video = new Video();
    video.user = req.body.user ? req.body.user : video.user;
    video.videoid = req.body.videoid ? req.body.videoid : video.videoid;
    video.locname = req.body.locname ? req.body.locname : video.locname;
    video.loccoords = req.body.loccoords ? req.body.loccoords : video.loccoords;
    video.loccoordsPrecise = req.body.loccoordsPrecise ? req.body.loccoordsPrecise : video.loccoordsPrecise;
    video.purpose = req.body.purpose ? req.body.purpose : video.purpose;
    video.content = req.body.content;
    video.audience = req.body.audience;
    video.detail = req.body.detail;
    video.language = req.body.language;
    //video.vote = req.body.vote;
    video.markModified("user");
    video.markModified("videoid");
    video.markModified("locname");
    video.markModified("loccoords");
    video.markModified("loccoordsPrecise");
    video.markModified("purpose");
    video.markModified("content");
    video.markModified("audience");
    video.markModified("detail");
    video.markModified("language");
    //video.markModified("vote");
    video.save(function (err) {
        if (err)
             res.json(err);
	res.json({
            message: 'New video created!',
            data: video
        });
    });
};

// Handle view video info
exports.view = function (req, res) {
    Video.findById(req.params.id, function (err, video) {
        if (err)
            res.send(err);
        res.json({
            message: 'Video details loading..',
            data: video
        });
    });
};

