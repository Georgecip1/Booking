const Campground = require("../models/campground");
const Booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const booking = new Booking(req.body.booking);
  booking.author = req.user._id;
  campground.bookings.push(booking);
  await booking.save();
  await campground.save();
  req.flash("success", "Created booking");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteBooking = async (req, res) => {
  const { id, bookingID } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { bookings: bookingID } });
  await Booking.findByIdAndDelete(bookingID);
  req.flash("success", "Deleted your Booking");
  res.redirect(`campgrounds/${id}`);
};
