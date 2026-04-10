const mongoose = require('mongoose');

// Connect to your local MongoDB
mongoose.connect('mongodb://localhost:27017/foliovault');

const bookSchema = new mongoose.Schema({
  _id: String,
  title: String,
  author: String,
  genre: String,
  price: Number,
  cover: String,
  description: String
});

const Book = mongoose.model('Book', bookSchema);

const featuredBooks = [
  {
    _id: "69d34b1",
    title: "The Midnight Theorem", // From Project Report Image 1
    author: "Kumber of Mah",
    genre: "Mystery",
    price: 12.00,
    cover: "https://images.unsplash.com/photo-1543005814-14b523444a0b",
    description: "A deep dive into the mathematical mysteries of the night."
  },
  {
    _id: "69d34b2",
    title: "The Glass Republic", // From Project Report Image 1 & 5
    author: "Soren Veld",
    genre: "Sci-Fi",
    price: 13.49,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
    description: "Exploring the fragile nature of a future society."
  },
  {
    _id: "69d34b3",
    title: "Salt & Sorrows", // From Project Report Image 1 & 5
    author: "Erin A. Craig",
    genre: "Fantasy",
    price: 7.00,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    description: "A haunting tale of magic and family secrets."
  }
];

const seedDB = async () => {
  await Book.deleteMany({}); // Clears empty/test data
  await Book.insertMany(featuredBooks);
  console.log("✅ Featured Books Restored to Database!");
  process.exit();
};

seedDB();