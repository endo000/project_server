var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('users index');
});

router.post('/login', function(req, res, next) {
    if (req.body.username == 'admin' && req.body.password == 'admin')
        res.status(200).send('Success login');
    else
        res.status(401).send('Wrong username or password');
})

router.post('/register', function(req, res, next) {
    if (req.body.username == 'admin' && req.body.password == 'admin')
        res.status(200).send('Success register');
    else
        res.status(401).send('User already exists');
})

module.exports = router;