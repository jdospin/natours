// const fs = require('fs');
const Tour = require('../models/tourModel');

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
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = {
      ...req.query,
    };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    // Can also be done like this
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // We add a '$' before each conditional expression (gte, gt, lte, lt) in order to use them as a filter in mongoose's find method
    // Example of a url with filter params: 127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
    // queryStr = { duration: { $gte: 5 }, difficulty: 'easy', price: { $lt: 1500 }}
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // 2) SORTING

    // We can provide multiple params to sort the results: price, ratingsAgerage
    // Example of a url with sort params: 127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
    // The '-' in '-price' means sort descending
    /* From mongoose docs:
      // sort by "field" ascending and "test" descending
      query.sort({ field: 'asc', test: -1 });

      // equivalent
      query.sort('field -test');
    */
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy); // we can sort the data using the mongoose Model's sort method and sending to it the sort criteria in the query param
    } else {
      //query = query.sort('-createdAt'); // By default, we will sort by creation date descending (most recent first)
      query = query.sort('name'); // Not filtering by creation date because creation date of all the documents is the same, so query returns the same 2/3 docuemnts. Instead, we will sort by name ascending
    }

    // 3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      // exclude default document version field from the result
      query = query.select('-__v'); // Here we select all fields except '__v' which is used internally by mongoose. More on this: https://stackoverflow.com/questions/12495891/what-is-the-v-field-in-mongoose
    }

    // 4) PAGINATION
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

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
