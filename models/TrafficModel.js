var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TrafficSchema = new Schema({
    '_id': String,
    'pos_y': Number,
    'pos_x': Number,
    'avg_spd': Number,
    'avg_gap': Number,
    'avg_traffic': Number,
});

module.exports = mongoose.model('Traffic', TrafficSchema);