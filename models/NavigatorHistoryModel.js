var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NavigatorHistory = new Schema({
    'pos_y': Number,
    'pos_x': Number,
    'speed': Number
});

module.exports = mongoose.model('NavigatorHistory', NavigatorHistory);

