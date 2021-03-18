const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const userRouter = express.Router(); // Creation of a new router. It's like having a complete new app inside the current app
userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// We want to protect all the routes from this point forward
userRouter.use(authController.protect);

userRouter.patch('/updateMyPassword', authController.updatePassword);
userRouter.get('/me', userController.getMe, userController.getUser);
userRouter.patch('/updateMe', userController.updateMe);
userRouter.delete('/deleteMe', userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
