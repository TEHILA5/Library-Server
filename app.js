import express from 'express';
import dotenv from "dotenv";
import bookRoutes from './routes/book.route.js';
import userRoutes from './routes/user.route.js';
import {addCurrentDate} from'./middlewares/date.Middleware.js';
import { blockDays } from './middlewares/blockDays.Middleware.js';
import { printDAte } from './middlewares/printDate.Middleware.js';
import { notFoundHandler } from './middlewares/errors.Middleware.js';
import { errorHandler } from './middlewares/errors.Middleware.js';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config(); 
const app = express();
app.use(express.static("public"));
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(addCurrentDate); 
app.use(blockDays([5,6], 12, 22)); 
app.use(printDAte);

app.use("/books", bookRoutes);
app.use("/users", userRoutes);

app.use(notFoundHandler); 
app.use(errorHandler);

app.all("/", (req, res) => {
  res.send("This is my server!");
});


const port = process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


