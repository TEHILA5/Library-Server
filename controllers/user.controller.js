import { users } from "../db_users";

export const getAllUsers = (req, res) => {
  res.status(200).json(users);
};

export const signUp = (req, res) => {
  const {id, username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });
  const newUser = { id, username, email, password, borrowedBooks: [] };
  users.push(newUser);
  res.status(201).json(newUser);
};

export const signIn = (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.status(200).json({ message: "Signed in successfully", user });
};