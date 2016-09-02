// get an instace of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Usuario', new Schema({
  nome: String,
  email: String,
  password: String,
  admin: Boolean
}));
