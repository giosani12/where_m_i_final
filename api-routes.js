// Filename: api-routes.js
// Initialize express router
let router = require('express').Router();
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to PORCODIO crafted with love!'
    });
});

// Import video controller
var videoController = require('./videoController');
// Video routes
router.route('/videos')
    .get(videoController.entryPoint)
    .post(videoController.new); // inserimento video
router.route('/videos/:stringaricerca') //implementare stringa metadati per ricerca video
    .get(videoController.view)

// Import place controller
var placeController = require('./placeController');
// Place routes
router.route('/places')
    .get(placeController.entryPoint)


// Export API routes
module.exports = router;



