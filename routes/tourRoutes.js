const express = require('express');
const {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTour,
  checkID,
  checkBody,
} = require('../controllers/tourController');
const tourRouter = express.Router(); // Creation of a new route. It's like having an app inside another app...
tourRouter.param('id', checkID);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(checkBody, createTour);
tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = tourRouter;