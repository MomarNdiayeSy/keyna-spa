const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middlewares/auth');

router.get('/', auth, historyController.getHistory);

module.exports = router;