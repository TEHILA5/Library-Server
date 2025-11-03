import express from 'express'
import dotenv from "dotenv";
import bookRoutes from './routes/book.route'
import userRoutes from './routes/user.route'

dotenv.config(); 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bookRoutes);
app.use(userRoutes)

app.all("/", (req, res) => {
  res.send("This is my server!");
});


const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


