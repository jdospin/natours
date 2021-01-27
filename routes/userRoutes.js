const express = require('express');
const {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser
} = require('../controllers/userController');
const userRouter = express.Router(); // Creation of a new router. It's like having a complete new app inside the current app

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);
userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;