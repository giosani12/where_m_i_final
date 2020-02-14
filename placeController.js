// placeController.js
// Import place model
Place = require('./placeModel');
// Handle index actions
exports.entryPoint = function (req, res) {
    Place.get(function (err, places) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res.json({
            status: "success",
            message: "Places retrieved suddenly",
            data: places
        });
    });
};

