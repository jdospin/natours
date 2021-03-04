const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router(); // Creation of a new router. It's like having a complete new app inside the current app
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);
userRouter.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
userRouter.patch('/updateMe', authController.protect, userController.updateMe);
userRouter.delete('/deleteMe', authController.protect, userController.deleteMe);

userRouter.route('/').get(userController.getAllUsers);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
