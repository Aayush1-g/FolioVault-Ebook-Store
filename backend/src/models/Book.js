import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  // The frontend uses 'book.id' for navigation, 
  // but MongoDB uses '_id'. We can handle this in the controller or use a virtual.
  title: { type: String, required: true },
  author: { type: String, required: true },
  
  // MATCHING FRONTEND: src={book.cover}
  cover: { type: String, required: true },
  
  // MATCHING FRONTEND: {book.genre}
  genre: { type: String, required: true },
  
  // MATCHING FRONTEND: {formatPrice(book.price)}
  price: { type: Number, required: true },
  
  // MATCHING FRONTEND: <Stars rating={book.rating} />
  rating: { type: Number, default: 5 },
  
  // MATCHING FRONTEND: {book.reviews.toLocaleString()}
  reviews: { type: Number, default: 0 },
  
  // MATCHING FRONTEND: {book.badge}
  badge: { type: String, default: "" },

  // For BookDetailPage.jsx (not in Card, but usually needed)
  description: { type: String, default: "" },
  stock: { type: Number, default: 10 }
}, { 
  timestamps: true,
  // This helps if the frontend strictly looks for 'id' instead of '_id'
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create a virtual 'id' that points to '_id'
bookSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

export default mongoose.model("Book", bookSchema);