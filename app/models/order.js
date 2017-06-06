let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let OrderSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
    loadVolume: { type: Number, required: true },
    loadCapacity: { type: Number, required: true },
    finished: { type: Boolean, required: false, default: false },
    fuel: { type: String, required: false, default: '0'},
    vehicle: { type: Schema.Types.ObjectId, ref: 'vehicle' },
    driver: { type: Schema.Types.ObjectId, ref: 'driver' }
  }
);

module.exports = mongoose.model('order', OrderSchema);
