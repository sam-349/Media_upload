const mongoose = require("mongoose");

// Define the User Schema

const userSchema = new mongoose.Schema({
  // userid: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   trim: true,
  // },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["farmer", "normal user"],
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Converts email to lowercase
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'], // Regex for email validation
      },
      password: {
        type: String,
        required: true,
        minlength: 6, // Minimum password length
      },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
});
const User = mongoose.model("User", userSchema);

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true, // Removes extra spaces
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true, // Converts email to lowercase
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'], // Regex for email validation
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: 6, // Minimum password length
//   },
//   age: {
//     type: Number,
//     min: 18, // Minimum age
//     max: 100, // Maximum age
//   },
//   userType: {
//     type: Boolean,
//     default: false, // Default value
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now, // Automatically set to the current date
//   },
// });

// Create the User model
// const User = mongoose.model('User', userSchema);

module.exports = User;
