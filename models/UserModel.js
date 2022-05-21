var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    'username': String,
    'password': String,
    'photo': String
});

UserSchema.statics.authenticate = function (username, password, callback) {
    User.findOne({ username: username })
        .exec(function (err, User) {
            if (err) {
                return callback(err);
            } else if (!User) {
                var err = new Error("User not found");
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, User.password, function (err, result) {
                if (result === true) {
                    return callback(null, User);
                } else {
                    return callback();
                }
            });
        });
}

UserSchema.pre('save', function (next) {
    var User = this;
    bcrypt.hash(User.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        User.password = hash;
        next();
    });
});

var User = mongoose.model('User', UserSchema);
module.exports = User;