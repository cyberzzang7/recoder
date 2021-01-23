const express = require('express');
const router = express.Router();
const testController = require('../controller/testController');

router.post('/login', testController.login);
router.post('/logout', testController.logout);
router.post('/signup', testController.signup);
router.post('/classcreate', testController.classcreate);
router.post('/test', testController.test);
router.post('/classinfo',testController.classinfo);
router.post('/classjoin', testController.classjoin);
module.exports= router;

