import Joi from 'joi';
import { model, Schema, SchemaType } from "mongoose";
 
export const validateBook = {
  addBook: Joi.object({
    name: Joi.string().min(2).max(20).required(),
    category: Joi.string().valid("Fantasy","Voltage","Emotion").required(),
    price: Joi.number().required()
  }),
  borrowBook: Joi.object({
    userId: Joi.number().required()
  }),
  returnBook: Joi.object({
    userId: Joi.number().required()
  })
};

const bookSchema = new Schema({
    name: { type: String, unique: true },
    price: Number,
    img: String,
    categories: [String], 
    author: { 
        _id: Schema.Types.ObjectId,
        name: String,
        email: String,
    }
});

export const Book = model('Book', bookSchema); 
