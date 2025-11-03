import express from "express";
import { books } from "../db_books";
import { users } from "../db_users";
const router = express.Router();

router.all("/", (req, res) => {
  res.send("This is my server!");
});

router.get('/books', (req, res) => {
  let results = books;  
  const { name, limit = 2, page = 1 } = req.query;  

  if (name) {
    const search = name.toLowerCase();
    results = results.filter(b => b.name.toLowerCase().includes(search));
  } 
  const start = (page - 1) * limit; 
  const end = start + (+limit);  
  const paginated = results.slice(start, end); 

  res.json({
    total: results.length,
    page: (+page),
    limit: (+limit),
    results: paginated
  });
});

router.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id == +req.params.id); 
  if (!book) return res.status(404).send("There is no such a book!");
  res.json(book);
});

router.post('/books', (req, res) => {
    console.log(req.body);

    books.push(req.body);

    res.status(201).json(req.body);
});

router.put("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id); 
  if (!index) return res.status(404).send("There is no such a book!");
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

router.patch("/books/:id/borrow", (req, res) => {
  const book = books.find(b => b.id == req.params.id); 
  if (!book) return res.status(404).send("There is no such a book!");
  if (book.isBorrowed) return res.status(400).send("The book is already borrowed!");
  const { userId } = req.body; 
  const user = users.find(u => u.id == userId);
  if (!user) return res.status(404).send("User not found");
  book.isBorrowed = true;
  book.borrows.push({ date: new Date().toISOString(), userId });
  user.borrowedBooks.push(book.id);
  res.json({ book, user });
});

router.patch("/books/:id/return", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).send("There is no such a book!");
  const user = users.find(u => u.borrowedBooks.includes(book.id));
  if (user) {
    user.borrowedBooks = user.borrowedBooks.filter(id => id !== book.id);
  }
  book.isBorrowed = false;
  res.json({ book, user });
});

router.delete("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id);
  if (!index) return res.status(404).send("There is no such a book!");
  books.splice(index, 1);
  res.send("deleting success!");
});