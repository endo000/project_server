var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

/*
 * GET
 */
router.get('/', UserController.auth, UserController.list);

router.get('/auth', UserController.auth, function(req, res) { return res.status(200).send('OK'); });

/*
 * GET
 */
router.get('/:id', UserController.show);

router.post('/login', UserController.login);

/*
 * POST
 */
router.post('/', UserController.is_exists, UserController.create);

/*
 * PUT
 */
router.put('/:id', UserController.update);

/*
 * DELETE
 */
router.delete('/:id', UserController.remove);

module.exports = router;