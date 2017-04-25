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
            res.status(400).send(err);
        } else {
            res.json({ message: 'Driver successfully created!', driver });
        }
    });
}

module.exports = { createDriver };
