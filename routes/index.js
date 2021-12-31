const express = require('express')
const router = express.Router()

const auth = require('@routes/api/user/auth');

router.use('/auth', auth);

module.exports = router