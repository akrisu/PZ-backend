let express = require('express');
let app = express();
let mongoose = require('mongoose');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let port = 8085;
let config = require('config'); //we load the db location from the JSON files
let env = require('./env/config');
let cors = require('cors');

//db options
let options = {
	server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
	replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }
};

//db connection
mongoose.connect(config.DBHost, options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

let authMiddleware = require('./app/middleware/authMiddleware');
let book = require('./app/routes/book');
let driverRoutes = require('./app/routes/driver');
let userRoutes = require('./app/routes/user');
let vehicleRoutes = require('./app/routes/vehicle');
let orderRoutes = require('./app/routes/order');


let router = express.Router();

env.setConfig();

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
	.post(authMiddleware.verifyUser, authMiddleware.verifyAdmin, driverRoutes.createDriver)
	.get(authMiddleware.verifyUser, authMiddleware.verifyAdmin, driverRoutes.getDrivers);

router.route('/driver/:id')
	.delete(authMiddleware.verifyUser, authMiddleware.verifyAdmin, driverRoutes.deleteDriver);

router.route('/driver/avaliable')
	.get(authMiddleware.verifyUser, authMiddleware.verifyAdmin, driverRoutes.getAvaliableDrivers);

router.route('/order')
	.post(authMiddleware.verifyUser, authMiddleware.verifyAdmin, orderRoutes.createOrder)
	.get(authMiddleware.verifyUser, orderRoutes.getOrders);

router.route('/order/finish/:id')
	.get(authMiddleware.verifyUser, authMiddleware.verifyAdmin, orderRoutes.finishOrder);

router.route('/order/fuel/:id')
	.post(authMiddleware.verifyUser, orderRoutes.updateFuel);

router.route('/vehicle')
	.post(authMiddleware.verifyUser, authMiddleware.verifyAdmin, vehicleRoutes.createVehicle)
	.get(authMiddleware.verifyUser, authMiddleware.verifyAdmin, vehicleRoutes.getVehicles);

router.route('/vehicle/:id')
	.delete(authMiddleware.verifyUser, authMiddleware.verifyAdmin, vehicleRoutes.deleteVehicle);

router.route('/vehicle/avaliable')
	.get(authMiddleware.verifyUser, authMiddleware.verifyAdmin, vehicleRoutes.getAvaliableVehicles);

router.route('/user/login')
	.post(userRoutes.loginUser);

router.route('/user/register')
	.post(userRoutes.createUser);

app.use('/api', router);

app.listen(port);
console.log("Listening on port " + port);

module.exports = app; // for testing
