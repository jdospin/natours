const express = require('express');
const {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTour,
} = require('../controllers/tourController');

const tourRouter = express.Router(); // Creation of a new route. It's like having an app inside another app...
// tourRouter.param('id', checkID); // this middleware was used to check the id param before calling the corresponding function in the controller

tourRouter.route('/').get(getAllTours).post(createTour);
tourRouter.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
