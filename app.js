const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev')); // this middleware is used to log all the requestests before processing them
app.use(express.json()); // this middleware is used to parse json data sent in the request body
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 2) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App runing on port ${port} ...`);
});