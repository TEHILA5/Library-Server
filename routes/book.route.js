import express from "express";
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateBook } from "../models/book.model.js";
import { 
  getAllBooks, getBookById, addBook, borrowBook, returnBook 
} from "../controllers/book.controller.js";
const router = express.Router();

router.get("/", getAllBooks);
 
router.get("/:id", getBookById);
 
router.post("/", joiValidator(validateBook.addBook), addBook);

router.patch("/:id/borrow", joiValidator(validateBook.borrowBook), borrowBook);

router.patch("/:id/return", joiValidator(validateBook.returnBook), returnBook);

export default router;
