// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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

exports.getAllTours = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      // OK
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      // OK
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // can create a new document like this
    // const newTour = new Tour({}); // have to provide an object with the model's attributes to create the document
    // newTour.save();

    const newTour = await Tour.create(req.body); // the attributes to create a new tour are found in the request body
    res.status(201).json({
      // created
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      // no content
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([{
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
            $sum: 1,
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
