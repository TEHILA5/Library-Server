import { isValidObjectId, model, Schema, SchemaType } from "mongoose";
import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    next({ status: 500,message: error.message });
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { username, email, phone, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) return next({ status: 409, message: "Email already in use" });

    const newUser = new User({
      username,
      email,
      phone,
      password,
      borrowedBooks: []
    });

    await newUser.save(); 
    res.status(201).json(newUser);
  } 
  catch (error) {
    next({ status: 500,message: error.message });
  }
};


export const signIn =async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next({ status: 401, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      return next({ status: 401, message: "Invalid email or password" });
    } 
    res.status(200).json({ message: "Signed in successfully", user });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return next({ status: 400, message: "Invalid user id" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next({ status: 404, message: "User not found" });
    }

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    next({ status: 500, message: error.message });
  }
};


//export const addCourse = (req, res, next) => {
//  const user = users.find(u => u.id == req.params.id);
//  if (!user) return next({ status: 404, message: `User not found` }); 
//  if (!user.courses) user.courses = []; 
//  user.courses.push(req.body.courseName); 
//  res.status(200).json({ message: "Course added", user });
//};