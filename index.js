const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const User = require("./models/user");
const BlogPost = require("./models/BlogPost");
const Media = require("./models/Media");

const app = express();
const port = 8000;

app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


dbUrl =
  "mongodb+srv://admin:admin123@cluster0.xnhgc.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(dbUrl, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

// Default route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// new user creation
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body); // Create a new user instance
    await user.save(); // Save the user to the database
    res.status(201).send(user); // Send the created user as a response
  } catch (error) {
    res.status(400).send(error.message); // Handle errors
  }
});

// 2. Create a Blog Post
app.post("/blogposts", async (req, res) => {
    try {
      const blogPost = new BlogPost(req.body);
      await blogPost.save();
      res.status(201).json(blogPost);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  app.post("/blogposts/:id/media", upload.single("file"), async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Create a new media document
    const media = new Media({
      url: `/uploads/${req.file.filename}`, // File URL
      type: req.file.mimetype.startsWith("image") ? "image" : "video", // Check file type
      uploadedBy: blogPost.authorId, // Associate with the blog post author
    });

    await media.save();

    // Add the media reference to the blog post
    blogPost.media.push(media._id);
    await blogPost.save();

    res.status(201).json(media);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// retrieve media
// Retrieve media by ID
app.get("/media/:id", async (req, res) => {
  try {
    const media = await Media.findById(req.params.id); // Find media by ID
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    // Set the appropriate content type
    res.contentType(media.type === "image" ? "image/jpeg" : "video/mp4");

    // Send the file data
    res.sendFile(path.join(__dirname, media.url)); // Serve the file from the uploads folder
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// retrieving media based on the post
// Retrieve all media for a blog post
app.get("/blogposts/:id/media", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id).populate("media"); // Populate media references
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    res.status(200).json(blogPost.media); // Return the media array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

