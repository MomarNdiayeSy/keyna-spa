const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', auth, roleCheck('admin'), userController.getAllUsers);
router.post('/', auth, roleCheck('admin'), userController.createUser);
router.put('/:id', auth, roleCheck('admin'), userController.updateUser);
router.delete('/:id', auth, roleCheck('admin'), userController.deleteUser);

module.exports = router;