const express = require('express');
const router = express.Router();
const testController = require('../controller/testController');
const test = require('../model/test');

router.post('/login', testController.login);
router.post('/logout', testController.logout);
router.post('/signup', testController.signup);
router.post('/classcreate', testController.classcreate);
router.post('/test', testController.test);
router.post('/classinfo', testController.classinfo);
router.post('/classlist',testController.classlist);
router.post('/classjoin', testController.classjoin);
router.post('/classdelete',testController.classdelete);
router.post('/usermanagement', testController.usermanagement);
router.post('/classrecognize',testController.classrecognize);
router.post('/examcreate',testController.examcreate);
router.post('/examinfo', testController.examinfo);
router.post('/examdelete',testController.examdelete);
router.post('/examcomplete',testController.examcomplete);
router.post('/questioninfo',testController.questioninfo);
router.post('/questionalter',testController.questionalter);
router.post('/questiondelete',testController.questiondelete);
router.post('/eyetracking',testController.eyetracking)
module.exports= router;

