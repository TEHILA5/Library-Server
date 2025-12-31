import Joi from 'joi';
import { model, Schema, SchemaType } from "mongoose";
import bcrypt from "bcrypt";

export const userValidation = {
    signUp: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(israelPhone).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
    repeat_password: Joi.ref('password'),
  }),
  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
  }),
  updateUser: Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(israelPhone),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
  }),
  addBorrowedBook: Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required()
  }),

  addCourse: Joi.object({
    courseName: Joi.string().min(2).required()
  })
};

const israel = /^(\+972|0)([2-9]{1})([0-9]{7})$/;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true
  },
  phone: { 
    type: String, 
    validate: {
      validator: function(v) {
        return israel.test(v);
      },
      message: props => `${props.value} The phone number is invalid!`
    },
    required: [true]
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [4] 
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  },
  borrowedBooks: [ 
    {
      bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
      bookName: { type: String, required: true },
      dueDate: { type: Date, required: true }
    }
  ]
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next(); 
  try {
    const saltRounds = 12;
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
    next();
  } catch (err) {
    next(err);
  }
});

export const User =model('User', userSchema); 