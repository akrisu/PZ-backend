let mongoose = require('mongoose');
let Vehicle = require('../models/vehicle');

function createVehicle(req, res) {
  var newVehicle = new Vehicle(req.body);

  newVehicle.save((err, vehicle) => {
    if (err) {
      return res.status(400).send(err);
    }

    return res.json({ message: 'Vehicle created successfully', vehicle });
  });
}

function getVehicles(req, res) {
  Vehicle.find({}, function(err, vehicleList) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json({ vehicleList });
  });
}

function getAvaliableVehicles(req, res) {
  Vehicle.find({ inUse: false }, function(err, vehicleList) {
    if (err) {
      return res.status(500).send(err);
    }

    return res.json({ vehicleList });
  });
}

function deleteVehicle(req, res) {
  Vehicle.deleteOne({ _id: req.params.id, inUse: false }, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        return res.status(200).json({ message: 'Vehicle deleted successfully' });
    });
}
module.exports = { createVehicle, getVehicles, getAvaliableVehicles, deleteVehicle }
