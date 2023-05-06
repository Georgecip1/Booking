const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const bookings = require("../controllers/bookings");
const { isLoggedIn} = require("../middleware");

router.post("/", catchAsync(bookings.createBooking));
router.delete('/:bookingID', catchAsync(bookings.deleteBooking));

module.exports = router;