const mongoose = require('mongoose');
// creating a schema
const userSchema = new mongoose.Schema({
    
    first_name : String,
    id_number : Number,
  });
 
  const User = mongoose.model("User", userSchema);
  module.exports = User;
