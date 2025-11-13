import { books } from "../db_books.js";
import { users } from "../db_users.js";

export const getAllBooks = (req, res) => {
  let results = books;
  const { name, limit = 5, page = 1 } = req.query;

  if (name) {
    const search = name.toLowerCase();
    results = results.filter(b => b.name.toLowerCase().includes(search));
  }

  const start = (page - 1) * limit;
  const end = start + Number(limit);
  const paginated = results.slice(start, end);

  res.status(200).json({
    total: results.length,
    page: Number(page),
    limit: Number(limit),
    results: paginated
  });
};
 
export const getBookById = (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) next({ status: 404, message: `Book ${req.params.id} not found!` });
  res.status(200).json(book);
};
 
export const addBook = (req, res) => {
  const newBook = { ...req.body, id: Date.now(), isBorrowed: false, borrows: [] };
  books.push(newBook);
  res.status(201).json(newBook);
};
 
export const borrowBook = (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) next({ status: 404, message: `Book ${req.params.id} not found!` });
  if (book.isBorrowed) next({ status: 400, message: `Book ${req.params.id} already borrowed!` });

  const { userId } = req.body;
  const user = users.find(u => u.id == userId);
  if (!user) next({ status: 404, message: `User ${req.params.id} not found!` });

  book.isBorrowed = true;
  book.borrows.push({ date: new Date().toISOString(), userId });
  user.borrowedBooks.push(book.id);

  res.status(200).json({ message: "Book borrowed successfully", book, user });
};
 
export const returnBook = (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) next({ status: 404, message: `Book ${req.params.id} not found!` });
  if (!book.isBorrowed) next({ status:400, message: `Book ${req.params.id}is not borrowed` });

  const { userId } = req.body;
  const user = users.find(u => u.id == userId);
  if (!user) next({ status: 404, message: `User ${req.params.id} not found!` });

  book.isBorrowed = false;
  user.borrowedBooks = user.borrowedBooks.filter(id => id !== book.id);

  res.status(200).json({ message: "Book returned successfully", book, user });
};