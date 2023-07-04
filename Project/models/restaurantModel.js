const mongoose = require('mongoose');

const restaurant = new mongoose.Schema({
  name: { type: String },
  address: {
    building: { type: String },
    coord: { type: Array },
    street: { type: String },
    zipcode: { type: String },
  },
  borough: { type: String },
  cuisine: { type: String },
  grades: [
    {
      date: { type: Date },
      grade: { type: String },
      score: { type: Number },
    },
  ],
  restaurant_id: { type: String },
});

const model = mongoose.model('restaurant', restaurant);

module.exports = model;
