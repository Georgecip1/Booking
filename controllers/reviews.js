const Cazare = require("../models/cazare");
const Review = require("../models/review");

module.exports.editReview = async (req, res) => {
  const cazare = await Cazare.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  cazare.reviews.push(review);
  await review.save();
  await cazare.save();
  req.flash("success", "Review creat cu succes!");
  res.redirect(`/cazari/${cazare._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewID } = req.params;
  await Cazare.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
  await Review.findByIdAndDelete(reviewID);
  req.flash("success", "Review șters cu succes!");
  res.redirect(`/cazari/${id}`);
};
