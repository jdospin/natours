const express = require('express');
const { signup, login } = require('../controllers/authController');
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
} = require('../controllers/userController');

const userRouter = express.Router(); // Creation of a new router. It's like having a complete new app inside the current app
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.route('/').get(getAllUsers).post(createUser);
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = userRouter;
