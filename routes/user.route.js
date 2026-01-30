import express from "express";
import { getAllUsers, signUp, signIn, updateUser} from "../controllers/user.controller.js";
import { joiValidator } from "../middlewares/joi-validator.middleware.js";
import {userValidation} from '../models/user.model.js'
import { auth, isAdmin, isOwner } from '../middlewares/auth.Middleware.js';
const router = express.Router();

router.get("/", auth, isAdmin, getAllUsers);
 
router.post("/sign-up", joiValidator(userValidation.signUp), signUp);
 
router.post("/sign-in", joiValidator(userValidation.signIn), signIn);

router.patch("/update", auth, isOwner, joiValidator(userValidation.updateUser), updateUser);

//router.post("/:id/courses", joiValidator(userValidation.addCourse), addCourse);

export default router;