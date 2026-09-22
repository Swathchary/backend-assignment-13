// Import required dependencies
const express = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// -------------------------------------------------------------
// 1. Connect to MongoDB using mongoose.connect()
// -------------------------------------------------------------
const MONGO_URI = 'mongodb://127.0.0.1:27017/postAssignmentDB';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// -------------------------------------------------------------
// 2. Create Mongoose Schema & Model
// -------------------------------------------------------------
// Schema with title and content as string datatype
const schema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create model from schema
const Post = mongoose.model('Post', schema);

// -------------------------------------------------------------
// 3. API Routes
// -------------------------------------------------------------

// i) GET route '/getPosts' - Displays all available posts using find()
app.get('/getPosts', async (req, res) => {
  try {
    // Retrieve all documents from MongoDB
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

// ii) POST route '/addPosts' - Adds a post into MongoDB using save()
app.post('/addPosts', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Instantiate new Post document
    const newPost = new Post({
      title,
      content,
    });

    // Save document to MongoDB
    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully', data: savedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error adding post', error: error.message });
  }
});

// iii) DELETE route '/delPosts' - Deletes a post using findByIdAndDelete()

app.delete('/delPosts', async (req, res) => {
  try {
    const { id } = req.body; 

    if (!id) {
      return res.status(400).json({ message: 'Post ID is required to delete' });
    }

    // Delete post by ID
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

// iv) PATCH route '/post/:id' - Updates a particular post
app.patch('/post/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Update document with new fields
    const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
});

// Start express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});