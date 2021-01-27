const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // this middleware is used to log all the requestests before processing them
app.use(express.json()); // this middleware is used to parse json data sent in the request body
// app.use(express.static(`${__dirname}/public`)); // We can serve static files from the server with express.static

// 2) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;