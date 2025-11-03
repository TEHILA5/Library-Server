import express from "express";
import { users } from "../db_users";
const router = express.Router();

router.get("/", (req, res) => res.json(users));

router.post("/sign-up", (req, res) => {
  const { username, email, password } = req.body;
  const newUser = { id: users.length + 1, username, email, password, borrowedBooks: [] };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.post("/sign-in", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).send("Invalid email or password");
  res.json({ message: "Sign-in successful", user });
}); 

export default router;