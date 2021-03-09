// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// We don't need this anymore because the data will come from the DB
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// This middleware was used to check the request body for 2 parameters before executing the method in the controller
// this functionality will be done by mongoose, so it will be useless now.
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     // no content
//     status: 'success',
//     data: null,
//   });
// });

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: {
          $gte: 4.5,
        },
      },
    },
    {
      $group: {
        // _id: '$difficulty', // to group by difficulty
        // _id: null, // if we don't want to group by anything
        // _id: '$ratingsAverage', // to group by ratings averages
        _id: {
          $toUpper: '$difficulty', // to group by difficulty, and show difficulty results in uppercase
        },
        numTours: {
          $sum: 1, // Equivalent to COUNT() in SQL
        },
        numRatings: {
          $sum: '$ratingsQuantity',
        },
        avgRating: {
          $avg: '$ratingsAverage',
        },
        avgPrice: {
          $avg: '$price',
        },
        minPrice: {
          $min: '$price',
        },
        maxPrice: {
          $max: '$price',
        },
      },
    },
    {
      $sort: {
        avgPrice: 1, // 1 is for ascending, -1 for descending
      },
    },
    // {
    //   $match: {
    //     _id: {
    //       $ne: 'EASY', // this is to filter out the tours that are easy. This takes the result from the previous match and group
    //     },
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = parseInt(req.params.year, 10);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // we use this to "unwind", a document into several documents based on the specified array field here
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`), // We match all the tours that have start dates between janary 1st and december 31st of the provided year
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: '$startDates', // We're grouping here the results by each month of the existing dates
        },
        numTourStarts: {
          $sum: 1, // How many tours start in the current month? Equivalent to COUNT() in SQL
        },
        tours: {
          $push: '$name', // Pushing to an array the name of each tour that responds to the filter criteria
        },
      },
    },
    {
      $addFields: {
        month: '$_id', // Add a new field to the results with the name "month"
      },
    },
    {
      $project: {
        _id: 0, // we are excluding this field from the results
      },
    },
    {
      $sort: {
        numTourStarts: -1, // we are sorting in descending order based on the number of tours starting on each month
      },
    },
    {
      $limit: 12, // to limit the number of results returned
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});
