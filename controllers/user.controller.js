import { isValidObjectId, model, Schema, SchemaType } from "mongoose"; 
import bcrypt from "bcryptjs";
import {User,  generateToken } from "../models/user.model.js";


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
    const { username, email, phone, password, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) return next({ status: 409, message: "Email already in use" });

    const newUser = new User({
      username,
      email,
      phone,
      password,
      role: role || 'user',
      borrowedBooks: []
    });

    await newUser.save(); 
    const token = generateToken({ user_id: newUser._id, role: newUser.role });
    res.status(201).json({ 
      user: newUser, 
      token 
    });
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
      return next({ status: 403, message: `Authentication failed` });
    }

    const isMatch = await user.comparePasswords(password);
    if (!isMatch) {
      return next({ status: 403, message: `Authentication failed` });
    } 
    
    const token = generateToken({ user_id: user._id, role: user.role })
    return res.json({ token: token });

  } catch (error) {
    next({ status: 403, message: `Authentication failed` });
  }
};

export const updateUser = async (req, res, next) => {
  const id = req.currentUser.user_id;
  const userEmail = req.currentUser.email;
  if (!isValidObjectId(id)) {
    return next({ status: 400, message: "Invalid user id" });
  }

  try {
    if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
    }
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