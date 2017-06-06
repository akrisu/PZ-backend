let mongoose = require('mongoose');
let Order = require('../models/order');
let Driver = require('../models/driver');
let Vehicle = require('../models/vehicle');

function createOrder(req, res) {
  var newOrder = new Order(req.body);

  Driver.findOne({ _id: req.body.driver, inUse: false }, function(err, driver) {
    if (err) {
      return res.status(400).send(err);
    }

    newOrder.driver = driver._id;

    Vehicle
    .find({
      inUse: false,
      volume: { $gte: req.body.loadVolume },
      capacity: { $gte: req.body.loadCapacity }
    }, function(err, vehicleList) {
      if (err) {
        return res.status(400).send(err);
      }

      if (vehicleList.length === 0) {
        return res.status(400).send('No free vehicle found');
      }

      newOrder.vehicle = vehicleList[0]._id;

      newOrder.save((err, order) => {
        if (err) {
          return res.status(400).send(err);
        }

        Driver.findOneAndUpdate({ _id: newOrder.driver}, { inUse: true }, { upsert: true }, function(err, driver) {
          if (err) {
            return res.status(400).send(err);
          }
        });

        Vehicle.findOneAndUpdate({ _id: newOrder.vehicle }, { inUse: true }, { upsert: true }, function(err, vehicle) {
          if (err) {
            return res.status(400).send(err);
          }
        });

        return res.json({ message: 'Order created successfully', order });
      });
    })
    .sort({ volume: 'asc' });
  });
}

function getOrders(req, res) {
  Order
  .find()
  .populate({ path: 'driver' })
  .populate({ path: 'vehicle' })
  .exec(function(err, orderList) {
    if (err) {
      res.status(400).send(err);
    }
    return res.json({ orderList });
  });
}

function updateFuel(req, res) {
  Order.findOneAndUpdate({ _id: req.params.id }, { fuel: req.body.fuel }, { upsert: true }, function(err, order) {
    if (err) {
      return res.status(400).send(err);
    }

    return res.json({ message: 'Order updated successfully', order });
  });
}

function finishOrder(req, res) {
  Order.findOneAndUpdate({ _id: req.params.id }, { finished: true }, { upsert: true }, function(err, order) {
    if (err) {
      return res.status(400).send(err);
    }

    Vehicle.findOneAndUpdate({ _id: order.vehicle }, { inUse: false }, { upsert: true }, function(err, order) {
      if (err) {
        return res.status(400).send(err);
      }
    });

    Driver.findOneAndUpdate({ _id: order.driver }, { inUse: false }, { upsert: true }, function(err, order) {
      if (err) {
        return res.status(400).send(err);
      }
    });

    return res.status(200).json({ message: 'Order finished' });
  })
}

module.exports = { createOrder, updateFuel, getOrders, finishOrder }
