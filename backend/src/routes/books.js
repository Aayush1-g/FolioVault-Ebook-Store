import express from "express";
import { 
  getBooks, 
  createBook, 
  getBookById, 
  updateBook, 
  deleteBook 
} from "../controllers/booksController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

export default router;