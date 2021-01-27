const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.checkID = (req, res, next, val) => {
  const id = parseInt(val);
  if (id > tours.length) {
    return res.status(404).json({ // Not found
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({ // OK
    status: 'success',
    results: tours.length,
    data: {
      tours
    }
  });
};

exports.getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find(el => el.id === id);
  res.status(200).json({ // OK
    status: 'success',
    data: {
      tour
    }
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({
    id: newId
  }, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({ // created
      status: 'success',
      data: {
        tour: newTour
      }
    })
  });
};

exports.updateTour = (req, res) => {
  // const id = parseInt(val); // will need it in the future
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
};

exports.deleteTour = (req, res) => {
  // const id = parseInt(val); // will need it in the future
  res.status(204).json({ // no content
    status: 'success',
    data: null
  });
};