import { isValidObjectId } from "mongoose";
import {User} from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    next({ sstatus: 500,message: error.message });
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) return next({ status: 400, message: "Email already in use" });

    const newUser = new User({
      name,
      email,
      phone,
      password,
      borrowedBooks: []
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next({ status: 500,message: error.message });
  }
};


export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), password });
    if (!user) return next({ status: 401, message: "Invalid user!" });

    res.status(200).json({ message: "Signed in successfully", user });
  } catch (error) {
    next({ status: 500,message: error.message });
  }
};

export const updateUser = (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) next({ status: 404, message: `User not found` }); 
  Object.assign(user, req.body); 
  res.status(200).json({ message: "User updated", user });
};

export const addCourse = (req, res, next) => {
  const user = users.find(u => u.id == req.params.id);
  if (!user) return next({ status: 404, message: `User not found` }); 
  if (!user.courses) user.courses = []; 
  user.courses.push(req.body.courseName); 
  res.status(200).json({ message: "Course added", user });
};