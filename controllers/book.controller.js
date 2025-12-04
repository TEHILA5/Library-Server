import { isValidObjectId } from "mongoose";
import {Book} from "../models/book.model.js";

const books = [
  {
    id: 1,
    name: "Duplicatim",
    category: "Fantasy",
    price: 80,
    isBorrowed: false,
    borrows: [] 
  },
  {
    id: 2,
    name: "Hitnakshut",
    category: "Voltage",
    price: 120,
    isBorrowed: true,
    borrows: [{ date: "2025-10-20", userId: 101 },]
  },
  {
    id:3,
    name:"Gam Ki Elech",
    category:"Emotion",
    price:100,
    isBorrowed:false,
    borrows:[
        {date:"2025-09-30",userId:100},
        {date:"2025-10-25",userId:102},
    ]
  },
];

export const getAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 5, name = '' } = req.query;

    const query = name ? { name: new RegExp(name, 'i') } : {};

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Book.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      results: books
    });
  } catch (error) {
    next({ message: error.message });
  }
};

export const getBookById = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next({ status: 404, message: `Book ${id} not found!` });
  }
  try {
    const book = await Book.findById(id);
    if (!book) return next({ status: 404, message: `Book ${id} not found!` });
    res.json(book);
  } catch (error) {
    next({ message: error.message });
  }
};
 
export const addBook = async (req, res, next) => {
  try {
    const newBook = new Book({
      ...req.body,
      isBorrowed: false,
      borrows: [],
      imageUrl: req.file?.path
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    next({ message: error.message });
  }
};

export const updateBook = async (req, res, next) => {
  const { id } = req.params;  
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: req.body },  
      { new: true, runValidators: true }  
    );
    if (!updatedBook) {
      return next({ status: 404, message: `Book ${id} not found!` });
    }
    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (error) {
    next({ message: error.message });
  }
};

 
export const borrowBook = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!isValidObjectId(id)) return next({ status: 404, message: `Book ${id} not found!` });
  if (!isValidObjectId(userId)) return next({ status: 404, message: `User ${userId} not found!` });
  try {
    const book = await Book.findById(id);
    if (!book) return next({ status: 404, message: `Book ${id} not found!` });
    if (book.isBorrowed) return next({ status: 400, message: `Book ${id} already borrowed!` });
    const user = await User.findById(userId);
    if (!user) return next({ status: 404, message: `User ${userId} not found!` });
    book.isBorrowed = true;
    book.borrows.push({ date: new Date().toISOString(), userId });
    user.borrowedBooks.push(book._id);
    await book.save();
    await user.save();
    res.json({ message: "Book borrowed successfully", book, user });
  } catch (error) {
    next({ message: error.message });
  }
};
 
export const returnBook = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.body; 
  if (!isValidObjectId(id)) return next({ status: 404, message: `Book ${id} not found!` });
  if (!isValidObjectId(userId)) return next({ status: 404, message: `User ${userId} not found!` });
  try {
    const book = await Book.findById(id);
    if (!book) return next({ status: 404, message: `Book ${id} not found!` });
    if (!book.isBorrowed) return next({ status: 400, message: `Book ${id} is not borrowed!` }); 
    const user = await User.findById(userId);
    if (!user) return next({ status: 404, message: `User ${userId} not found!` }); 
    book.isBorrowed = false;
    user.borrowedBooks = user.borrowedBooks.filter(bId => bId.toString() !== book._id.toString()); 
    await user.save(); 
    res.json({ message: "Book returned successfully", book, user });
  } catch (error) {
    next({ message: error.message });
  }
};

export const uploadBookImage = async (req, res, next) => {
  const { id } = req.params;
  if (!req.file) return next({ status: 400, message: "No image uploaded" }); 
  try {
    const book = await Book.findById(id);
    if (!book) return next({ status: 404, message: "Book not found" }); 
    book.imageUrl = `/pictures/${req.file.filename}`;
    await book.save(); 
    res.json({ message: "Image uploaded successfully", imageUrl: book.imageUrl });
  } catch (error) {
    next({ message: error.message });
  }
};

export const getBooksByCategory = async (req, res, next) => {
  const { category } = req.params; 
  if (!category) {
    return next({ status: 400, message: "Category parameter is required" });
  }
  try { 
    const books = await Book.find({ category: new RegExp(`^${category}$`, 'i') });
    if (books.length === 0) {
      return res.status(200).json({ message: `No books found in category ${category}`, results: [] });
    }
    res.json({
      total: books.length,
      category,
      results: books
    });
  } catch (error) {
    next({ message: error.message });
  }
};
