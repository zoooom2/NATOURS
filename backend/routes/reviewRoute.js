const express = require('express');
const {
  protect,
  restrictTo,
} = require('../controllers/authorisationController');

const {
  createReview,
  getAllReviews,
  deleteReview,
  updateReview,
  setTourUserId,
  getReview,
} = require('../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(protect, restrictTo('user'), getAllReviews)
  .post(restrictTo('user'), setTourUserId, createReview);

router
  .route('/:id')
  .get(getReview)
  .delete(restrictTo('user'), deleteReview)
  .patch(restrictTo('user'), updateReview);

module.exports = router;
