class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = {
      ...this.queryString,
    };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    // We add a '$' before each conditional expression (gte, gt, lte, lt) in order to use them as a filter in mongoose's find method
    // Example of a url with filter params: 127.0.0.1:3000/api/v1/tours?duration[gte]=5&difficulty=easy&price[lt]=1500
    // queryStr = { duration: { $gte: 5 }, difficulty: 'easy', price: { $lt: 1500 }}
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // Can also be done like this
    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');
    return this;
  }

  sort() {
    /*
      We can provide multiple params to sort the results: price, ratingsAgerage
      Example of a url with sort params: 127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage
      The '-' in '-price' means sort descending
      From mongoose docs:
      // sort by "field" ascending and "test" descending
      query.sort({ field: 'asc', test: -1 });

      // equivalent
      query.sort('field -test');
    */

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // we can sort the data using the mongoose Model's sort method and sending to it the sort criteria in the query param
    } else {
      //query = query.sort('-createdAt'); // By default, we will sort by creation date descending (most recent first)
      this.query = this.query.sort('name'); // Not filtering by creation date because creation date of all the documents is the same, so query returns the same 2/3 docuemnts. Instead, we will sort by name ascending
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      // exclude default document version field from the result
      this.query = this.query.select('-__v'); // Here we select all fields except '__v' which is used internally by mongoose. More on this: https://stackoverflow.com/questions/12495891/what-is-the-v-field-in-mongoose
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
