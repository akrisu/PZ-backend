let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8080;
let config = require('config'); //we load the db location from the JSON files
let env = require('./env/config');
let cors = require('cors');

let book = require('./app/routes/book');
let driverRoutes = require('./app/routes/driver');
let userRoutes = require('./app/routes/user');

let router = express.Router();

//db options
let options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

env.setConfig();

//db connection
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

//don't show the log when it is test
if(config.util.getEnv('NODE_ENV') !== 'test') {
	//use morgan to log at command line
	app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());

router.route('/driver')
	.post(driverRoutes.createDriver);

router.route('/user/login')
	.post(userRoutes.loginUser);

router.route('/user/register')
	.post(userRoutes.createUser);

router.route("/book")
	.get(book.getBooks)
	.post(book.postBook);

router.route("/book/:id")
	.get(book.getBook)
	.delete(book.deleteBook)
	.put(book.updateBook);


app.use('/api', router);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing
