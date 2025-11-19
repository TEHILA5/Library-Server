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