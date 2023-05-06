const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
const Booking = require("../models/booking");
const Faker = require("@Faker-js/faker");
const moment = require("moment");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  await Booking.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random(10) * 20);
    const camp = new Campground({
      //your user id
      author: "64565425b2270a3e24aa80ec",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis at deserunt ducimus repellat earum est non quasi labore, iure hic quisquam necessitatibus voluptatem, qui nulla dolorem veniam delectus nam consequuntur!",
      price: price,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1680641620/YelpCamp/ime2yufun9so3c7lgggf.jpg",
          filename: "YelpCamp/ime2yufun9so3c7lgggf",
        },
        {
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1680685450/YelpCamp/bvtgs8s0bgsdazdfpas3.jpg",
          filename: "YelpCamp/bvtgs8s0bgsdazdfpas3",
        },
        {
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1680640857/YelpCamp/otfsmgi7dlkwtcfsn9hw.jpg",
          filename: "YelpCamp/otfsmgi7dlkwtcfsn9hw",
        },
      ],
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
