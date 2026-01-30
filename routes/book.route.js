import express from "express";
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import { validateBook } from "../models/book.model.js";
import { uploadPicture } from "../middlewares/uploadIMG.Middleware.js";
import { uploadBookImage } from "../controllers/book.controller.js";
import {  getAllBooks, getBookById, addBook, borrowBook, returnBook, getBooksByCategory, updateBook } from "../controllers/book.controller.js";
import { auth,isOwner,isAdmin,isOwnerOrAdmin } from '../middlewares/auth.Middleware.js';  
const router = express.Router();

router.get("/", getAllBooks);
 
router.get("/:id", getBookById);
 
router.post("/", joiValidator(validateBook.addBook), addBook);

router.put("/:id", updateBook);

router.patch("/:id/borrow", auth, isOwnerOrAdmin, joiValidator(validateBook.borrowBook), borrowBook);

router.patch("/:id/return", joiValidator(validateBook.returnBook), returnBook);

router.post("/:id/picture", uploadPicture.single("picture"), uploadBookImage);

router.get("/category/:category", getBooksByCategory);

export default router;
