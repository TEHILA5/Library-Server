import express from 'express'
import { books } from "./db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/", (req, res) => {
  res.send("This is my server!");
});

app.get('/books',(req,res)=>{
    res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find(b => b.id == +req.params.id); 
  if (!book) return res.status(404).send("There is no such a book!");
  res.json(book);
});

app.post('/books', (req, res) => {
    console.log(req.body);

    books.push(req.body);

    res.send(req.body);
});

app.put("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id); 
  if (!index) return res.status(404).send("There is no such a book!");
  books[index] = { ...books[index], ...req.body };
  res.json(books[index]);
});

app.patch("/books/:id/borrow", (req, res) => {
  const book = books.find(b => b.id == req.params.id); 
  if (!book) return res.status(404).send("There is no such a book!");
  if (book.isBorrowed) return console.log("The book is already borrowed!");
  const { userId } = req.params.userId;
  book.isBorrowed = true;
  book.borrows.push({ date: new Date().toISOString(), userId });
  res.json(book);
});

app.patch("/books/:id/return", (req, res) => {
  const book = books.find(b => b.id == req.params.id);
  if (!book) return res.status(404).send("There is no such a book!");
  book.isBorrowed = false;
  res.json(book);
});

app.delete("/books/:id", (req, res) => {
  const index = books.findIndex(b => b.id == req.params.id);
  if (!book) return res.status(404).send("There is no such a book!");
  books.splice(index, 1);
  res.send("deleting success!");
});

const port = 5000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


