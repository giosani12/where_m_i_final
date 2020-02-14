// Filename: entryPoint.js

let express = require('express');
let secure = require('express-force-https');
let path = require('path');
let app = express();
let apiRoutes = require('./api-routes.js');
const port = 8000;

// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
mongoose.set('debug', true);
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
// Deprecated: mongoose.connect('mongodb://localhost/resthub');
mongoose.connect('mongodb://site181950:beeT2qui@mongo_site181950:27017/', { useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected suddenly")

/* foces https */
app.use(secure);

/* files in ./public are now accessible */
app.use('/static', express.static(path.join(__dirname, 'public')))

/* use API routes in the app */
app.use('/api', apiRoutes);

/* (!!!) add router to send appropriate response for REST requests (mongodb, etc.) */
app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.post('/', (req, res) => {
	return res.send("Received a POST HTTP method");
});

app.put('/', (req, res) => {
	return res.send("Received a PUT HTTP method");
});

app.delete('/', (req, res) => {
	return res.send("Received a DELETE HTTP method");
});

app.listen(port, () => {
	console.log('Where M I listenting on port ' +  port);
});
