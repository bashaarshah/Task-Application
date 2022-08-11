const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    tasks: [],
  });

module.exports = {UserSchema}