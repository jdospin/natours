const mongoose = require('mongoose');
const slugify = require('slugify').default;
// const User = require('./userModel');
// const validator = require('validator').default; // external validation library

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must be at most 40 characters long'],
      minlength: [10, 'A tour name must be at least 10 characters long'],
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
      min: [1.0, 'Rating must be between 1.0 and 5.0'],
      max: [5.0, 'Rating must be between 1.0 and 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.66666, 46.66666, 4.7
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
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
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

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// virtual populate in order to be able to access the reviews linked to the tour
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // this is the name of the field that references the tour model (this one) in the reviews model
  localField: '_id', // this is the name of the field in this model (tourModel) that is being referenced from the reviewsModel
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  // the 'this' object is the document that will be saved
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

// This middleware is used for embedding guides (users) in tours documents
// tourSchema.pre('save', async function (next) {
//   // when saving a new tour that has guides, only the userID of each guide is provided.
//   // We have to get each user's document and save it back in the guides field
//   // of the current tour being saved
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    // we can specify the document we want to populate from
    // We can also specify which fields we want and don't want
    // in this case, we don't want "__v" or "passwordChangedAt"
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// This method has access to all the documents that have been modified
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`This query took ${Date.now() - this.start} milliseconds`);
//   next();
// });

// AGGREGATION MIDDLEWARE
// Here, we have access to the aggregation object through the 'this' keyword
// tourSchema.pre('aggregate', function (next) {
//   // Here, we add a match statement to the pipeline array in order to exclude the secret tours
//   this.pipeline().unshift({
//     $match: {
//       secretTour: {
//         $ne: true,
//       },
//     },
//   });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
