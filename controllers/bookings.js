const Cazare = require("../models/cazare");
const Booking = require("../models/booking");

module.exports.createBooking = async (req, res) => {
  const cazare = await Cazare.findById(req.params.id);
  const checkIn = new Date(req.body.booking.checkIn);
  const checkOut = new Date(req.body.booking.checkOut);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  if (checkIn < today) {
    req.flash("error", "Nu poți face o rezervare înainte de ziua de astăzi!");
    return res.redirect(`/cazari/${cazare._id}`);
  }
  if (checkOut <= checkIn) {
    req.flash(
      "error",
      "Data de check-out trebuie să fie după cea de check-in!"
    );
    return res.redirect(`/cazari/${cazare._id}`);
  }
  const booking = new Booking(req.body.booking);
  booking.author = req.user._id;
  cazare.bookings.push(booking);
  await booking.save();
  await cazare.save();
  req.flash("success", "Rezervare creată cu succes!");
  res.redirect(`/cazari/${cazare._id}`);
};

module.exports.deleteBooking = async (req, res) => {
  const { id, bookingID } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { bookings: bookingID } });
  await Booking.findByIdAndDelete(bookingID);
  req.flash("success", "Rezervare ștearsă cu succes!");
  res.redirect(`/cazari/${id}`);
};
