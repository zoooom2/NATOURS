const { model, Schema } = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new Schema(
  {
    review: {
      type: String,
      required: [true, 'Fill in your review'],
      minLength: [10, 'we need at least a 10 word review'],
      maxLength: [200, 'please summarize your review to less than 200 words'],
    },
    rating: {
      type: Number,
      required: [true, 'Fill in your rating'],
      min: [1, ' a rating must be more than 1'],
      max: [5, ' a rating must be more than 1'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: Schema.ObjectId,
      ref: 'user',
      required: [true, 'review must belong to a user'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index(
  { tour: 1, user: 1 },
  {
    unique: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.find({}).select('-__v');
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo',
  //   });
  this.find({}).select('-__v').populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  // console.log(stats);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne().clone();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const review = model('review', reviewSchema);
module.exports = review;
