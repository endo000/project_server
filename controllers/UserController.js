var UserModel = require('../models/UserModel.js');
var UserNavigatorModel = require('../models/UserNavigatorModel.js');
var PhotoModel = require('../models/PhotoModel.js');
const { spawn } = require('child_process');
var fs = require('fs');
const request = require('request');

/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */
module.exports = {

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function (err, User) {
            if (err) return next(err);
            if (!User) return res.status(404).send('Not found');

            if (User.photo) {
                if (!req.file) return res.status(401).send('Image not provided');

                let img1 = fs.readFileSync('public/images/' + req.file.filename, 'base64');
                let img2 = fs.readFileSync('public/images/' + User.photo, 'base64');

                request({
                    url: 'http://face:5000/verify',
                    method: 'POST',
                    json: {
                        img1: img1,
                        img2: img2
                    }
                },
                    function (err, face_res, body) {
                        if (err) return res.status(404).send(err);

                        console.log(body);
                        if (!body.verified) return res.status(403).send('Not verified');

                        var Photo = new PhotoModel({
                            path: 'images/' + req.file.filename,
                            user: User._id
                        });
                        Photo.save();

                        req.session.userid = User._id;
                        return res.status(200).send(User);
                    });
            }
            else {
                req.session.userid = User._id;
                return res.status(200).send(User);
            }
        });
    },

    auth: function (req, res, next) {
        if (!req.session.userid)
            return res.status(404).send('Not logged in');

        UserModel.findById(req.session.userid, function (err, user) {
            if (err) return next(err);
            if (!user) {
                return res.status(403).send('Not found')
            };

            next();
        })
    },

    isLogged: function (req, res, next) {
        if (!req.session.userid)
            return res.status(404).send('Not logged in');

        UserModel.findById(req.session.userid, function (err, user) {
            if (err) return next(err);
            if (!user) {
                return res.status(403).send('Not found')
            };

            return res.status(200).send(user);
        })
    },

    /**
     * UserController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }

            return res.json(Users);
        });
    },

    /**
     * UserController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }

            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            return res.json(User);
        });
    },

    showByName: function (req, res) {
        var username = req.params.username;

        UserModel.findOne({ username: username }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }

            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            UserNavigatorModel.find({ user: User._id }).
                populate('user').populate('history').
                exec(function (err, UserNavigator) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting UserNavigator.',
                            error: err
                        });
                    }

                    if (!UserNavigator) {
                        return res.status(404).json({
                            message: 'No such UserNavigator'
                        });
                    }

                    return res.json(UserNavigator);
                });
        });
    },

    is_exists: function (req, res, next) {
        UserModel.countDocuments({ 'username': req.body.username }, function (err, count) {
            if (count > 0) {
                return res.status(409).json({
                    message: 'User already exists'
                });
            }
            next();
        });
    },

    /**
     * UserController.create()
     */
    create: function (req, res) {
        if (req.file) {
            let img = fs.readFileSync('public/images/' + req.file.filename, 'base64');

            request({
                url: 'http://face:5000/detectface',
                method: 'POST',
                json: {
                    img: img,
                }
            },
                function (err, face_res, body) {
                    if (err) return res.status(404).send(err);

                    console.log(body);
                    if (!body.detected) return res.status(403).send('Not face detected');

                    var User = new UserModel({
                        username: req.body.username,
                        password: req.body.password,
                        photo: req.file.filename
                    });

                    User.save(function (err, User) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when creating User',
                                error: err
                            });
                        }
                        req.session.userid = User._id;

                        return res.status(201).json(User);
                    });
                });
        }
        else {
            var User = new UserModel({
                username: req.body.username,
                password: req.body.password,
            });

            User.save(function (err, User) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating User',
                        error: err
                    });
                }
                req.session.userid = User._id;

                return res.status(201).json(User);

            });
        }
    },

    /**
     * UserController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }

            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            User.username = req.body.username ? req.body.username : User.username;
            User.password = req.body.password ? req.body.password : User.password;

            User.save(function (err, User) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }

                return res.json(User);
            });
        });
    },

    /**
     * UserController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};