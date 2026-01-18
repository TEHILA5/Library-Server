import Joi from 'joi';
import { model, Schema, SchemaType } from "mongoose";
import bcrypt from "bcryptjs";



const israel = /^(?:\+972|0)5[0-9]{8}$/;


export const userValidation = {
    signUp: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(israel).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
    repeat_password: Joi.string()
   .valid(Joi.ref('password'))
   .required(),
  }),
  signIn: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{4,30}$')).required(),
  }),
  updateUser: Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    phone: Joi.string().pattern(israel),
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

userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const saltRounds = 12;
  const hashed = await bcrypt.hash(this.password, saltRounds);
  this.password = hashed;
});

userSchema.methods.comparePasswords = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform(doc, converted) {
    delete converted.__v;
    delete converted._id;
    delete converted.password;
  }
});

export const User =model('User', userSchema); 