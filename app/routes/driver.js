let mongoose = require('mongoose');
let Driver = require('../models/driver');

/*
* POST /driver to register a new driver.
*/
function createDriver(req, res) {
    // Creates a new driver from request
    var newDriver = new Driver(req.body);

    // Save it into DB.
    newDriver.save((err, driver) => {
        if (err) {
            return res.status(400).send(err);
        }

        return res.json({ message: 'Driver successfully created!', driver });
    });
}

function getDrivers(req, res) {
    Driver.find({}, function(err, driverList) {
        if (err) {
            return res.status(500).send(err);
        }

        return res.json({ driverList });
    });
}

function getAvaliableDrivers(req, res) {
    Driver.find({ inUse: false }, function(err, driverList) {
        if (err) {
            return res.status(500).send(err);
        }

        return res.json({ driverList });
    });
}

function deleteDriver(req, res) {
    Driver.deleteOne({ _id: req.params.id, inUse: false }, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        return res.status(200).json({ message: 'Driver deleted successfully' });
    })
}

module.exports = { createDriver, getAvaliableDrivers, deleteDriver, getDrivers };
