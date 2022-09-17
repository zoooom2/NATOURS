const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// MIDDLEWARE
//securing http data
app.use(helmet());

//development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//limit request from the same api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this request. Try again later',
});
app.use('/api', limiter);

//body parser. reading data from req.body
app.use(express.json({ limit: '10kb' }));

//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against NoSQL query xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

//serving  static file
app.use(express.static(`${__dirname}/public`));

//testing midleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTE HANDLERS

// USER HANDLER

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
// START SERVER

app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find route for ${req.originalUrl}`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
