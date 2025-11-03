import express from "express";
import { getAllUsers, signUp, signIn } from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", getAllUsers);
 
router.post("/sign-up", signUp);
 
router.post("/sign-in", signIn);

export default router;