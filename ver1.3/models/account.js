var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Message = new Schema({
  text : String,
  timestamp : String,
  timeHtml : String,
  byUser : String,
  byUserId : String,
  byUserColor : String,
  byUserColorLight : String
});

var Account = new Schema({
  username: String,
  password: String,
  color: String,
  colorLight: String
});

Account.plugin(passportLocalMongoose);
module.exports = mongoose.model('Message', Message);
module.exports = mongoose.model('Account', Account);
