const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const bookings = require("../controllers/bookings");
const {
  isLoggedIn,
  validateBooking,
  isReviewAuthor,
  isBookingAuthor
} = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateBooking,
  catchAsync(bookings.createBooking)
);
router.delete(
  "/:bookingID",
  isLoggedIn,
  isBookingAuthor,
  catchAsync(bookings.deleteBooking)
);

module.exports = router;
