const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    // OK
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.createUser = (req, res) => {
  // const newId = users[users.length - 1].id + 1;
  // const newUser = { id: newId, ...req.body };
  // users.push(newUser);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/users.json`,
  //   JSON.stringify(users),
  //   (err) => {
  //     res.status(201).json({
  //       // created
  //       status: 'success',
  //       data: {
  //         user: newUser,
  //       },
  //     });
  //   }
  // );
};

exports.getUser = (req, res) => {
  // const id = parseInt(req.params.id, 10);
  // if (id > users.length) {
  //   return res.status(404).json({
  //     // Not found
  //     status: 'fail',
  //     message: 'Invalid user ID',
  //   });
  // }
  // const user = users.find((el) => el.id === id);
  // res.status(200).json({
  //   // OK
  //   status: 'success',
  //   data: {
  //     user,
  //   },
  // });
};

exports.updateUser = (req, res) => {
  // const id = parseInt(req.params.id, 10);
  // if (id > users.length) {
  //   return res.status(404).json({
  //     // Not found
  //     status: 'fail',
  //     message: 'Invalid user ID',
  //   });
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     user: '<Updated user here...>',
  //   },
  // });
};

exports.deleteUser = (req, res) => {
  // const id = parseInt(req.params.id, 10);
  // if (id > users.length) {
  //   return res.status(404).json({
  //     status: 'fail',
  //     message: 'Invalid user ID',
  //   });
  // }
  // res.status(204).json({
  //   // no content
  //   status: 'success',
  //   data: null,
  // });
};
