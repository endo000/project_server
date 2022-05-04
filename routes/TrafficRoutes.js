var express = require('express');
var router = express.Router();
var TrafficController = require('../controllers/TrafficController.js');

/*
 * GET
 */
router.get('/', TrafficController.list);

/*
 * GET
 */
router.get('/:id', TrafficController.show);

/*
 * POST
 */
router.post('/', TrafficController.create);

/*
 * PUT
 */
router.put('/:id', TrafficController.update);

/*
 * DELETE
 */
router.delete('/:id', TrafficController.remove);

module.exports = router;
