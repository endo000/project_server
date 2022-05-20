const request = require('request');
var mongoose = require('mongoose');

var TrafficModel = require('../models/TrafficModel.js');

/**
 * TrafficController.js
 *
 * @description :: Server-side logic for managing Traffics.
 */
module.exports = {
    scrapper: function () {
        request('https://opendata.si/promet/counters/', { json: true },
            function (err, res, body) {
                if (err) { return console.log(err); }
                let roads = body.Contents[0].Data.Items;

                let new_roads = roads.map((road) => {
                    let road_properties = road.Data[0].properties;

                    return new TrafficModel({
                        _id: road.Data[0].Id,
                        pos_y: road.y_wgs,
                        pos_x: road.x_wgs,
                        avg_spd: parseInt(road_properties.stevci_hit),
                        avg_gap: parseInt(road_properties.stevci_gap),
                        avg_traffic: parseInt(road_properties.stevci_stev),
                    });
                });

                try {
                    let session;
                    TrafficModel.startSession().
                        then(function (_session) {
                            session = _session;
                            return session.withTransaction(async () => {
                                await TrafficModel.deleteMany({}, { session: session });
                                await TrafficModel.insertMany(new_roads, { session: session });
                            });
                        }).
                        then(function () {
                            session.endSession();
                        });
                } catch (error) {
                    console.log(error.message);
                }
            });
    },

    /**
     * TrafficController.list()
     */
    list: function (req, res) {
        TrafficModel.find(function (err, Traffics) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Traffic.',
                    error: err
                });
            }

            return res.json(Traffics);
        });
    },

    /**
     * TrafficController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        TrafficModel.findOne({ _id: id }, function (err, Traffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Traffic.',
                    error: err
                });
            }

            if (!Traffic) {
                return res.status(404).json({
                    message: 'No such Traffic'
                });
            }

            return res.json(Traffic);
        });
    },

    /**
     * TrafficController.create()
     */
    create: function (req, res) {
        var Traffic = new TrafficModel({
            // pos_y: req.body.pos_y,
            // pos_x: req.body.pos_x,
            // spped: req.body.speed,
            // user: req.session.userid
        });

        Traffic.save(function (err, Traffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Traffic',
                    error: err
                });
            }

            return res.status(201).json(Traffic);
        });
    },

    /**
     * TrafficController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        TrafficModel.findOne({ _id: id }, function (err, Traffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Traffic',
                    error: err
                });
            }

            if (!Traffic) {
                return res.status(404).json({
                    message: 'No such Traffic'
                });
            }


            Traffic.save(function (err, Traffic) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Traffic.',
                        error: err
                    });
                }

                return res.json(Traffic);
            });
        });
    },

    /**
     * TrafficController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        TrafficModel.findByIdAndRemove(id, function (err, Traffic) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Traffic.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
