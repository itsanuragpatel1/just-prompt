import { Router } from "express";
import { getAllImages, getAllProjects, getEditedImages, getEditProjects, getGeneratedImages, getGenerateProjects, getProfile, getUser, projects } from "../controllers/userController.js";
import { auth } from "../middlewares/authMiddleware.js";

const userRoutes=Router();

userRoutes.get('/getUser',getUser);
userRoutes.get('/profile',auth,getProfile);

userRoutes.get('/project/:type',auth,projects);

userRoutes.get('/all-images',auth,getAllImages);
userRoutes.get('/edited-images',auth,getEditedImages);
userRoutes.get('/generated-images',auth,getGeneratedImages)

userRoutes.get('/all-projects',auth,getAllProjects);
userRoutes.get('/edit-projects',auth,getEditProjects);
userRoutes.get('/generated-projects',auth,getGenerateProjects)


// userRoutes.post('/projectType',auth,);

export {userRoutes};