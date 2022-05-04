var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController.js');

const multer = require('multer')
const upload = multer({ dest: 'public/images' })

/*
 * GET
 */
router.get('/', UserController.auth, UserController.list);

router.get('/auth', UserController.auth, function (req, res) { return res.status(200).json({ message: 'OK' }); });

/*
 * GET
 */
router.get('/:id', UserController.show);
/*
 * POST
 */
router.post('/', UserController.is_exists, UserController.create);

router.post('/register', UserController.is_exists, UserController.create);
router.post('/login', upload.single('image'), UserController.login);

/*
 * PUT
 */
router.put('/:id', UserController.update);

/*
 * DELETE
 */
router.delete('/:id', UserController.remove);

module.exports = router;