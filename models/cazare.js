const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageShema = new Schema({
  url: String,
  filename: String,
});

ImageShema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const cazareSchema = new Schema(
  {
    title: String,
    images: [ImageShema],
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        require: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  opts
);

cazareSchema.virtual("properties.popUpMarkup").get(function () {
  return `<strong><a href="/cazari/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}</p>`;
});

cazareSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Cazare", cazareSchema);
