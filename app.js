import express from 'express'
import { books } from "./db_books.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all("/", (req, res) => {
  res.send("This is my server!");
});


const port = 5000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


