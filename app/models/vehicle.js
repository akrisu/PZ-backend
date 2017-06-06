let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let VehicleSchema = new Schema(
  {
    registrationNumber: { type: String, required: true },
    volume: { type: Number, required: true },
    capacity: { type: Number, required: true },
    inUse: { type: Boolean, default: false }
  }
);

module.exports = mongoose.model('vehicle', VehicleSchema);
