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
    category: [String], 
    author: { 
        _id: Schema.Types.ObjectId,
        name: String,
        email: String,
    },
    isBorrowed: { type: Boolean, default: false },
    currentBorrow: { 
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    dueDate: Date
    },
    borrowsHistory: [ 
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      borrowedAt: { type: Date, default: Date.now },
      returnedAt: Date
    }
    ]
});

export const Book = model('Book', bookSchema); 
