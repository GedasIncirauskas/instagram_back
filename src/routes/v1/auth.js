const express = require('express');
const { userRegistration, userLogin } = require('../../controllers/controller.auth');

const router = express.Router();

router.post('/register', userRegistration);
router.post('/login', userLogin);

module.exports = router;
