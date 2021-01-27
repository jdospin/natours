const express = require('express');
const {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTour
} = require('../controllers/tourController');
const tourRouter = express.Router(); // Creation of a new route. It's like having an app inside another app...

tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;