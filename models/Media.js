const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true, // URL of the uploaded file (e.g., from a cloud storage service)
  },
  type: {
    type: String,
    enum: ["image", "video"], // Restrict to image or video
    required: true,
  },
  uploadedBy: {
    type: String,
    ref: "User", // Reference to the User who uploaded the media
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);