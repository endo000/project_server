var UsernavigatorModel = require('../models/UserNavigatorModel.js');
var NavigatorHistoryModel = require('../models/NavigatorHistoryModel.js');

/**
 * UserNavigatorController.js
 *
 * @description :: Server-side logic for managing UserNavigators.
 */
module.exports = {

    /**
     * UserNavigatorController.list()
     */
    list: function (req, res) {
        UsernavigatorModel.find().populate('history').exec(function (err, UserNavigators) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserNavigator.',
                    error: err
                });
            }

            return res.json(UserNavigators);
        });
    },

    /**
     * UserNavigatorController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UsernavigatorModel.findOne({ _id: id }, function (err, UserNavigator) {
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
    },

    /**
     * UserNavigatorController.create()
     */
    create: function (req, res) {
        UsernavigatorModel.findOne({ user: req.session.userid, finished: false }, function (err, UserNavigator) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserNavigator.',
                    error: err
                });
            }

            let navigationHistory = new NavigatorHistoryModel({ pos_y: req.body.pos_y, pox_x: req.body.pos_x, speed: req.body.speed });
            navigationHistory.save(function (err, navigationHistory) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating NavigationHistory.',
                        error: err
                    });
                }

                if (!UserNavigator) {
                    UserNavigator = new UsernavigatorModel({
                        user: req.session.userid,
                        history: [navigationHistory]
                    });
                }
                else {
                    UserNavigator.history.push(navigationHistory);
                }

                UserNavigator.save(function (err, UserNavigator) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating UserNavigator',
                            error: err
                        });
                    }

                    return res.status(201).json(UserNavigator);
                });
            });
        });
    },

    finish: function (req, res) {
        UsernavigatorModel.findOneAndUpdate({ user: req.session.userid, finished: false }, { finished: true }, function (err, UserNavigator) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserNavigator',
                    error: err
                });
            }

            if (!UserNavigator) {
                return res.status(500).json({
                    message: 'Error when updating UserNavigator.'
                });
            }

            return res.json(UserNavigator);
        });
    },

    /**
     * UserNavigatorController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UsernavigatorModel.findOne({ _id: id }, function (err, UserNavigator) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting UserNavigator',
                    error: err
                });
            }

            if (!UserNavigator) {
                return res.status(404).json({
                    message: 'No such UserNavigator'
                });
            }

            UserNavigator.save(function (err, UserNavigator) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating UserNavigator.',
                        error: err
                    });
                }

                return res.json(UserNavigator);
            });
        });
    },

    /**
     * UserNavigatorController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UsernavigatorModel.findByIdAndRemove(id, function (err, UserNavigator) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the UserNavigator.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
