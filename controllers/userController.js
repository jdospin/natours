const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // filter out field names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: null,
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
