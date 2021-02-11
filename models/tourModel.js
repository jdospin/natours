const mongoose = require('mongoose');
const slugify = require('slugify').default;
// const validator = require('validator').default; // external validation library

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour name must have less than or equal to 40 characters',
      ],
      minlength: [
        10,
        'A tour name must have more than or equal to 10 characters',
      ],
      //validate: [validator.isAlpha, 'Tour name must only contain characters'], // validator.isAlpha doesn't accept spaces...
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, ' A tour must have a duration'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'Rating must be greater than or equal to 1.0'],
      max: [5.0, 'Rating must be smaller than or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, ' A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      /* This is a custom validator which allows to do
        specific validations which are not doable with built-in validators
      */
      validate: {
        validator: function (value) {
          // this only points to current doc on NEW document creation
          return value < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can only be: easy, medium or difficult',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // the 'this' object is the document that will be saved
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

// tourSchema.post('save', function (doc, next) {  // This is a middleware that gets executed after the 'save' method and has access to the saved document
//   next();
// });

// QUERY MIDDLEWARE
// We want to apply this middleware to all methods that start with 'find', such as find(), findOne(), findOneAndUpdate(), etc
tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: {
      $ne: true,
    },
  });
  // this.start = Date.now(); we can add fields to the query object to access them in the post method
  next();
});

// This method has access to all the documents that have been modified
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`This query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// Here, we have access to the aggregation object through the 'this' keyword
tourSchema.pre('aggregate', function (next) {
  // Here, we add a match statement to the pipeline array in order to exclude the secret tours
  this.pipeline().unshift({
    $match: {
      secretTour: {
        $ne: true,
      },
    },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
