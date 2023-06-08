const mongoose = require("mongoose");
const Cazare = require("../models/cazare");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose.connect("mongodb://127.0.0.1:27017/GeoBook");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const data = [
  {
    author: "647c7bcaf0955f2b537724b2",
    name: "Pensiunea Rostra",
    price: 150,
    location: "Bacău, str. Vadul Bistribei, nr. 16",
    image: "https://www.turistinfo.ro/images/liste/824067.jpg",
  },
  {
    author: "647c7bcaf0955f2b537724b2",
    name: "Pensiunea Studio",
    price: 160,
    location: "Bacău, str. Oituz, nr. 17",
    image: "https://www.turistinfo.ro/static/img/loading.gif",
  },
  {
    author: "647c7bcaf0955f2b537724b2",
    name: "Casa Vlad & Elisa",
    price: 200,
    location: "Bacău, str. Cireșoaia, nr. 22",
    image: "https://www.turistinfo.ro/static/img/loading.gif",
  },
];

const seedDB = async () => {
  await Cazare.deleteMany({});
  
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random(10) * 40);
    const camp = new Cazare({
      //your user id
      author: "647c7bcaf0955f2b537724b2",
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
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1686065548/GeoBook/c2fjyq08avldfq728wju_k0nx5s.jpg",
          filename: "GeoBook/c2fjyq08avldfq728wju_k0nx5s",
        },
        {
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1686065544/GeoBook/bvtgs8s0bgsdazdfpas3_c13qze.jpg",
          filename: "GeoBook/bvtgs8s0bgsdazdfpas3_c13qze",
        },
        {
          url: "https://res.cloudinary.com/dj4kytz0z/image/upload/v1686065542/GeoBook/otfsmgi7dlkwtcfsn9hw_hnieyl.jpg",
          filename: "GeoBook/otfsmgi7dlkwtcfsn9hw_hnieyl",
        },
      ],
    });

    await camp.save();
  }
  for (const item of data) {
    const cazare = new Cazare({
      author: item.author,
      location: item.location,
      title: item.name,
      description: "",
      price: item.price,
      geometry: {
        type: "Point",
        coordinates: [item.location.longitude, item.location.latitude],
      },
      images: [{url: item.image,
        filename: "",}],
    });

    await cazare.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
