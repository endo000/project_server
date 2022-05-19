var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NavigatorHistory = new Schema({
    'position': {
        'latitude': Number,
        'longitude': Number,
        'speed': Number
    },
    'accelerometer': {
        'x': Number,
        'y': Number,
        'z': Number
    },
    'magnetometer': {
        'x': Number,
        'y': Number,
        'z': Number
    }
}, { timestamps: true });

module.exports = mongoose.model('NavigatorHistory', NavigatorHistory);

