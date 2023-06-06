const Cazare = require("../models/cazare");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
  const cazari = await Cazare.find({});
  res.render("cazari/index", { cazari, mapBoxToken });
};

module.exports.renderNewForm = (req, res) => {
  res.render("cazari/new");
};

module.exports.createNewCazare = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.cazare.location,
      limit: 1,
    })
    .send();
  const newCazare = new Cazare(req.body.cazare);
  newCazare.geometry = geoData.body.features[0].geometry;
  newCazare.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  newCazare.author = req.user._id;
  await newCazare.save();

  req.flash("success", "Ai creat o nouă cazare cu succes!");
  res.redirect(`/cazari/${newCazare._id}`);
};

module.exports.showCazare = async (req, res, next) => {
  try {
    const cazare = await Cazare.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate({ path: "bookings", populate: { path: "author" } })
      .populate("author");
    res.render("cazari/show", { cazare, mapBoxToken });
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const cazare = await Cazare.findById(id);
  if (!cazare) {
    req.flash("error", "Acea cazare nu exista!");
    return res.redirect("/cazari");
  }
  res.render("cazari/edit", { cazare });
};

module.exports.editCazare = async (req, res) => {
  const { id } = req.params;
  const updatedCazare = await Cazare.findByIdAndUpdate(id, {
    ...req.body.cazare,
  });
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  updatedCazare.images.push(...images);
  await updatedCazare.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedCazare.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Ați modificat cazarea cu succes!");
  res.redirect(`/cazari/${updatedCazare._id}`);
};

module.exports.deleteCazare = async (req, res) => {
  const { id } = req.params;
  await Cazare.findByIdAndDelete(id);
  req.flash("success", "Ați șters cazarea cu succes!");
  res.redirect("/cazari");
};
