const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const tourRouter = express.Router(); // Creation of a new route. It's like having an app inside another app...
// tourRouter.param('id', checkID); // this middleware was used to check the id param before calling the corresponding function in the controller

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); // calling the getAllTours after calling a new middleware to add the required params to the query string to get only the top 5 cheapest tours
tourRouter.route('/tour-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
tourRouter
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
tourRouter
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRouter;
