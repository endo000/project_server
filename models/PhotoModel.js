var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    'path': String,
    'user': { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports =  mongoose.model('Photo', PhotoSchema);