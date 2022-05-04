var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserNavigatorSchema = new Schema({
    'user': { type: Schema.Types.ObjectId, ref: 'User' },
    'finished': { type: Boolean, default: false },
    'history': [{ type: Schema.Types.ObjectId, ref: 'NavigatorHistory' }]
});

module.exports = mongoose.model('UserNavigator', UserNavigatorSchema);
