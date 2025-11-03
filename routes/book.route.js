import express from "express";
import { 
  getAllBooks, getBookById, addBook, borrowBook, returnBook 
} from "../controllers/book.controller.js";
const router = express.Router();

router.get("/", getAllBooks);
 
router.get("/:id", getBookById);
 
router.post("/", addBook);
 
router.patch("/:id/borrow", borrowBook);

router.patch("/:id/return", returnBook);

export default router;
