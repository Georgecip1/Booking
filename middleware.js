const ExpressError = require("./utils/ExpressError");
const {
  cazareSchema,
  reviewSchema,
  bookingSchema,
} = require("./schemas.js");
const Cazare = require("./models/cazare");
const Review = require("./models/review");
const Booking = require("./models/booking");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Trebuie sa te loghezi mai intâi!");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCazare = (req, res, next) => {
  const { error } = cazareSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const cazare = await Cazare.findById(id);
  if (!cazare.author.equals(req.user._id)) {
    req.flash("error", "Nu ai permisiune");
    return res.redirect(`/cazari/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewID } = req.params;
  const review = await Review.findById(reviewID);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "Nu ai permisiune");
    return res.redirect(`/cazari/${id}`);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isBookingAuthor = async (req, res, next) => {
  const { id, bookingID } = req.params;
  const booking = await Booking.findById(bookingID);
  if (!booking.author.equals(req.user._id)) {
    req.flash("error", "Nu ai permisiune");
    return res.redirect(`/cazari/${id}`);
  }
  next();
};
module.exports.validateBooking = (req, res, next) => {
  const { error } = bookingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
