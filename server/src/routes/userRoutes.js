import { Router } from "express";
import { getProfile, getUser, projects } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const userRoutes=Router();

userRoutes.get('/getUser',getUser);
userRoutes.get('/profile',auth,getProfile);

userRoutes.get('/project/:type',auth,projects);
// userRoutes.post('/projectType',auth,);

export {userRoutes};