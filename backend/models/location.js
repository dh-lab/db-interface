const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  name: String,
  address: String,
               constructionDate: Date,
  demolitionDate: Date,
                 buildingType: String,
  'description': String
});

module.exports = mongoose.model('locations', locationSchema);
