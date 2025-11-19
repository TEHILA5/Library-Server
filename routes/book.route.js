import express from "express";
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateBook } from "../models/book.model.js";
import { uploadPicture } from "../middlewares/uploadIMG.Middleware.js";
import { uploadBookImage } from "../controllers/book.controller.js";
import {  getAllBooks, getBookById, addBook, borrowBook, returnBook} from "../controllers/book.controller.js";
const router = express.Router();

router.get("/", getAllBooks);
 
router.get("/:id", getBookById);
 
router.post("/", joiValidator(validateBook.addBook), addBook);

router.patch("/:id/borrow", joiValidator(validateBook.borrowBook), borrowBook);

router.patch("/:id/return", joiValidator(validateBook.returnBook), returnBook);

router.post("/:id/picture", uploadPicture.single("picture"), uploadBookImage);

export default router;
