const express = require('express');
const userController = require('./user.controller');
const auth = require('../../middlewares/auth');
const admin = require('../../middlewares/admin');

const router = express.Router();

router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/user/me', auth, userController.getMe);
router.get('/admin/users', auth, admin, userController.getAllUsers);
router.put('/admin/users/:id/role', auth, admin, userController.updateUserRole);
router.delete('/admin/users/:id', auth, admin, userController.deleteUser);

module.exports = router;
