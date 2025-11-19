import { users } from "../db_users.js";

export const getAllUsers = (req, res,next) => {
  res.status(200).json(users);
};

export const signUp = (req, res,next) => {
  const {id, username, email, password } = req.body;  
  const newUser = { id, username, email, password, borrowedBooks: [] };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const signIn = (req, res,next) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) next({ status: 401, message: `Invalid credentials!` });  
  res.status(200).json({ message: "Signed in successfully", user });
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