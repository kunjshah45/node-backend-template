var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const AuthController = require('@controllers/user/auth');

/* SignIn Users */
router.post('/signin', [
    check('email', 'Email is required').not().isEmpty().escape(),
    check('password', 'Password is requried').not().isEmpty()
], (req, res) => {
    var errors = validationResult(req).array();
    if (errors != '') {
        res.json({
            status: false,
            message: errors[0].msg
        })
    } else {
        AuthController.signin(req, res);
    }
});
/* SignIn Users */

module.exports = router;