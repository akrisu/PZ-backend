let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DriverSchema = new Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        workerId: { type: Number, required: true },
        phone: { type: String, required: false },
        workStartDate: { type: Date, required: false },
        inUse: { type: Boolean, required: false, default: false }
    }
);

DriverSchema.pre('save', next => {
    now = new Date();

    if (!this.workStartDate) {
        this.workStartDate = now;
    }

    next();
});

module.exports = mongoose.model('driver', DriverSchema);
