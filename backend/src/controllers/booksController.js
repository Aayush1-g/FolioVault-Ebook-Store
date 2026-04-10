import Book from "../models/Book.js";

// GET all books
export const getBooks = async (req, res) => {
  const books = await Book.find({});
  res.json(books);
};

// GET single book
export const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
};

// CREATE book
export const createBook = async (req, res) => {
  const newBook = await Book.create(req.body);
  res.status(201).json(newBook);
};

// UPDATE book
export const updateBook = async (req, res) => {
  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedBook);
};

// DELETE book
export const deleteBook = async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book removed from Vault" });
};