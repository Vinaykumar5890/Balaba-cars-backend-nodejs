const mongoose = require('mongoose')

let Vehicleowner = new mongoose.Schema({
  carname: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  priceforseat: {
    type: Number,
    required: true,
  },
  fromaddress: {
    type: String,
    required: true,
    unique: true,
  },
  toaddress: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Vehicleowner', Vehicleowner)
