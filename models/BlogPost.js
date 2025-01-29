const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  authorName: { type: String, ref:"User", required: true },
  title: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  content: { type: String, required: true },
  media: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media", // Reference to the Media model
    },
  ]
});

// Automatically update `dateUpdated` when the document is modified
blogPostSchema.pre("save", function (next) {
  if (this.isModified()) {
    this.dateUpdated = Date.now();
  }
  next();
});

module.exports = mongoose.model("BlogPost", blogPostSchema);