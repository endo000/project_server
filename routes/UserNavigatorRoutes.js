var express = require('express');
var router = express.Router();
var UserNavigatorController = require('../controllers/UserNavigatorController.js');

/*
 * GET
 */
router.get('/', UserNavigatorController.list);

/*
 * GET
 */
router.get('/:id', UserNavigatorController.show);

/*
 * POST
 */
router.post('/', UserNavigatorController.create);

/*
 * PUT
 */
router.put('/finish', UserNavigatorController.finish);
router.put('/:id', UserNavigatorController.update);

/*
 * DELETE
 */
router.delete('/:id', UserNavigatorController.remove);

module.exports = router;
